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

package ca.firstvoices.FVCategory.operations;

import ca.firstvoices.exceptions.FVCategoryInvalidException;
import ca.firstvoices.operations.AbstractFirstVoicesDataOperation;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

/**
 * @author david
 */
@Operation(id = GetCategories.ID, category = Constants.CAT_DOCUMENT, label = "Get Categories", description = "Given an FVDialect, returns all the categories for the dialect")
public class GetCategories extends AbstractFirstVoicesDataOperation {

  public static final String ID = "Document.GetCategories";

  @Context
  protected CoreSession session;

  @OperationMethod
  public DocumentModelList run(DocumentModel dialect) {
    if (!dialect.getType().equals("FVDialect")) {
      throw new FVCategoryInvalidException("Cannot fetch categories for this document type, must be FVDialect");
    }

    String query = "SELECT * FROM FVCategory " +
        "WHERE fva:dialect = '" + dialect.getId() + "' " +
        "AND ecm:isTrashed = 0 " +
        "AND ecm:isVersion = 0";

    DocumentModelList results =  session.query(query);

    return results;
  }

}
