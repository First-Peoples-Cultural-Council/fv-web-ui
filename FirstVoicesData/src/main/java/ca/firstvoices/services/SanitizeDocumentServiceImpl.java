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

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public class SanitizeDocumentServiceImpl implements SanitizeDocumentService {

  /**
   * Sanitizes the document and returns it. Does not save the document.
   * @param session
   * @param currentDoc
   * @return
   */
  public DocumentModel sanitizeDocument(CoreSession session, DocumentModel currentDoc) {
    currentDoc = trimWhitespace(currentDoc, "dc:title");
    return currentDoc;
  }

  /**
   * Trim whitespace in given property, currently used just for dc:title
   * @param currentDoc
   * @param propertyName
   * @return
   */
  private DocumentModel trimWhitespace(DocumentModel currentDoc, String propertyName) {
    if (currentDoc == null || propertyName == null) {
      return null;
    }

    Object property = currentDoc.getPropertyValue(propertyName);

    if (property != null && property.getClass().equals(String.class)) {
      String val = (String) property;

      if (!val.equals(val.trim())) {
        currentDoc.setPropertyValue(propertyName, val.trim());
        return currentDoc;
      }
    }
    return null;
  }

}
