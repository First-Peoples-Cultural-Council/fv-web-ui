package ca.firstvoices.core.io.utils;

import ca.firstvoices.data.lifecycle.Constants;
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
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({PlatformFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-language.yaml"})
public class StateUtilsTest extends AbstractTestDataCreatorTest {

  @Inject
  CoreSession session;

  @Inject
  MockDialectService mockDialectService;

  DocumentModel dialect = null;

  DocumentModelList words = null;

  @Before
  public void setUp() {
    dialect = session.getDocument(new IdRef(this.dataCreator.getReference("testArchive")));

    words = mockDialectService.generateFVWords(
        session, dialect.getPathAsString(), new String[]{ "NewWord1" }, null);
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
  public void isPublished() {
    Assert.assertFalse(StateUtils.isPublished(words.get(0)));
    Assert.assertTrue(StateUtils.isPublished(dialect));
  }

  @Test
  public void visibilityToState() {
    Assert.assertEquals(Constants.DISABLED_STATE, StateUtils.visibilityToState(Constants.TEAM));
    Assert.assertEquals(Constants.PUBLISHED_STATE, StateUtils.visibilityToState(Constants.PUBLIC));
    Assert.assertEquals(Constants.ENABLED_STATE, StateUtils.visibilityToState(Constants.MEMBERS));
    Assert.assertEquals("", StateUtils.visibilityToState("undefined"));
  }

  @Test
  public void stateToVisibility() {
    Assert.assertEquals(Constants.TEAM, StateUtils.stateToVisibility(Constants.DISABLED_STATE));
    Assert.assertEquals(Constants.PUBLIC, StateUtils.stateToVisibility(Constants.PUBLISHED_STATE));
    Assert.assertEquals(Constants.MEMBERS, StateUtils.stateToVisibility(Constants.ENABLED_STATE));
    Assert.assertEquals("", StateUtils.stateToVisibility("undefined"));
  }
}