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
import java.util.Set;
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

  /**
   * Ensures all characters and confusables are unique.
   *
   * @param characters
   * @param alphabet
   * @param updated    The character document being updated.
   */
  void validateCharacters(List<DocumentModel> characters,
      DocumentModel alphabet, DocumentModel updated);

  /**
   * Ensures ignored characters are unique from characters and confusables.
   *
   * @param characters
   * @param alphabet
   */
  void validateAlphabetIgnoredCharacters(List<DocumentModel> characters,
      DocumentModel alphabet);

  /**
   * A map of all upper/lowercase characters, upper/lowercase confusables and ignored characters
   * currently in the dialect.
   *
   * @param dialect
   * @return
   */
  Set<String> getCharactersToSkipForDialect(DocumentModel dialect);
}
