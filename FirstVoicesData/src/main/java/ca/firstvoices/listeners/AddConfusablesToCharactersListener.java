package ca.firstvoices.listeners;

import ca.firstvoices.workers.AddConfusablesToArchiveWorker;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
public class AddConfusablesToCharactersListener implements EventListener {

  @Override
  public void handleEvent(Event event) {
    if (!event.getName().equals("computeUnicodeCharacterUpdate")) {
      return;
    }

    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {

              String query = "SELECT * FROM FVAlphabet WHERE fv-alphabet:update_confusables_required = 1 AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";
              DocumentModelList alphabets = session.query(query);

              if (alphabets != null && alphabets.size() > 0) {
                WorkManager workManager = Framework.getService(WorkManager.class);
                for (DocumentModel alphabet : alphabets) {
                  DocumentModel dialect = session.getParentDocument(alphabet.getRef());

                  AddConfusablesToArchiveWorker worker = new AddConfusablesToArchiveWorker(
                      dialect.getRef());

                  workManager.schedule(worker);
                }
              }
            });
  }

}
