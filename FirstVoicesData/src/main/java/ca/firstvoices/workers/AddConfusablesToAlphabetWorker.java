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
public class AddConfusablesToAlphabetWorker extends AbstractWork {

  private static final String ADD_CONFUSABLES_TO_ALPHABET = "addConfusablesToAlphabet";
  private DocumentRef dialect;
  private DocumentRef alphabet;
  private AddConfusablesService service = Framework.getService(AddConfusablesService.class);

  public AddConfusablesToAlphabetWorker(DocumentRef dialectRef, DocumentRef alphabetRef) {
    super(ADD_CONFUSABLES_TO_ALPHABET);
    this.dialect = dialectRef;
    this.alphabet = alphabetRef;
  }

  @Override
  public void work() {
    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {
              DocumentModel dialectWithSession = session.getDocument(dialect);
              service.addConfusables(session, dialectWithSession);
              DocumentModel alphabetDoc = session.getDocument(alphabet);
              alphabetDoc.setPropertyValue("fv-alphabet:update_confusables_required", false);
              session.saveDocument(alphabetDoc);
            });
  }

  @Override
  public String getTitle() {
    return ADD_CONFUSABLES_TO_ALPHABET;
  }

  @Override
  public String getCategory() {
    return ADD_CONFUSABLES_TO_ALPHABET;
  }
}
