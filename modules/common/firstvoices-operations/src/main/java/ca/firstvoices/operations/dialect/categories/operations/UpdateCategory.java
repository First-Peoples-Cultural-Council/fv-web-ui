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

package ca.firstvoices.operations.dialect.categories.operations;

import ca.firstvoices.operations.dialect.categories.services.CategoryService;
import java.util.Map;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.collectors.DocumentModelCollector;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.api.Framework;

@Operation(id = UpdateCategory.ID, category = Constants.CAT_DOCUMENT, label = "Update Category",
    description = "Update a category's title, description, or change a category's parent "
        + "category.")
public class UpdateCategory {

  CategoryService categoryService = Framework.getService(CategoryService.class);

  public static final String ID = "Document.UpdateCategory";

  @Param(name = "properties", required = false)
  protected Map<String, String> properties;

  @OperationMethod(collector = DocumentModelCollector.class)
  public DocumentModel run(DocumentModel doc) {
    return categoryService.updateCategory(doc, properties);
  }
}
