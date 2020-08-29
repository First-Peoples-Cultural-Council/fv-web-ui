package ca.firstvoices.maintenance.dialect;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import ca.firstvoices.characters.Constants;
import ca.firstvoices.maintenance.dialect.alphabet.workers.CleanConfusablesWorker;
import ca.firstvoices.maintenance.services.MaintenanceLogger;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.mockito.MockitoFeature;
import org.nuxeo.runtime.mockito.RuntimeService;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.transaction.TransactionHelper;

@RunWith(FeaturesRunner.class)
@Features({PlatformFeature.class, MockitoFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.CLASS)
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-language.yaml"})
public class RequiredJobsListenerTest extends AbstractTestDataCreatorTest {

  WorkManager workManager = Framework.getService(WorkManager.class);

  @Mock
  @RuntimeService
  MaintenanceLogger maintenanceLogger;

  @Inject
  CoreSession session;

  @Before
  public void startTransaction() {
    if (!TransactionHelper.isTransactionActive()) {
      TransactionHelper.startTransaction();
    }
  }

  @Test
  public void testGetDialect() {
    assertNotNull(session);
    DocumentModelList docs = session.query("SELECT * FROM FVDialect");
    assertTrue(docs.size() > 1);
  }

  @Ignore
  @Test
  public void workerTest() {

    DocumentModel testDialect = session.getDocument(new IdRef(this.dataCreator.getReference("testArchive")));

    DocumentModelList docs = session.getChildren(testDialect.getRef(), "FVAlphabet");
    assertEquals(1, docs.size());

    // Initiate worker to perform operation
    CleanConfusablesWorker worker = new CleanConfusablesWorker(testDialect.getRef(),
        Constants.CLEAN_CONFUSABLES_JOB_ID, 1000);
    workManager.schedule(worker, true);

    assertNotNull(worker);
  }
}