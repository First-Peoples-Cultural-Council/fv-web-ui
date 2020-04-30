package ca.firstvoices.workers;

import ca.firstvoices.services.CleanupCharactersService;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
public class CleanConfusablesForWordsAndPhrasesWorker extends AbstractWork {

  private static final String CLEAN_CONFUSABLES_FOR_WORDS_AND_PHRASES = "cleanConfusablesForWordsAndPhrases";
  private DocumentRef document;
  private CleanupCharactersService service = Framework.getService(CleanupCharactersService.class);

  public CleanConfusablesForWordsAndPhrasesWorker(DocumentRef documentRef) {
    super(CLEAN_CONFUSABLES_FOR_WORDS_AND_PHRASES);
    this.document = documentRef;
  }

  @Override
  public void work() {
    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {
              DocumentModel documentModel = session.getDocument(document);
              service.cleanConfusables(session, documentModel);
              if (documentModel.getType().equals("FVWord")) {
                documentModel.setPropertyValue("fv-word:update_confusables_required", false);
              }
              if (documentModel.getType().equals("FVPhrase")) {
                documentModel.setPropertyValue("fv-phrase:update_confusables_required", false);
              }
              session.saveDocument(documentModel);
            });
  }

  @Override
  public String getTitle() {
    return CLEAN_CONFUSABLES_FOR_WORDS_AND_PHRASES;
  }

  @Override
  public String getCategory() {
    return CLEAN_CONFUSABLES_FOR_WORDS_AND_PHRASES;
  }
}

