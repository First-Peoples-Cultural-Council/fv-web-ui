/*
 *
 *  *
 *  * Copyright 2020 First People's Cultural Council
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  * /
 *
 */

package ca.firstvoices.characters.listeners;

import ca.firstvoices.characters.workers.AddConfusablesToAlphabetWorker;
import ca.firstvoices.characters.workers.CleanConfusablesForDictionaryWorker;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventBundle;
import org.nuxeo.ecm.core.event.PostCommitFilteringEventListener;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;

/**
 * Event will perform scheduled operations on an alphabet:
 * 1. Adding confusable characters to the alphabet
 * 2. Cleaning those confusable characters in existing words and phrases
 * This event responds to a schedule defined in resources/OSGI-INF/ca.firstvoices.schedules.xml
 */
public class AlphabetProcessesListener implements PostCommitFilteringEventListener {

  public static final String ALPHABET_PROCESSES_LISTENER_EVENT = "computeAlphabetProcesses";

  @Override
  public void handleEvent(EventBundle eventBundle) {
    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {
              addConfusableCharactersToAlphabets(session);
              cleanConfusablesFromWordsAndPhrases();
            });
  }
//////// TODO!!! Disable subsequent events on these documents
  @Override
  public boolean acceptEvent(Event event) {
    return ALPHABET_PROCESSES_LISTENER_EVENT.equals(event.getName());
  }

  // This adds confusable characters to any alphabet WHERE
  // fv-alphabet:update_confusables_required = 1
  private void addConfusableCharactersToAlphabets(CoreSession session) {
    String query = "SELECT * FROM FVAlphabet WHERE fv-alphabet:update_confusables_required = 1 "
        + "AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";
    // Only process 100 documents at a time
    DocumentModelList alphabets = session.query(query, 100);

    if (alphabets != null && !alphabets.isEmpty()) {
      WorkManager workManager = Framework.getService(WorkManager.class);
      for (DocumentModel alphabet : alphabets) {
        DocumentModel dialect = session.getParentDocument(alphabet.getRef());

        AddConfusablesToAlphabetWorker worker = new AddConfusablesToAlphabetWorker(dialect.getRef(),
            alphabet.getRef());

        workManager.schedule(worker);
      }
    }
  }

  private void cleanConfusablesFromWordsAndPhrases() {
    // Process 100 cleanups on words/phrases within worker
    WorkManager workManager = Framework.getService(WorkManager.class);
    CleanConfusablesForDictionaryWorker worker = new CleanConfusablesForDictionaryWorker();
    workManager.schedule(worker);
  }
}
