package ca.firstvoices.maintenance.dialect.categories.workers;

import ca.firstvoices.maintenance.dialect.categories.Constants;
import ca.firstvoices.maintenance.dialect.categories.services.MigrateCategoriesService;
import ca.firstvoices.maintenance.services.MaintenanceLogger;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;

public class MigrateCategoriesWorker extends AbstractWork {

  private final String job;
  private final DocumentRef jobContainerRef;
  private final int batchSize;

  private final MigrateCategoriesService service = Framework.getService(MigrateCategoriesService.class);

  private final MaintenanceLogger maintenanceLogger = Framework.getService(MaintenanceLogger.class);

  private final RepositoryManager rpm = Framework.getService(RepositoryManager.class);

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

    CoreInstance
        .doPrivileged(rpm.getDefaultRepositoryName(),
            session -> {
              int wordsFound = batchSize;
              DocumentModel jobContainer = session.getDocument(jobContainerRef);
              setStatus("Starting migrate category for words in `" + jobContainer.getTitle() + "`");

              while (wordsFound != 0) {
                wordsFound = service.migrateWords(session, jobContainer, batchSize);
                setStatus("Migrating next batch on `" + jobContainer.getTitle() + "` ( " + wordsFound + ") words.");

                //Add real progress here when we can modify query for total words
                //setProgress(new Progress((wordsFound/totalWords)*100));
              }

              maintenanceLogger.removeFromRequiredJobs(jobContainer, job);
              setStatus("No more words to migrate in `" + jobContainer.getTitle() + "`");
            });
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
