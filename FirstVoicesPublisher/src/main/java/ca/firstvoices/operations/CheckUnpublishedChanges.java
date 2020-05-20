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

package ca.firstvoices.operations;

import ca.firstvoices.services.UnpublishedChangesService;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.api.Framework;

/**
 *
 */
@Operation(id = CheckUnpublishedChanges.ID, category = Constants.CAT_DOCUMENT, label =
    "FVCheckUnpublishedChanges", description =
    "This operation is used to check if a document has unpublished changes. "
        + "It returns true if unpublished changes exist and false otherwise.")
public class CheckUnpublishedChanges {

  public static final String ID = "Document.CheckUnpublishedChanges";
  protected UnpublishedChangesService service = Framework
      .getService(UnpublishedChangesService.class);
  CoreSession session;

  @OperationMethod
  public boolean run(DocumentModel input) {
    session = input.getCoreSession();

    // Call the checkUnpublishedChanges service which
    // returns true if a document has unpublished changes and false otherwise.
    return service.checkUnpublishedChanges(session, input);
  }
}
