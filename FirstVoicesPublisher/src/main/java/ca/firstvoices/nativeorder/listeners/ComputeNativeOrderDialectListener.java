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

package ca.firstvoices.nativeorder.listeners;

import ca.firstvoices.nativeorder.workers.ComputeNativeOrderDialectWorker;
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
public class ComputeNativeOrderDialectListener implements EventListener {

  private static final String COMPUTE_ALPHABET_PROCESSES = "computeAlphabetProcesses";

  @Override
  public void handleEvent(Event event) {
    if (event.getName().equals(COMPUTE_ALPHABET_PROCESSES)) {
      CoreInstance
          .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
              session -> {

                String query = "SELECT * FROM FVAlphabet "
                    + "WHERE fv-alphabet:custom_order_recompute_required = 1 "
                    + "AND fv-alphabet:update_confusables_required=0 " + "AND ecm:isProxy = 0 "
                    + "AND ecm:isCheckedInVersion = 0 " + "AND ecm:isTrashed = 0";
                DocumentModelList alphabets = session.query(query);

                if (alphabets != null && alphabets.size() > 0) {
                  WorkManager workManager = Framework.getService(WorkManager.class);
                  for (DocumentModel alphabet : alphabets) {
                    DocumentModel dialect = session.getParentDocument(alphabet.getRef());
                    ComputeNativeOrderDialectWorker worker = new ComputeNativeOrderDialectWorker(
                        dialect.getRef());
                    workManager.schedule(worker);
                  }
                }
              });
    }
  }
}
