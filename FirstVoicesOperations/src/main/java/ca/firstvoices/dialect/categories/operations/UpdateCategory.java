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

package ca.firstvoices.dialect.categories.operations;

import ca.firstvoices.dialect.categories.exceptions.InvalidCategoryException;
import java.util.Map;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.collectors.DocumentModelCollector;
import org.nuxeo.ecm.core.api.ConcurrentUpdateException;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.PathRef;

@Operation(id = UpdateCategory.ID, category = Constants.CAT_DOCUMENT, label = "Update Category",
    description =
    "Set multiple properties on the input document. " + "Move document to new target location.")
public class UpdateCategory {

  public static final String ID = "Document.UpdateCategory";

  @Context
  protected CoreSession session;

  @Param(name = "properties", required = false)
  protected Map<String, String> properties;

  @OperationMethod(collector = DocumentModelCollector.class)
  public DocumentModel run(DocumentModel doc) throws ConcurrentUpdateException {

    if (!doc.getType().equals("FVCategory")) {
      throw new InvalidCategoryException("Document type must be FVCategory.");
    }

    if (properties.size() > 0) {
      for (Map.Entry<String, String> entry : properties.entrySet()) {
        String key = entry.getKey();
        String value = entry.getValue();

        if (key.equals("ecm:parentRef")) {
          session.saveDocument(doc);

          if (value.contains("/Categories")) {
            value = session.getDocument(new PathRef(value)).getId();
          }

          DocumentModel parent = session.getDocument(doc.getParentRef());

          if (!value.equals(parent.getId())) {
            // Throw error if the doc being moved is a parent doc
            Boolean hasChildren = session.getChildren(doc.getRef()).stream()
                .anyMatch(child -> !child.isTrashed());

            if (hasChildren) {
              throw new InvalidCategoryException(
                  "A parent category cannot be a child of another parent category.");
            }

            doc = session
                .move(doc.getRef(), new IdRef(value), doc.getPropertyValue("dc:title").toString());
          }

        } else {
          doc.setPropertyValue(key, value);
        }
      }
    }

    return session.saveDocument(doc);
  }
}
