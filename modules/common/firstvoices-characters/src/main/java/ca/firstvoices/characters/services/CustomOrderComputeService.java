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

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

public interface CustomOrderComputeService {

  DocumentModel computeAssetNativeOrderTranslation(CoreSession session, DocumentModel asset,
      boolean save, boolean publish);

  /**
   * Method will update the mapping on FVCharacter to ASCII mapping based on order
   *
   * @param session
   * @param alphabet
   * @param chars
   */
  void updateCustomOrderCharacters(CoreSession session,
      DocumentModel alphabet, DocumentModelList chars);

  /**
   * Method will update the mapping on FVCharacter to ASCII mapping based on order
   *
   * @param session
   * @param alphabet
   */
  void updateCustomOrderCharacters(CoreSession session, DocumentModel alphabet);

  /**
   * Generates the custom order string and applies it to the element Core logic of custom order
   * recompute
   *
   * @param element
   * @param alphabet
   * @param chars
   * @return
   */
  DocumentModel computeCustomOrder(DocumentModel element, DocumentModel alphabet,
      DocumentModelList chars);

  /**
   * Validate alphabet order
   *
   * @param session
   * @param alphabet
   * @return
   */
  boolean validateAlphabetOrder(CoreSession session, DocumentModel alphabet);

  /**
   * Checks if all characters in the alphabet have custom order assigned
   *
   * @param session
   * @param alphabet
   * @return
   */
  boolean isAlphabetComputed(CoreSession session, DocumentModel alphabet);

  /**
   * Checks if all characters in the alphabet have custom order assigned
   *
   * @param session
   * @param characters
   * @return
   */
  boolean isAlphabetComputed(CoreSession session, DocumentModelList characters);
}
