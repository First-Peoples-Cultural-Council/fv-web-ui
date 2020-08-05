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

package ca.firstvoices.services;

import java.util.List;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public interface CleanupCharactersService {

  /**
   * @param session
   * @param document
   * @param saveDocument whether or not to save the document. not necessary if saving is done later
   *                     (e.g. aboutToCreate)
   * @return
   */
  DocumentModel cleanConfusables(CoreSession session, DocumentModel document, Boolean saveDocument);

  void validateCharacters(List<DocumentModel> characters,
      DocumentModel alphabet, DocumentModel updated);

  void validateAlphabetIgnoredCharacters(List<DocumentModel> characters,
      DocumentModel alphabet);
}
