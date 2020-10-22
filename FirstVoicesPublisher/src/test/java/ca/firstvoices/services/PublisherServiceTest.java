package ca.firstvoices.services;

import static ca.firstvoices.data.lifecycle.Constants.DISABLED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.DISABLE_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.ENABLED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.ENABLE_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.NEW_STATE;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISH_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.REVERT_TO_NEW;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_AUDIO;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CATEGORY;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CHARACTER;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CONTRIBUTOR;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_LINK;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import ca.firstvoices.core.io.utils.PropertyUtils;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import ca.firstvoices.tests.mocks.services.MockDialectService;
import java.util.ArrayList;
import java.util.List;
import javax.inject.Inject;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.core.event.EventService;
import org.nuxeo.ecm.core.event.impl.EventListenerDescriptor;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.mockito.MockitoFeature;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.transaction.TransactionHelper;

@RunWith(FeaturesRunner.class)
@Features({CoreFeature.class, MockitoFeature.class})
@RepositoryConfig(cleanup = Granularity.METHOD)
@Deploy({
    "org.nuxeo.ecm.platform.publisher.core",
    "FirstVoicesCoreIO",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.services.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.schemas.ProxySchema.xml",
    "FirstVoicesCoreTests:OSGI-INF/nuxeo.conf.override.xml"
})
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-workspace.yaml"})
public class PublisherServiceTest extends AbstractTestDataCreatorTest {

  @Inject
  protected FirstVoicesPublisherService fvPublisherService;

  @Inject
  protected MockDialectService mockDialectService;

  @Inject
  CoreSession session;

  DocumentModel dialect = null;

  DocumentModel portal = null;

  DocumentModelList words = null;

  DocumentModelList phrases = null;

  DocumentModel dictionary = null;

  DocumentModel alphabet = null;

  @BeforeClass
  public static void unregisterEvents() {
    // Remove ancestry, publish, and bulk life cycle listeners
    // To help isolate testing to the service
    EventService eventService = Framework.getService(EventService.class);
    String[] listeners = new String[] { "ancestryAssignmentListener", "ProxyPublishedListener", "bulkLifeCycleChangeListener" };

    for (String listener : listeners) {
      EventListenerDescriptor listenerDescriptor = eventService.getEventListener(listener);

      if (listenerDescriptor != null) {
        eventService.removeEventListener(listenerDescriptor);
      }
    }
  }

  @Before
  public void setUp() {
    dialect = session.getDocument(new IdRef(this.dataCreator.getReference("testDialect")));
    dictionary = session.getDocument(new IdRef(this.dataCreator.getReference("testDictionary")));
    alphabet = session.getDocument(new IdRef(this.dataCreator.getReference("testAlphabet")));
    portal = session.getDocument(new IdRef(this.dataCreator.getReference("testPortal")));

    DocumentModel workspacesData = session
        .getDocument(new IdRef(this.dataCreator.getReference("workspaceData")));
    DocumentModel sectionsData = session
        .getDocument(new IdRef(this.dataCreator.getReference("sectionsData")));

    // Create an alphabet character
    session.createDocument(
        session.createDocumentModel(alphabet.getPathAsString(), "Character1", FV_CHARACTER));

    // Create some words for the tests
    String[] wordsArray = new String[]{"NewWord1", "NewWord2", "NewWord3", "NewWord4", "NewWord5"};

    words = mockDialectService.generateFVWords(
        session, dialect.getPathAsString(), wordsArray, null);

    // Transition 2 words to states other than new
    words.get(0).followTransition(ENABLE_TRANSITION);
    words.get(1).followTransition(DISABLE_TRANSITION);

    // Create some phrases for the tests
    phrases = mockDialectService.generateFVPhrases(
        session, dialect.getPathAsString(), 2,
        wordsArray, null);

    // Set publication target
    workspacesData.setPropertyValue("publish:sections", new String[]{sectionsData.getId()});

    session.save();

    TransactionHelper.commitOrRollbackTransaction();
    TransactionHelper.startTransaction();
  }

  @After
  public void cleanup() {
    // Revert all states back to new
    DocumentModelList allDocs = session.query("SELECT * FROM Document WHERE ecm:isProxy = 0");

    for (DocumentModel doc : allDocs) {
      if (doc.getAllowedStateTransitions().contains(REVERT_TO_NEW)) {
        doc.followTransition(REVERT_TO_NEW);
      }
    }

    // Remove all proxies
    DocumentModelList allProxies = session.query("SELECT * FROM Document WHERE ecm:isProxy = 1");

    for (DocumentModel proxyDoc : allProxies) {
      if (session.exists(proxyDoc.getRef())) {
        session.removeDocument(proxyDoc.getRef());
      }
    }
  }

  @Test
  public void shouldTransitionDialectToPublish() {
    assertEquals(NEW_STATE, dialect.getCurrentLifeCycleState());
    fvPublisherService.transitionDialectToPublished(session, dialect);

    dialect = session.getDocument(dialect.getRef());
    dictionary = session.getDocument(dictionary.getRef());
    portal = session.getDocument(portal.getRef());

    assertEquals(PUBLISHED_STATE, dialect.getCurrentLifeCycleState());
    assertEquals(PUBLISHED_STATE, dictionary.getCurrentLifeCycleState());
    assertEquals(PUBLISHED_STATE, portal.getCurrentLifeCycleState());
    assertEquals(PUBLISHED_STATE, words.get(0).getCurrentLifeCycleState());

    // Children of Alphabet should follow whatever transition the dialect did
    for (DocumentModel character : session.getChildren(alphabet.getRef())) {
      assertEquals(PUBLISHED_STATE, character.getCurrentLifeCycleState());
    }

    session.save();

    assertEquals(5, getDocsInStateInDialect(dialect.getId(), NEW_STATE).totalSize());
    assertEquals(0, getDocsInStateInDialect(dialect.getId(), ENABLED_STATE).totalSize());
    assertEquals(1, getDocsInStateInDialect(dialect.getId(), DISABLED_STATE).totalSize());
  }

  @Test
  public void shouldCreateProxiesForDialect() {
    // Must transition dialect first so that assets within can be published
    shouldTransitionDialectToPublish();

    // Create links
    DocumentModelList links = createLinks(2);

    dialect.setPropertyValue("fvdialect:keyboards", new String[]{links.get(0).getId()});
    dialect.setPropertyValue("fvdialect:language_resources", new String[]{links.get(1).getId()});

    session.saveDocument(dialect);

    // Create proxy for dialect
    fvPublisherService.publish(session, dialect);

    // Ensure dialect has proxy
    DocumentModel dialectProxy = fvPublisherService.getPublication(session, dialect.getRef());
    assertNotNull(dialectProxy);

    // Ensure links, and links parent have proxies
    DocumentModel link1Proxy = fvPublisherService.getPublication(session, links.get(0).getRef());
    DocumentModel link2Proxy = fvPublisherService.getPublication(session, links.get(1).getRef());
    DocumentModel linksProxy = fvPublisherService
        .getPublication(session, links.get(1).getParentRef());

    assertNotNull(link1Proxy);
    assertNotNull(link2Proxy);
    assertNotNull(linksProxy);

    // Test proxy fields for dialect
    assertEquals(link1Proxy.getId(),
        PropertyUtils.getValuesAsList(dialectProxy, "fvproxy:proxied_keyboards").get(0));
    assertEquals(link2Proxy.getId(),
        PropertyUtils.getValuesAsList(dialectProxy, "fvproxy:proxied_language_resources").get(0));
  }

  @Test
  public void shouldRemoveProxiesForDialect() {
    fvPublisherService.publish(session, dialect);
    assertNotNull(fvPublisherService.getPublication(session, dialect.getRef()));

    fvPublisherService.unpublish(dialect);
    assertNull(fvPublisherService.getPublication(session, dialect.getRef()));
  }

  @Test
  public void shouldCreateProxyForPortal() {
    shouldCreateProxiesForDialect();

    // Set some fields on portal
    // Other fields should follow similar logic: fv-portal:background_top_image, fv-portal:featured_audio
    // fv-portal:logo,
    DocumentModelList links = createLinks(1);

    portal.setPropertyValue("fv-portal:featured_words",
        new String[]{words.get(0).getId(), words.get(2).getId()});
    portal.setPropertyValue("fv-portal:related_links", new String[]{links.get(0).getId()});

    session.saveDocument(portal);

    // Publish portal (and related assets)
    fvPublisherService.publish(session, portal);

    // Ensure portal has proxy
    DocumentModel portalProxy = fvPublisherService.getPublication(session, portal.getRef());
    assertNotNull(portalProxy);

    // Ensure links, and links parent have proxies
    DocumentModel link1Proxy = fvPublisherService.getPublication(session, links.get(0).getRef());
    assertNotNull(link1Proxy);

    // Ensure related words proxies
    DocumentModel word1Proxy = fvPublisherService.getPublication(session, words.get(0).getRef());
    DocumentModel word2Proxy = fvPublisherService.getPublication(session, words.get(2).getRef());

    assertNotNull(word1Proxy);
    assertNotNull(word2Proxy);

    ArrayList<String> expectedProxyWordIds = new ArrayList<>();
    expectedProxyWordIds.add(word1Proxy.getId());
    expectedProxyWordIds.add(word2Proxy.getId());
    expectedProxyWordIds.sort(String::compareToIgnoreCase);

    List<String> proxyWordIds = PropertyUtils.getValuesAsList(portalProxy, "fvproxy:proxied_words");
    proxyWordIds.sort(String::compareToIgnoreCase);

    // Test proxy fields for dialect
    assertEquals(link1Proxy.getId(),
        PropertyUtils.getValuesAsList(portalProxy, "fvproxy:proxied_related_links").get(0));
    assertEquals(expectedProxyWordIds, proxyWordIds);
  }

  @Test
  public void shouldCreateProxyForAsset() {
    DocumentModel word = words.get(0);
    DocumentModel phrase = phrases.get(0);

    // Must transition dialect first + create proxy so that assets within can be published
    shouldCreateProxiesForDialect();

    // Create related assets. This is a subset of fields set on an asset proxy.
    // Other fields should follow similar logic
    DocumentModel audio = session
        .createDocumentModel(dialect.getPathAsString() + "/Resources", "AudioFile1", FV_AUDIO);
    audio = session.createDocument(audio);

    DocumentModel recorder = session
        .createDocumentModel(dialect.getPathAsString() + "/Contributors", "Recorder",
            FV_CONTRIBUTOR);
    recorder = session.createDocument(recorder);
    session.saveDocument(recorder);

    audio.setPropertyValue("fvmedia:recorder", new String[]{recorder.getId()});
    audio.setPropertyValue("fvmedia:origin", word.getId());
    session.saveDocument(audio);

    // Category
    DocumentModel category = session
        .createDocumentModel(dialect.getPathAsString() + "/Categories", "Category1", FV_CATEGORY);
    category = session.createDocument(category);
    session.saveDocument(category);

    // Set properties on word
    word.setPropertyValue("dc:title", "WordTitle1");
    word.setPropertyValue("fv:related_audio", new String[]{audio.getId()});
    word.setPropertyValue("fv-word:categories", new String[]{category.getId()});
    word.setPropertyValue("fv-word:related_phrases", new String[]{phrase.getId()});
    session.saveDocument(word);

    // Publish word
    fvPublisherService.publish(session, word);

    // Test proxies
    DocumentModel wordProxy = fvPublisherService.getPublication(session, word.getRef());
    assertNotNull(wordProxy);

    DocumentModel phraseProxy = fvPublisherService.getPublication(session, phrase.getRef());
    assertNotNull(phraseProxy);

    DocumentModel recorderProxy = fvPublisherService.getPublication(session, recorder.getRef());
    assertNotNull(recorderProxy);

    DocumentModel audioProxy = fvPublisherService.getPublication(session, audio.getRef());
    assertNotNull(audioProxy);

    DocumentModel categoryProxy = fvPublisherService.getPublication(session, category.getRef());
    assertNotNull(categoryProxy);

    // Test proxy fields for words
    assertEquals(categoryProxy.getId(),
        PropertyUtils.getValuesAsList(wordProxy, "fvproxy:proxied_categories").get(0));
    assertEquals(phraseProxy.getId(),
        PropertyUtils.getValuesAsList(wordProxy, "fvproxy:proxied_phrases").get(0));
    assertEquals(audioProxy.getId(),
        PropertyUtils.getValuesAsList(wordProxy, "fvproxy:proxied_audio").get(0));

    // Test proxy fields for audio
    assertEquals(wordProxy.getId(), audioProxy.getPropertyValue("fvproxy:proxied_origin"));
    assertEquals(recorderProxy.getId(),
        PropertyUtils.getValuesAsList(audioProxy, "fvproxy:proxied_recorder").get(0));
  }

  @Test
  public void shouldRepublishDialect() {
    // Must transition dialect first so that assets within can be published
    shouldCreateProxiesForDialect();

    DocumentModel dialectProxy = fvPublisherService.getPublication(session, dialect.getRef());
    assertNotNull(dialectProxy);

    assertEquals(1,
        PropertyUtils.getValuesAsList(dialectProxy, "fvproxy:proxied_keyboards").size());

    // Add 1 more link
    DocumentModelList links = createLinks(2);
    dialect.setPropertyValue("fvdialect:keyboards",
        new String[]{links.get(0).getId(), links.get(1).getId()});

    session.saveDocument(dialect);

    // Republish dialect
    fvPublisherService.republish(dialect);
    session.save();

    // Get proxy again
    dialectProxy = fvPublisherService.getPublication(session, dialect.getRef());

    // Ensure proxy is updated
    assertEquals(2,
        PropertyUtils.getValuesAsList(dialectProxy, "fvproxy:proxied_keyboards").size());
  }

  @Test
  public void shouldRepublishAsset() {
    shouldCreateProxyForAsset();

    DocumentModel word = words.get(0);
    DocumentModel wordProxy = fvPublisherService.getPublication(session, word.getRef());

    assertNotNull(word);
    assertNotNull(wordProxy);

    assertEquals("WordTitle1", wordProxy.getPropertyValue("dc:title"));
    assertEquals(1, PropertyUtils.getValuesAsList(wordProxy, "fv-word:related_phrases").size());

    // Change title
    word.setPropertyValue("dc:title", "WordTitle2");

    // Remove related phrases
    word.setPropertyValue("fv-word:related_phrases", null);

    session.saveDocument(word);

    // Republish word
    fvPublisherService.republish(word);
    session.save();

    // Get proxy again
    wordProxy = session.getDocument(wordProxy.getRef());

    // Ensure proxy is updated
    assertEquals("WordTitle2", wordProxy.getPropertyValue("dc:title"));
    assertEquals(0, PropertyUtils.getValuesAsList(wordProxy, "fv-word:related_phrases").size());
  }


  @Test
  public void shouldNotPublishInNewDialect() {
    DocumentModel publishedDoc = fvPublisherService.publish(session, words.get(0));
    assertNull(publishedDoc);
  }

  @Test
  public void shouldNotPublishInDialectWithNoProxy() {
    dialect.followTransition(PUBLISH_TRANSITION);
    DocumentModel publishedDoc = fvPublisherService.publish(session, words.get(0));
    assertNull(publishedDoc);
  }

  @Test
  public void shouldNotRepublishInNewDialect() {
    fvPublisherService.republish(words.get(0));
    assertNull(fvPublisherService.getPublication(session, words.get(0).getRef()));
  }

  @Test
  public void shouldNotRepublishInDialectWithNoProxy() {
    dialect.followTransition(PUBLISH_TRANSITION);
    fvPublisherService.republish(words.get(0));
    assertNull(fvPublisherService.getPublication(session, words.get(0).getRef()));
  }

  @Test
  public void shouldUnpublishDialect() {
    shouldTransitionDialectToPublish();
    fvPublisherService.publish(session, dialect);

    // Direct children have published
    assertEquals(PUBLISHED_STATE, dictionary.getCurrentLifeCycleState());

    fvPublisherService.unpublish(dialect);

    session.save();

    // Get updated docs
    dialect = session.getDocument(dialect.getRef());
    portal = session.getDocument(portal.getRef());
    dictionary = session.getDocument(dictionary.getRef());
    DocumentModel word = session.getDocument(words.get(0).getRef());

    // The dialect itself is not transitioned, since it is intended to
    // trigger this via a listener when transitioned
    assertEquals(PUBLISHED_STATE, dialect.getCurrentLifeCycleState());

    // Direct children should be
    assertEquals(ENABLED_STATE, dictionary.getCurrentLifeCycleState());
    assertEquals(ENABLED_STATE, portal.getCurrentLifeCycleState());

    // Grand-children will be handled via subsequent listener
    // so they will still be in the published state
    assertEquals(PUBLISHED_STATE, word.getCurrentLifeCycleState());

    // Children of Alphabet should still be published
    // Handled via listener as well
    for (DocumentModel character : session.getChildren(alphabet.getRef())) {
      assertEquals(PUBLISHED_STATE, character.getCurrentLifeCycleState());
    }

    session.save();

    // 1 word + 1 character (handled via subsequent listener than fires after Dictionary transitions)
    assertEquals(2, getDocsInStateInDialect(dialect.getId(), PUBLISHED_STATE).totalSize());
    assertEquals(session.getChildren(dialect.getRef()).size(),
        getDocsInStateInDialect(dialect.getId(), ENABLED_STATE).totalSize());
    assertEquals(1, getDocsInStateInDialect(dialect.getId(), DISABLED_STATE).totalSize());

    // Proxies should be gone
    assertNull(fvPublisherService.getPublication(session, dialect.getRef()));
    assertNull(fvPublisherService.getPublication(session, dictionary.getRef()));
    assertNull(fvPublisherService.getPublication(session, portal.getRef()));
  }

  @Test
  public void shouldUnpublishAsset() {
    DocumentModel word = words.get(0);

    shouldCreateProxyForAsset();
    fvPublisherService.unpublish(word);

    session.save();

    // Get updated docs
    word = session.getDocument(word.getRef());

    // The word itself is not transitioned, since it is intended to
    // trigger this via a listener when transitioned
    assertEquals(PUBLISHED_STATE, word.getCurrentLifeCycleState());

    // Proxy should be gone for word
    assertNull(fvPublisherService.getPublication(session, word.getRef()));
  }

  private DocumentModelList getDocsInStateInDialect(String dialectId, String state) {
    TransactionHelper.commitOrRollbackTransaction();
    TransactionHelper.startTransaction();

    return session.query(String.format(
        "SELECT * FROM Document WHERE ecm:ancestorId = '%s' AND ecm:currentLifeCycleState = '%s'",
        dialectId, state));
  }

  private DocumentModelList createLinks(int max) {
    DocumentModelList links = new DocumentModelListImpl();

    for (int i = 0; i <= max; ++i) {
      DocumentModel link = session
          .createDocumentModel(dialect.getPathAsString() + "/Links", "Link" + i, FV_LINK);
      links.add(session.createDocument(link));
    }

    return links;
  }
}
