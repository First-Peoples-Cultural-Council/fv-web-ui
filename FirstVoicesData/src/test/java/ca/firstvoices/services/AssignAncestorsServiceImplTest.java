package ca.firstvoices.services;

import ca.firstvoices.testUtil.AbstractTest;
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

@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})
@Deploy("FirstVoicesData:OSGI-INF/services/ca.firstvoices.services.assignancestorsservice.xml")
public class AssignAncestorsServiceImplTest extends AbstractTest {

  @Inject
  private CoreSession session;
  
  @Inject
  private AssignAncestorsService assignAncestorsServiceInstance;

  @Before
  public void setUp() throws Exception {
    assertNotNull("Should have a valid session", session);
    createSetup(session);
  }
  
  @Test
  public void assignAncestors() {
    
    // Get the DocumentModels for each of the parent documents
    DocumentModel languageFamily = session.getDocument(new PathRef("/FV/Family"));
    assertNotNull("Language family cannot be null", languageFamily);
    DocumentModel language = session.getDocument(new PathRef("/FV/Family/Language"));
    assertNotNull("Language cannot be null", language);
    DocumentModel dialect = getCurrentDialect();
    assertNotNull("Dialect cannot be null", dialect);
    
    // Create a new child document
    DocumentModel TestWord = createDocument(session, session.createDocumentModel("/FV/Family/Language/Dialect", "TestLink", "FVLinks"));
    
    // Check that the child document does not have the parent document UUIDs in it's properties
    assertNull("Word should have no ID for parent family property", TestWord.getPropertyValue("fva:family"));
    assertNull("Word should have no ID for parent language property", TestWord.getPropertyValue("fva:language"));
    assertNull("Word should have no ID for parent dialect property", TestWord.getPropertyValue("fva:dialect"));
    
    // Run the service against the new child document
    assignAncestorsServiceInstance.assignAncestors(session, TestWord);
    
    // Check that the child now has the correct UUIDs of the parent documents in it's properties
    assertEquals("Word should have ID of parent family property", languageFamily.getId(), TestWord.getPropertyValue("fva:family"));
    assertEquals("Word should have ID of parent language property", language.getId(), TestWord.getPropertyValue("fva:language"));
    assertEquals("Word should have ID of parent dialect property", dialect.getId(), TestWord.getPropertyValue("fva:dialect"));
  }
}
