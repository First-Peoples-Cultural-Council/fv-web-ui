package ca.firstvoices.maintenance.dialect.categories.workers;

import ca.firstvoices.maintenance.dialect.categories.Constants;
import ca.firstvoices.maintenance.dialect.categories.services.MigrateCategoriesService;
import ca.firstvoices.maintenance.services.MaintenanceLogger;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.transaction.TransactionHelper;

@SuppressWarnings("java:S2160") // Nuxeo does not override equals in workers
public class MigrateCategoriesWorker extends AbstractWork {

  private static final Logger log = Logger
      .getLogger(MigrateCategoriesWorker.class.getCanonicalName());

  private final String job;
  private final DocumentRef jobContainerRef;
  private final int batchSize;

  private final transient MigrateCategoriesService service = Framework
      .getService(MigrateCategoriesService.class);

  private final transient MaintenanceLogger maintenanceLogger = Framework
      .getService(MaintenanceLogger.class);

  private final transient RepositoryManager rpm = Framework.getService(RepositoryManager.class);

  public MigrateCategoriesWorker(DocumentRef jobContainerRef, String job, int batchSize) {
    super(Constants.MIGRATE_CATEGORIES_JOB_ID);
    this.jobContainerRef = jobContainerRef;
    this.job = job;
    this.batchSize = batchSize;

    // See https://doc.nuxeo.com/nxdoc/work-and-workmanager/#work-construction
    setDocument(rpm.getDefaultRepositoryName(), jobContainerRef.toString(), true);
  }

  @Override
  public void work() {
    if (isSuspending()) {
      // don't run anything if we're being started while a suspend
      // has been requested
      suspended();
      return;
    }

    if (!TransactionHelper.isTransactionActive()) {
      TransactionHelper.startTransaction();
    }

    openSystemSession();

    DocumentModel jobContainer = session.getDocument(jobContainerRef);
    setStatus("Starting migrate category for words in `" + jobContainer.getTitle() + "`");

    try {
      // Run first iteration
      int wordsRemaining = service.migrateWords(session, jobContainer, batchSize);
      int totalWords = wordsRemaining;
      while (wordsRemaining != 0) {
        setStatus("Migrating next batch on `" + jobContainer.getTitle() + "` ( " + wordsRemaining
            + " words remaining).");
        int nextWordsRemaining = service.migrateWords(session, jobContainer, batchSize);

        // No progress, worker is stuck
        if (nextWordsRemaining == wordsRemaining) {
          setStatus("Failed");
          maintenanceLogger.removeFromRequiredJobs(jobContainer, job, false);
          workFailed(
              new NuxeoException("worker is stuck with progress on " + jobContainer.getTitle()));
        }

        wordsRemaining = nextWordsRemaining;

        // Create transaction for next batch
        // See examples:
        // nuxeo @ org/nuxeo/ecm/core/BatchProcessorWork.java
        // nuxeo @ org/nuxeo/elasticsearch/work/BucketIndexingWorker.java
        // nuxeo @ org/nuxeo/ai/transcribe/TranscribeWork
        TransactionHelper.commitOrRollbackTransaction();
        TransactionHelper.startTransaction();

        //Add real progress here when we can modify query for total words
        setProgress(new Progress(((float) wordsRemaining / totalWords) * 100));
      }
    } catch (Exception e) {
      maintenanceLogger.removeFromRequiredJobs(jobContainer, job, false);

      String workerFailedMessage =
          "worker migration failed on " + jobContainer.getTitle() + ": " + e.getMessage();

      // Log stack trace
      log.log(Level.SEVERE, workerFailedMessage, e);

      // Send work failed events/set correct status
      workFailed(new NuxeoException(workerFailedMessage));
      setStatus("Failed");
    }

    maintenanceLogger.removeFromRequiredJobs(jobContainer, job, true);
    setStatus("No more words to migrate in `" + jobContainer.getTitle() + "`");

  }

  @Override
  public void cleanUp(boolean ok, Exception e) {
    setStatus("Worker done for `" + jobContainerRef + "`");
    super.cleanUp(ok, e);
  }

  @Override
  public String getTitle() {
    return Constants.MIGRATE_CATEGORIES_JOB_ID;
  }

  @Override
  public String getCategory() {
    return ca.firstvoices.maintenance.Constants.EXECUTE_REQUIRED_JOBS_EVENT_ID;
  }
}
