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
import java.util.HashMap;
import java.util.Map;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
public class CleanConfusablesForDictionaryWorker extends AbstractWork {

  private static final String CLEAN_CONFUSABLES_TITLE = "Clean Dictionary Confusables";
  private static final String CLEAN_CONFUSABLES_ID = "cleanConfusablesForWordsAndPhrases";
  private transient CleanupCharactersService cleanupCharactersService = Framework
      .getService(CleanupCharactersService.class);

  public CleanConfusablesForDictionaryWorker() {
    super(CLEAN_CONFUSABLES_ID);
  }

  @Override
  public void work() {
    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {
              String wordPhraseQuery =
                  "SELECT * FROM FVWord, FVPhrase WHERE fv:update_confusables_required"
                      + " = 1 AND ecm:isProxy = 0 AND "
                      + "ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";
              DocumentModelList wordsAndPhrases = session.query(wordPhraseQuery, 100);

              Map<String, Boolean> requiresUpdate = new HashMap<>();

              if (wordsAndPhrases.isEmpty()) {
                for (DocumentModel documentModel : wordsAndPhrases) {

                  String dialect = (String) documentModel.getPropertyValue("fva:dialect");

                  // Cache whether or not the alphabet requires update
                  Boolean alphabetRequiresUpdate;
                  if (requiresUpdate.containsKey(dialect)) {
                    alphabetRequiresUpdate = requiresUpdate.get(dialect);
                  } else {
                    alphabetRequiresUpdate = (Boolean) cleanupCharactersService
                        .getAlphabet(documentModel)
                        .getPropertyValue("fv-alphabet:update_confusables_required");
                    if (alphabetRequiresUpdate == null) {
                      alphabetRequiresUpdate = false;
                    }
                    requiresUpdate.put(dialect, alphabetRequiresUpdate);
                  }

                  if (Boolean.FALSE.equals(alphabetRequiresUpdate)) {
                    cleanupCharactersService.cleanConfusables(session, documentModel, true);
                  }
                }
              }
            });
  }

  @Override
  public String getTitle() {
    return CLEAN_CONFUSABLES_TITLE;
  }

  @Override
  public String getCategory() {
    return CLEAN_CONFUSABLES_ID;
  }

  @Override
  public boolean equals(Object obj) {
    return super.equals((obj));
  }

  @Override
  public int hashCode() {
    return super.hashCode();
  }
}


