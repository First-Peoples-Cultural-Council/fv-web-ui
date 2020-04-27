package ca.firstvoices.workers;

import ca.firstvoices.services.AddConfusablesService;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
public class AddConfusablesToArchiveWorker extends AbstractWork {

  private static final String ADD_CONFUSABLES_TO_ARCHIVE = "addConfusablesToArchive";
  private DocumentRef dialect;
  private AddConfusablesService service = Framework.getService(AddConfusablesService.class);

  public AddConfusablesToArchiveWorker(DocumentRef dialectRef) {
    super(ADD_CONFUSABLES_TO_ARCHIVE);
    this.dialect = dialectRef;
  }

  @Override
  public void work() {
    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {
              DocumentModel dialectWithSession = session.getDocument(dialect);
              service.addConfusables(session, dialectWithSession);
            });

  }

  @Override
  public String getTitle() {
    return ADD_CONFUSABLES_TO_ARCHIVE;
  }

  @Override
  public String getCategory() {
    return ADD_CONFUSABLES_TO_ARCHIVE;
  }
}
