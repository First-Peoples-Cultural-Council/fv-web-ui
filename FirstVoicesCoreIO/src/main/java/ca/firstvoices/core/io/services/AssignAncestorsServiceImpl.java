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

package ca.firstvoices.core.io.services;

import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_DIALECT;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE_FAMILY;

import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public class AssignAncestorsServiceImpl implements AssignAncestorsService {

  public void assignAncestors(DocumentModel currentDoc) {
    // Do privileged since we are reading info outside of a dialect
    CoreInstance.doPrivileged(currentDoc.getCoreSession(), s -> {
      // Get the parent document of each type for the current document using the helper method
      DocumentModel dialect = getDialect(currentDoc);
      DocumentModel language = getLanguage(s, currentDoc);
      DocumentModel languageFamily = getLanguageFamily(s, currentDoc);

      // Set the property fva:family of the new document to be the
      // UUID of the parent FVLanguageFamily document
      if (languageFamily != null) {
        currentDoc.setPropertyValue("fva:family", languageFamily.getId());
      }

      // Set the property fva:language of the new document
      // to be the UUID of the parent FVLanguage document
      if (language != null) {
        currentDoc.setPropertyValue("fva:language", language.getId());
      }

      // Set the property fva:dialect of the new document to be the
      // UUID of the parent FVDialect document
      if (dialect != null) {
        currentDoc.setPropertyValue("fva:dialect", dialect.getId());
      }

      s.saveDocument(currentDoc);
    });
  }

  public DocumentModel getDialect(DocumentModel currentDoc) {
    return CoreInstance.doPrivileged(currentDoc.getCoreSession(), s -> {
      return getParentDoc(s, currentDoc, FV_DIALECT);
    });
  }

  private DocumentModel getLanguage(CoreSession session, DocumentModel currentDoc) {
    return getParentDoc(session, currentDoc, FV_LANGUAGE);
  }


  private DocumentModel getLanguageFamily(CoreSession session, DocumentModel currentDoc) {
    return getParentDoc(session, currentDoc, FV_LANGUAGE_FAMILY);
  }

  /**
   * Get parent doc of the specified type
   *
   * @param session
   * @param currentDoc
   * @param currentType
   * @return
   */
  private DocumentModel getParentDoc(CoreSession session, DocumentModel currentDoc,
      String currentType) {
    DocumentModel parent = session.getParentDocument(currentDoc.getRef());
    while (parent != null && !currentType.equals(parent.getType())) {
      parent = session.getParentDocument(parent.getRef());
    }
    return parent;
  }

}
