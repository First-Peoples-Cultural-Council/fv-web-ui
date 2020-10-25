package ca.firstvoices.core.io.utils;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import ca.firstvoices.data.lifecycle.Constants;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import ca.firstvoices.tests.mocks.services.MockDialectService;
import javax.inject.Inject;
import org.junit.After;
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
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({PlatformFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.CLASS)
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-language.yaml"})
public class StateUtilsTest extends AbstractTestDataCreatorTest {

  @Inject CoreSession session;

  @Inject MockDialectService mockDialectService;

  DocumentModel dialect = null;

  DocumentModelList words = null;

  @Before
  public void setUp() {
    dialect = dataCreator.getReference(session, "testArchive");

    words = mockDialectService.generateFVWords(session,
        dialect.getPathAsString(),
        new String[]{"NewWord1"},
        null);
  }

  @After
  public void tearDown() {
    DocumentModelList docs =
        session.query("SELECT * FROM Document WHERE ecm:isProxy = 0 AND ecm:isVersion = 0");

    for (DocumentModel doc : docs) {
      if (session.exists(doc.getRef())) {
        session.removeDocument(doc.getRef());
      }
    }
  }

  @Test
  public void isPublished() {
    assertFalse(StateUtils.isPublished(words.get(0)));
    assertTrue(StateUtils.isPublished(dialect));
  }

  @Test
  public void visibilityToState() {
    assertEquals(Constants.DISABLED_STATE, StateUtils.visibilityToState(Constants.TEAM));
    assertEquals(Constants.PUBLISHED_STATE, StateUtils.visibilityToState(Constants.PUBLIC));
    assertEquals(Constants.ENABLED_STATE, StateUtils.visibilityToState(Constants.MEMBERS));
    assertEquals("", StateUtils.visibilityToState("undefined"));
  }

  @Test
  public void stateToVisibility() {
    assertEquals(Constants.TEAM, StateUtils.stateToVisibility(Constants.DISABLED_STATE));
    assertEquals(Constants.PUBLIC, StateUtils.stateToVisibility(Constants.PUBLISHED_STATE));
    assertEquals(Constants.MEMBERS, StateUtils.stateToVisibility(Constants.ENABLED_STATE));
    assertEquals("", StateUtils.stateToVisibility("undefined"));
  }
}
