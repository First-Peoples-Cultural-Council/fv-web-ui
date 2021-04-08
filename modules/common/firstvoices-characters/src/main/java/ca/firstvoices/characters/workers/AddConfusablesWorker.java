package ca.firstvoices.characters.workers;

import ca.firstvoices.characters.Constants;
import ca.firstvoices.characters.services.AddConfusablesService;
import ca.firstvoices.maintenance.common.RequiredJobsUtils;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;

/**
 * Add Confusables will execute the service to grab confusables from a directory and apply them to a
 * local alphabet
 */
@SuppressWarnings("java:S2160") // Nuxeo does not override equals in workers
public class AddConfusablesWorker extends AbstractWork {

  private static final long serialVersionUID = 1L;

  private final DocumentRef jobContainerRef;
  private final String job;
  private final boolean addFromOtherDialects;

  public AddConfusablesWorker(DocumentRef dialectRef, String job, boolean addFromOtherDialects) {
    super(Constants.ADD_CONFUSABLES_JOB_ID);
    this.jobContainerRef = dialectRef;
    this.job = job;
    this.addFromOtherDialects = addFromOtherDialects;
  }

  @Override
  public void work() {
    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {
              DocumentModel dialect = session.getDocument(jobContainerRef);
              AddConfusablesService service = Framework.getService(AddConfusablesService.class);

              if (!addFromOtherDialects) {
                // Will add confusables from the main directory
                service.addConfusables(session, dialect);

                // Remove job from required jobs
                RequiredJobsUtils.removeFromRequiredJobs(dialect, job, true);
              } else {
                // Will add confusables from all other dialects
                service.addConfusablesFromAllDialects(session, dialect);
              }
            });
  }

  @Override
  public String getTitle() {
    return Constants.ADD_CONFUSABLES_JOB_ID;
  }

  @Override
  public String getCategory() {
    return Constants.CHARACTER_WORKERS_QUEUE;
  }
}
