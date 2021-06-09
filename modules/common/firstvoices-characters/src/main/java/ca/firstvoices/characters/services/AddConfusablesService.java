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

package ca.firstvoices.characters.services;

import java.util.HashMap;
import java.util.HashSet;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public interface AddConfusablesService {

  /**
   * Add confusables will copy values from the default list of confusables to each character
   *
   * @param session Nuxeo session.
   * @param dialect Dialect to add confusables to.
   */
  void addConfusables(CoreSession session, DocumentModel dialect);

  /**
   * Add confusables from all other dialects to this alphabet
   */
  void addConfusablesFromAllDialects(CoreSession session, DocumentModel dialect);

  /**
   * Returns a list of uppercase and lowercase confusables across the site
   */
  HashMap<String, HashSet<String>> getConfusablesFromAllDialects(CoreSession session,
      DocumentModel dialect, boolean processUpperCase);

  DocumentModel updateConfusableCharacters(CoreSession session, DocumentModel characterDocument,
      DocumentModel dialect, String characterToUpdate, String[] newConfusables);

}
