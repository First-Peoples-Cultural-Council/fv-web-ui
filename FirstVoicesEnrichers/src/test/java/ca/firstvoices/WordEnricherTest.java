package ca.firstvoices;

import ca.firstvoices.EnricherTestUtil;
import ca.firstvoices.nuxeo.enrichers.WordEnricher;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.elasticsearch.test.RepositoryElasticSearchFeature;
import org.nuxeo.runtime.test.runner.*;

import org.nuxeo.ecm.core.io.marshallers.json.document.DocumentModelJsonWriter;
import org.nuxeo.ecm.core.io.marshallers.json.AbstractJsonWriterTest;
import org.nuxeo.ecm.core.io.marshallers.json.JsonAssert;
import org.nuxeo.ecm.core.io.registry.context.RenderingContext;
import org.nuxeo.ecm.core.io.registry.context.RenderingContext.CtxBuilder;

import javax.inject.Inject;

import static org.junit.Assert.*;

@RunWith(FeaturesRunner.class)
@Features({ AutomationFeature.class, PlatformFeature.class, RuntimeFeature.class, CoreFeature.class,
    RepositoryElasticSearchFeature.class })
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)

@Deploy("org.nuxeo.binary.metadata")
@Deploy("org.nuxeo.ecm.platform.url.core")
@Deploy("org.nuxeo.ecm.platform.types.api")
@Deploy("org.nuxeo.ecm.platform.types.core")
@Deploy("org.nuxeo.ecm.platform.filemanager.api")
@Deploy("org.nuxeo.ecm.platform.filemanager.core")
@Deploy("org.nuxeo.ecm.platform.rendition.core")
@Deploy("org.nuxeo.ecm.platform.tag")
@Deploy("org.nuxeo.ecm.platform.commandline.executor")
@Deploy("org.nuxeo.ecm.platform.convert")
@Deploy("org.nuxeo.ecm.platform.preview")

// Audio doctype
@Deploy("org.nuxeo.ecm.platform.audio.core")

// Video doctype
@Deploy("org.nuxeo.ecm.platform.video.convert")
@Deploy("org.nuxeo.ecm.platform.video.core")

// Picture doctype
@Deploy("org.nuxeo.ecm.platform.picture.core")
@Deploy("org.nuxeo.ecm.platform.picture.api")
@Deploy("org.nuxeo.ecm.platform.picture.convert")

// ElasticSearch / Search
@Deploy("org.nuxeo.elasticsearch.core:elasticsearch-test-contrib.xml")
@Deploy("org.nuxeo.ecm.platform.search.core")
@Deploy("org.nuxeo.ecm.platform.webapp.types")

//@Deploy("FirstVoicesData")
@Deploy("FirstVoicesNuxeo:OSGI-INF/extensions/ca.firstvoices.nuxeo.enrichers.xml")
@Deploy("FirstVoicesNuxeo:OSGI-INF/extensions/ca.firstvoices.enrichers.operations.xml")
@PartialDeploy(bundle = "FirstVoicesData", extensions = { TargetExtensions.ContentModel.class })
public class WordEnricherTest extends AbstractJsonWriterTest.Local<DocumentModelJsonWriter, DocumentModel>{

  public WordEnricherTest(){
    super(DocumentModelJsonWriter.class, DocumentModel.class);
  }

  @Inject
  private EnricherTestUtil testUtil;

  @Inject
  protected CoreSession session;

  @Before
  public void setUpTest() {
    testUtil = new EnricherTestUtil();

    assertNotNull("Should have a valid session", session);
    assertNotNull("Should have a valid test utilities obj", testUtil);

    testUtil.createSetup(session);
  }

  @Test
  public void enricherTest() throws Exception {

    // Get the DocumentModels for each of the parent documents
    DocumentModel languageFamily = testUtil.getCurrentLanguageFamily();
    assertNotNull("Language family cannot be null", languageFamily);
    DocumentModel language = testUtil.getCurrentLanguage();
    assertNotNull("Language cannot be null", language);
    DocumentModel dialect = testUtil.getCurrentDialect();
    assertNotNull("Dialect cannot be null", dialect);
    DocumentModel dictionary = testUtil.getCurrentDictionary();
    assertNotNull("Dictionary cannot be null", dictionary);

    // Create a new child document
    DocumentModel TestWord = testUtil.createDocument(session,
        session.createDocumentModel("/FV/Family/Language/Dialect/Dictionary", "TestWord", "FVWord"));
    assertNotNull("Word cannot be null", TestWord);
    // Commit to sesrver: session.save?
    session.save();
    String TestWordID = TestWord.getId();
    System.out.println(TestWordID);
    System.out.println(TestWord.getProperty("title"));

    DocumentModel TestPhrase = testUtil.createDocument(session,
        session.createDocumentModel("/FV/Family/Language/Dialect/Dictionary", "TestPhrase", "FVPhrase"));
    assertNotNull("Word cannot be null", TestPhrase);
    // Commit to sesrver: session.save?
    session.save();
    String TestPhraseID = TestPhrase.getId();
    System.out.println(TestPhraseID);
    String arr[] = { TestPhraseID };

    TestWord.setPropertyValue("fv-word:related_phrases", arr);
    TestWord.setPropertyValue("dc:creator", "dummy");
    TestWord.setPropertyValue("fv-word:part_of_speech", "noun");

    TestPhrase.setPropertyValue("dc:creator", "dummy2");
    System.out.println(TestWord.getProperty("fv-word:related_phrases"));
    System.out.println(TestWord.getProperty("dc:creator"));
    System.out.println(TestWord.getProperty("fv-word:part_of_speech"));
    System.out.println(TestPhrase.getProperty("dc:creator"));
    session.save();

    // DocumentModel obj = session.getDocument(new PathRef("/")); WordEnricher.NAME
    RenderingContext ctx = CtxBuilder.enrichDoc("acl").get();
    JsonAssert json = jsonAssert(TestWord, ctx);
    System.out.println(json.toString());
    //json = json.has("contextParameters").isObject();
    //json.properties(1);
    //json.has(WordEnricher.NAME).isObject();

    // EX. Create phrase X, give title & props, get ID, add to 'fv:relatedphrases',
    // call word w/ enricher (look up how to query w/ enrichers - want word
    // enricher)
    // session.
    // TestWord.setPropertyValue("uid", "c2");
    // System.out.println(TestWord.getPropertyValue("uid"));
  }
}