package ca.firstvoices.listeners;

import ca.firstvoices.testUtil.*;
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

import javax.inject.Inject;

import static org.junit.Assert.*;

@RunWith(FeaturesRunner.class)
@Features({AutomationFeature.class, PlatformFeature.class, RuntimeFeature.class, CoreFeature.class, RepositoryElasticSearchFeature.class})
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

@Deploy("FirstVoicesData:OSGI-INF/ca.firstvoices.services.sanitize.xml")
@Deploy("FirstVoicesData:OSGI-INF/ca.firstvoices.services.xml")
@Deploy("FirstVoicesData:OSGI-INF/ca.firstvoices.operations.xml")
@Deploy("FirstVoicesData:OSGI-INF/ca.firstvoices.listeners.xml")

@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})
public class FVDocumentListenerTest extends AbstractTest{

  @Inject
  private CoreSession session;

  @Before
  public void setUp() throws Exception {

    assertNotNull("Should have a valid session", session);
    createSetup(session);
  }
    
  @Test
  public void testListener() {
    
    // Get the DocumentModels for each of the parent documents
    DocumentModel languageFamily = session.getDocument(new PathRef("/FV/Family"));
    assertNotNull("Language family cannot be null", languageFamily);
    DocumentModel language = session.getDocument(new PathRef("/FV/Family/Language"));
    assertNotNull("Language cannot be null", language);
    DocumentModel dialect = getCurrentDialect();
    assertNotNull("Dialect cannot be null", dialect);
    DocumentModel dictionary = getCurrentDictionary();
    assertNotNull("Dictionary cannot be null", dictionary);
    
    // Create a new word & phrase document
    DocumentModel TestWord = createDocument(session, session.createDocumentModel("/FV/Family/Language/Dialect/Dictionary", " Test Word ", "FVWord"));
    DocumentModel TestPhrase = createDocument(session, session.createDocumentModel("/FV/Family/Language/Dialect/Dictionary", "  Test Phrase  ", "FVPhrase"));
    
    assertNotNull(TestWord);
    assertNotNull(TestPhrase);

    assertEquals(TestWord.getTitle(), " Test Word ");
    assertEquals(TestPhrase.getTitle(), "  Test Phrase  ");

    TestWord = session.getDocument(TestWord.getRef());
    TestPhrase = session.getDocument(TestPhrase.getRef());
    
    assertEquals("Word should have ID of parent family property", languageFamily.getId(), TestWord.getPropertyValue("fva:family"));
    assertEquals("Word should have ID of parent language property", language.getId(), TestWord.getPropertyValue("fva:language"));
    assertEquals("Word should have ID of parent dialect property", dialect.getId(), TestWord.getPropertyValue("fva:dialect"));

    assertEquals("Test Word", TestWord.getTitle());
    assertEquals("Test Phrase", TestPhrase.getTitle());

  }

}
