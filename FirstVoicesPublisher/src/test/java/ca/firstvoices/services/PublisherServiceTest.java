package ca.firstvoices.services;

import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import ca.firstvoices.tests.mocks.services.MockDialectService;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.trash.TrashService;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({CoreFeature.class, AutomationFeature.class})
@RepositoryConfig(cleanup = Granularity.METHOD)
@Deploy({
    "FirstVoicesNuxeoPublisher",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
    "FirstVoicesCoreTests:OSGI-INF/nuxeo.conf.override.xml"
})
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-workspace.yaml"})
public class PublisherServiceTest extends AbstractTestDataCreatorTest {

  @Inject
  CoreSession session;

  @Inject
  protected AutomationService automationService;

  @Inject
  protected TrashService trashService;

  @Inject
  protected MockDialectService mockDialectService;

  private static final String FV_CATEGORIES_FIELD = "fv-word:categories";
  private static final String FV_PHRASE_BOOKS_FIELD = "fv-phrase:phrase_books";

  DocumentModel dialect = null;

  DocumentModelList words = null;

  DocumentModelList phrases = null;

  DocumentModel category = null;

  DocumentModel phraseBook2 = null;

  DocumentModel phraseBook = null;

  @Before
  public void setUp() {
  }

  @Test
  public void shouldCleanReferencesForTrashedCategories() throws OperationException {
  }
}
