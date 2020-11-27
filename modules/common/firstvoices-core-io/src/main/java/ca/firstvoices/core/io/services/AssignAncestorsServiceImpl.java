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

import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE_FAMILY;

import ca.firstvoices.core.io.utils.DialectUtils;
import ca.firstvoices.core.io.utils.DocumentUtils;
import ca.firstvoices.data.exceptions.FVDocumentHierarchyException;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.transaction.TransactionHelper;

public class AssignAncestorsServiceImpl implements AssignAncestorsService {

  public DocumentModel assignAncestors(DocumentModel currentDoc) {
    // Do privileged since we are reading info outside of a dialect
    TransactionHelper.runInTransaction(() ->
        CoreInstance.doPrivileged(currentDoc.getCoreSession(), s -> {
          // Get the parent document of each type for the current document using the helper method
          try {
            DocumentModel dialect = DialectUtils.getDialect(currentDoc);

            if (dialect != null) {
              currentDoc.setPropertyValue("fva:dialect", dialect.getId());
            }
          } catch (FVDocumentHierarchyException e) {
            // No need to do anything, just leave "fva:dialect" as is
          }

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
        }));

    return currentDoc;
  }

  private DocumentModel getLanguage(CoreSession session, DocumentModel currentDoc) {
    return DocumentUtils.getParentDoc(session, currentDoc, FV_LANGUAGE);
  }


  private DocumentModel getLanguageFamily(CoreSession session, DocumentModel currentDoc) {
    return DocumentUtils.getParentDoc(session, currentDoc, FV_LANGUAGE_FAMILY);
  }
}
