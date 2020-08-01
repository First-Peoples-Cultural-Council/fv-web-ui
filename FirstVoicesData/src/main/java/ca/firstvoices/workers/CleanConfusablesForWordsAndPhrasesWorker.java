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

  private static final String CLEAN_CONFUSABLES_ID = "cleanConfusablesForWordsAndPhrases";
  private DocumentRef document;
  private CleanupCharactersService service = Framework.getService(CleanupCharactersService.class);

  public CleanConfusablesForWordsAndPhrasesWorker(DocumentRef documentRef) {
    super(CLEAN_CONFUSABLES_ID);
    this.document = documentRef;
  }

  @Override
  public void work() {
    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {
              DocumentModel documentModel = session.getDocument(document);
              service.cleanConfusables(session, documentModel, true);
            });
  }

  @Override
  public String getTitle() {
    return CLEAN_CONFUSABLES_ID;
  }

  @Override
  public String getCategory() {
    return CLEAN_CONFUSABLES_ID;
  }
}

