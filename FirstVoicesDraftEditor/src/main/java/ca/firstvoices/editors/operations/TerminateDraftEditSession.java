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

package ca.firstvoices.editors.operations;

import ca.firstvoices.editors.services.DraftEditorService;
import java.util.HashMap;
import java.util.Map;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.runtime.api.Framework;

@Operation(id = TerminateDraftEditSession.ID, category = Constants.CAT_DOCUMENT, label =
    "Terminate Draft-Edit Session", description =
    "Terminate draft-edit session. Remove "
        + "relationship between live and draft documents. Delete draft document without copying "
        + "changes into live document. INPUT draft or live document. RETURN live document.")
public class TerminateDraftEditSession {


  public static final String ID = "Document.TerminateDraftEditSession";

  protected DraftEditorService service = Framework.getService(DraftEditorService.class);

  protected AutomationService automation = Framework.getService(AutomationService.class);

  @Context
  protected CoreSession session;

  @Context
  protected OperationContext ctx;

  @OperationMethod
  public DocumentModel run(DocumentModel input) {
    Map<String, Object> parameters = new HashMap<String, Object>();
    String state = input.getCurrentLifeCycleState();

    input = service.terminateDraftEditSession(input);

    if (input == null) {
      parameters.put("message", "Error: While attempting to terminate draft edit session.");
    } else {
      parameters.put("message", "Draft edit session succesfully terminated.");
    }

    try {
      automation.run(ctx, "WebUI.AddInfoMessage", parameters);
    } catch (OperationException e) {
      e.printStackTrace();
    }

    return input;
  }
}



