package ca.firstvoices.core.io.utils;

import ca.firstvoices.data.schemas.DialectTypesConstants;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import ca.firstvoices.tests.mocks.services.MockDialectService;
import javax.inject.Inject;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({PlatformFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.CLASS)
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-workspace.yaml"})
@Deploy({
    "FirstVoicesCoreIO:OSGI-INF/services/assignAncestors-contrib.xml",
    "FirstVoicesCoreIO:OSGI-INF/ca.firstvoices.listeners.xml"
})
public class DialectUtilsTest extends AbstractTestDataCreatorTest {

  @Inject
  CoreSession session;

  @Inject
  MockDialectService mockDialectService;

  DocumentModel dialect = null;

  DocumentModel language = null;

  DocumentModel languageFamily = null;

  DocumentModelList words = null;

  @Before
  public void setUp() {
    dialect = dataCreator.getReference(session, "testDialect");

    words = mockDialectService.generateFVWords(
        session, dialect.getPathAsString(), new String[]{"NewWord1"}, null);
  }

  @After
  public void tearDown() {
    DocumentModelList docs = session.query("SELECT * FROM Document WHERE ecm:isProxy = 0 AND ecm:isVersion = 0");

    for (DocumentModel doc : docs) {
      if (session.exists(doc.getRef())) {
        session.removeDocument(doc.getRef());
      }
    }
  }

  @Test
  public void isDialect() {
    Assert.assertTrue(DialectUtils.isDialect(dialect));
    Assert.assertFalse(DialectUtils.isDialect(words.get(0)));
    Assert.assertFalse(DialectUtils.isDialect(null));
  }

  @Test
  public void getDialect() {
    Assert.assertEquals(dialect.getId(), DialectUtils.getDialect(dialect).getId());
  }

  @Test
  public void getDialectWithSession() {
    Assert.assertEquals(dialect.getId(), DialectUtils.getDialect(session, dialect).getId());
  }

  @Test
  public void isCoreType() {
    Assert.assertTrue(DialectUtils.isCoreType(DialectTypesConstants.FV_WORD));
    Assert.assertTrue(DialectUtils.isCoreType(DialectTypesConstants.FV_PHRASE));
    Assert.assertTrue(DialectUtils.isCoreType(DialectTypesConstants.FV_BOOK));
  }

  @Test
  public void isDialectChild() {
    DocumentModelList children = session.getChildren(dialect.getRef());

    Assert.assertFalse(DialectUtils.isDialectChild(words.get(0)));
    Assert.assertFalse(DialectUtils.isDialectChild(dialect));
    Assert.assertTrue(DialectUtils.isDialectChild(children.get(0)));
  }
}
