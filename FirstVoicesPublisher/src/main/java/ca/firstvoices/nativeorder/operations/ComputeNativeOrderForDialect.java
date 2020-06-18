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

package ca.firstvoices.nativeorder.operations;

import static ca.firstvoices.schemas.DomainTypesConstants.FV_DIALECT;

import ca.firstvoices.nativeorder.services.NativeOrderComputeService;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.runtime.api.Framework;

/*
 *
 */
@Operation(id = ComputeNativeOrderForDialect.ID, category = Constants.CAT_DOCUMENT, label =
    "Compute Native Order for Dialect", description =
    "Computes the native sort order for all " + "words/phrases within a dialect.")
public class ComputeNativeOrderForDialect {

  public static final String ID = "Document.ComputeNativeOrderForDialect";

  private static final Log log = LogFactory.getLog(ComputeNativeOrderForDialect.class);

  protected NativeOrderComputeService service = Framework
      .getService(NativeOrderComputeService.class);

  protected AutomationService automation = Framework.getService(AutomationService.class);

  @Context
  protected CoreSession session;

  @Context
  protected OperationContext ctx;

  @OperationMethod
  public DocumentModel run(DocumentModel input) {

    // Check if dialect
    if (input.getType().equals(FV_DIALECT)) {

      DocumentModel alphabet = session
          .getDocument(new PathRef(input.getPathAsString() + "/Alphabet"));
      alphabet.setPropertyValue("custom_order_recompute_required", true);
      session.saveDocument(alphabet);

      Map<String, Object> parameters = new HashMap<String, Object>();
      parameters.put("message", "Dialect sort order will be updated shortly. Republish if needed.");

      try {
        automation.run(ctx, "WebUI.AddInfoMessage", parameters);
      } catch (OperationException e) {
        log.error(e);
      }
    }

    return input;
  }
}
