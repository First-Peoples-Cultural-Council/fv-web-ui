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

import java.util.ArrayList;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

public interface CharactersCoreService {

  /**
   * Return a document list of all non-trashed characters in a document's associated alphabet
   * Sorted based on fv:customer_order
   *
   * @param doc Document model
   * @return Document model list of associated characters
   */
  DocumentModelList getCharacters(CoreSession session, DocumentModel doc);

  /**
   * Return a document list of all non-trashed characters in a document's associated alphabet
   * Sorted based on sort field
   *
   * @param doc Document model
   * @param sortOrderField field to sort on
   * @return Document model list of associated characters
   */
  DocumentModelList getCharacters(CoreSession session,
      DocumentModel doc, String sortOrderField);

  /**
   * Return an array list of all custom order values of non-trashed characters
   * in a document's associated alphabet, sorted by custom order
   *
   * @param doc Document model
   * @return Array list of associated characters
   */
  ArrayList<String> getCustomOrderValues(CoreSession session, DocumentModel doc);

  /**
   * Return an array list of all values of non-trashed characters
   * in a document's associated alphabet, sorted by custom order
   *
   * @param session session
   * @param doc alphabet
   * @param valueToGet value to return
   * @param sortOrder sort order
   * @return Array list of associated characters
   */
  ArrayList<String> getCharacterValues(CoreSession session,
      DocumentModel doc, String valueToGet, String sortOrder);


  /**
   * Returns the alphabet associated with the given document
   * Must have a dialect as an ancestor (or be within a dialect)
   *
   * @param doc Document model
   * @return The associated alphabet document for the given document
   */
  DocumentModel getAlphabet(CoreSession session, DocumentModel doc);
}
