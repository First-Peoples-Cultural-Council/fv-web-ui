package ca.firstvoices.services;

import javax.inject.Inject;
import ca.firstvoices.testUtil.AssignAncestorsTestUtil;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.test.runner.*;
import static org.junit.Assert.*;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.elasticsearch.test.RepositoryElasticSearchFeature;

@RunWith(FeaturesRunner.class)
@Features({RuntimeFeature.class, CoreFeature.class, RepositoryElasticSearchFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy( {
    "FirstVoicesData",
    "org.nuxeo.ecm.platform",
    "org.nuxeo.ecm.platform.commandline.executor",
    "org.nuxeo.ecm.platform.picture.core",
    "org.nuxeo.ecm.platform.rendition.core",
    "org.nuxeo.ecm.platform.video.core",
    "org.nuxeo.ecm.platform.audio.core",
    "org.nuxeo.ecm.automation.scripting",
    "org.nuxeo.ecm.platform.web.common",
    "FirstVoicesData:OSGI-INF/extensions/test.templates.factories.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",
    "org.nuxeo.elasticsearch.core:pageprovider-test-contrib.xml",
    "org.nuxeo.elasticsearch.core:schemas-test-contrib.xml",
    "org.nuxeo.elasticsearch.core:elasticsearch-test-contrib.xml",
    "FirstVoicesData:OSGI-INF/extensions/fake-load-actions.xml",
    "FirstVoicesData:OSGI-INF/extensions/fake-load-es-provider.xml",
    "FirstVoicesData:OSGI-INF/extensions/fake-directory-sql-contrib.xml"
} )

public class AssignAncestorsServiceImplTest {

  private AssignAncestorsTestUtil testUtil;

  @Inject
  private CoreSession session;
  
  @Inject
  private AssignAncestorsService assignAncestorsServiceInstance;

  @Before
  public void setUp() throws Exception {
    testUtil = new AssignAncestorsTestUtil();
    
    assertNotNull("Should have a valid session", session);
    assertNotNull("Should have a valid test utilities obj", testUtil);
    
    testUtil.createSetup(session);
  }
  
  @Test
  public void assignAncestors() {
    
    // Get the DocumentModels for each of the parent documents
    DocumentModel languageFamily = session.getDocument(new PathRef("/FV/Family"));
    assertNotNull("Language family cannot be null", languageFamily);
    DocumentModel language = session.getDocument(new PathRef("/FV/Family/Language"));
    assertNotNull("Language cannot be null", language);
    DocumentModel dialect = testUtil.getCurrentDialect();
    assertNotNull("Dialect cannot be null", dialect);
    
    // Create a new child document
    DocumentModel TestWord = testUtil.createDocument(session, session.createDocumentModel("/FV/Family/Language/Dialect", "TestLink", "FVLinks"));
    
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
