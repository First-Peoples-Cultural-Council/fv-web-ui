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

package ca.firstvoices.operations.bulkupdate.operations;

import ca.firstvoices.operations.bulkupdate.BulkUpdateMode;
import ca.firstvoices.operations.bulkupdate.services.BulkUpdateService;
import java.io.Serializable;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentRefList;
import org.nuxeo.runtime.api.Framework;

@Operation(id = BulkUpdate.ID,
    category = Constants.CAT_DOCUMENT,
    label = "Bulk Update Fields",
    description = "Accepts a set of document refs")
public class BulkUpdate {

  BulkUpdateService bulkUpdateService = Framework.getService(BulkUpdateService.class);

  public static final String ID = "Document.BulkPropertyUpdate";

  @Param(name = "mode", required = true) protected BulkUpdateMode mode;

  @Param(name = "field", required = true) protected String field;

  @Param(name = "value", required = true) protected Serializable value;

  @Context CoreSession session;

  @OperationMethod()
  public void run(DocumentRefList refs) {
    bulkUpdateService.bulkUpdate(session, refs, mode, field, value);
  }
}
