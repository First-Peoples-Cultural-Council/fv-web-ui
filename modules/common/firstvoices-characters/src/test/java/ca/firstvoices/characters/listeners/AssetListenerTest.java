package ca.firstvoices.characters.listeners;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;

import ca.firstvoices.characters.services.CleanupCharactersServiceImpl;
import ca.firstvoices.data.schemas.DialectTypesConstants;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.event.EventService;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({CoreFeature.class})
@RepositoryConfig(cleanup = Granularity.METHOD)
@Deploy({"FirstVoicesCharacters"})
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-workspace.yaml"})
public class AssetListenerTest extends AbstractTestDataCreatorTest {

  DocumentModel dialect = null;
  DocumentModel alphabet = null;
  DocumentModel dictionary = null;
  DocumentModel char1 = null;

  @Inject
  CoreSession session;

  @Inject
  EventService eventService;

  @Before
  public void initCharacterTests() {
    assertNotNull("Asset listener registered", eventService.getEventListener("asset_listener"));

    // Children containers will be created in FVDialectFactory
    dialect = dataCreator.getReference(session, "testDialect");
    alphabet = session.getChild(dialect.getRef(), "Alphabet");
    dictionary = session.getChild(dialect.getRef(), "Dictionary");

    // Create one character (but don't trigger listener)
    char1 = createCharacterModel("char1");
    char1.setPropertyValue("dc:title", "o");
    char1.setPropertyValue(CleanupCharactersServiceImpl.LC_CONFUSABLES, new String[]{"$"});
    char1.putContextData(CharacterListener.DISABLE_CHARACTER_LISTENER, true);
    session.createDocument(char1);
  }

  @Test
  public void shouldIgnoreDisableEvent() {
    DocumentModel word1 =
        createWord(" word1 ");

    word1.putContextData(AssetListener.DISABLE_CHAR_ASSET_LISTENER, true);

    session.createDocument(word1);
    session.save();

    assertEquals(" word1 ", session.getDocument(word1.getRef()).getTitle());
  }

  @Test
  public void shouldHandleCreateAndUpdateEvent() {
    String untreatedWordTitle = " w$rd2 ";
    DocumentModel word2 = createWord(untreatedWordTitle);

    session.createDocument(word2);
    session.save();

    assertEquals("word2", session.getDocument(word2.getRef()).getTitle());

    String customOrder = String.valueOf(session.getDocument(word2.getRef()).getPropertyValue("fv:custom_order"));
    assertNotNull(customOrder);

    // We need to re-enable the listener for this document
    word2.putContextData(AssetListener.DISABLE_CHAR_ASSET_LISTENER, null);

    word2.setPropertyValue("dc:title", untreatedWordTitle + "$$");
    session.saveDocument(word2);
    session.save();

    assertEquals("word2 oo", session.getDocument(word2.getRef()).getTitle());

    String newCustomOrder = String.valueOf(session.getDocument(word2.getRef()).getPropertyValue("fv:custom_order"));

    assertNotEquals(customOrder, newCustomOrder);
  }

  private DocumentModel createWord(String title) {
    DocumentModel word1 = session.createDocumentModel(dictionary.getPathAsString(), title, DialectTypesConstants.FV_WORD);
    word1.setPropertyValue("dc:title", title);
    return word1;
  }

  private DocumentModel createCharacterModel(String name) {
    // Create one character (but don't trigger listener)
    return session
        .createDocumentModel(alphabet.getPathAsString(), name, DialectTypesConstants.FV_CHARACTER);
  }
}
