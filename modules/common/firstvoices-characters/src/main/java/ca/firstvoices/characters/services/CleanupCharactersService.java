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

import java.util.List;
import java.util.Map;
import java.util.Set;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

public interface CleanupCharactersService {

  /**
   * @param session      Nuxeo session.
   * @param document     Document to be cleaned.
   * @param saveDocument whether or not to save the document. not necessary if saving is done later
   *                     (e.g. aboutToCreate)
   * @return Cleaned document
   */
  DocumentModel cleanConfusables(CoreSession session, DocumentModel document, Boolean saveDocument);

  /**
   * Ensures all characters and confusables are unique.
   *
   * @param characters List of FVCharacter documents that are not the document being updated.
   * @param alphabet   The alphabet document corresponding to the characters.
   * @param updated    The character document being updated.
   */
  void validateCharacters(List<DocumentModel> characters,
      DocumentModel alphabet, DocumentModel updated);

  /**
   * Ensures ignored characters are unique from characters and confusables.
   *
   * @param characters List of FVCharacter documents for the alphabet.
   * @param alphabet   Alphabet document.
   */
  void validateAlphabetIgnoredCharacters(List<DocumentModel> characters,
      DocumentModel alphabet);


  /**
   * Ensures that confusables set on the current character are valid
   *
   * @param character       the character to validate
   * @param characterValues a list of other characters in the alphabet
   * @return map of the valid confusables
   */
  Map<String, String> validateConfusableCharacter(DocumentModel character,
      List<DocumentModel> characterValues);

  /**
   * A map of all upper/lowercase characters, upper/lowercase confusables and ignored characters
   * currently in the dialect.
   *
   * @param dialect Dialect containing desired documents
   * @return Map of all upper/lowercase characters, confusables and ignored characters
   */
  Set<String> getCharactersToSkipForDialect(DocumentModel dialect);

  /**
   * Return a list of characters that have confusables defined
   *
   * @param doc Document model
   * @return Document model list of associated characters
   */
  DocumentModelList getCharactersWithConfusables(DocumentModel doc);

  /**
   * Checks whether the character has any confusables defined
   *
   * @param charDoc
   * @return
   */
  boolean hasConfusableCharacters(DocumentModel charDoc);

  /**
   * Returns all the confusables (lowercase/uppercase) defined on all characters
   *
   * @param doc
   * @return
   */
  List<String> getAllConfusables(DocumentModel doc);

  /**
   * Returns all the words and phrases that contain the confusable string within the dialect
   *
   * @param session
   * @param dictionaryId
   * @param confusableChar
   * @param batchSize      the maximum amount of words to return
   * @return
   */
  DocumentModelList getAllWordsPhrasesForConfusable(CoreSession session, String dictionaryId,
      String confusableChar,
      int batchSize);
}
