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

package ca.firstvoices.publisher.operations;

import ca.firstvoices.publisher.services.UnpublishedChangesService;
import org.javers.core.JaversBuilder;
import org.javers.core.diff.Diff;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;
import org.nuxeo.ecm.core.api.impl.blob.StringBlob;
import org.nuxeo.runtime.api.Framework;

/**
 *
 */
@Operation(id = GetUnpublishedChanges.ID, category = Constants.CAT_DOCUMENT, label =
    "FVGetUnpublishedChanges", description =
    "This operation is used to get the unpublished changes for the document. "
        + "It returns a list of changes if unpublished changes exist.")
public class GetUnpublishedChanges {

  public static final String ID = "Document.GetUnpublishedChanges";
  protected UnpublishedChangesService service = Framework
      .getService(UnpublishedChangesService.class);
  CoreSession session;

  @OperationMethod
  public Blob run(DocumentModel input) {

    session = input.getCoreSession();
    Diff diff = service.getUnpublishedChanges(session, input);

    if (diff == null || !diff.hasChanges()) {
      return new StringBlob("", "application/json");
    }

    Object jsonDiff = JaversBuilder.javers().build().getJsonConverter().toJson(diff);
    return new JSONBlob(jsonDiff.toString());
  }
}
