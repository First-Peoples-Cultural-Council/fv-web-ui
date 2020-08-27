package ca.firstvoices.maintenance.dialect.alphabet.workers;

import ca.firstvoices.maintenance.dialect.alphabet.Constants;
import ca.firstvoices.maintenance.services.MaintenanceLogger;
import ca.firstvoices.services.AddConfusablesService;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;

/**
 * Add Confusables will execute the service to grab confusables
 * from a directory and apply them to a local alphabet
 */
public class AddConfusablesWorker extends AbstractWork {

  private static final long serialVersionUID = 1L;

  private final DocumentRef jobContainerRef;
  private final String job;

  public AddConfusablesWorker(DocumentRef dialectRef, String job) {
    super(Constants.ADD_CONFUSABLES_JOB_ID);
    this.jobContainerRef = dialectRef;
    this.job = job;
  }

  @Override
  public void work() {
    MaintenanceLogger maintenanceLogger = Framework.getService(MaintenanceLogger.class);

    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {
              DocumentModel dialect = session.getDocument(jobContainerRef);
              AddConfusablesService service = Framework.getService(AddConfusablesService.class);
              service.addConfusables(session, dialect);

              // Remove job from required jobs
              maintenanceLogger.removeFromRequiredJobs(dialect, job, true);

              // Add job to clean confusables to be picked up later
              maintenanceLogger.addToRequiredJobs(dialect, Constants.CLEAN_CONFUSABLES_JOB_ID);
            });
  }

  @Override
  public String getTitle() {
    return Constants.ADD_CONFUSABLES_JOB_ID;
  }

  @Override
  public String getCategory() {
    return ca.firstvoices.maintenance.Constants.EXECUTE_REQUIRED_JOBS_EVENT_ID;
  }
}
