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

import static ca.firstvoices.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_WORD;

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
import org.nuxeo.runtime.api.Framework;

/**
 *
 */
@Operation(id = ComputeNativeOrderForAsset.ID, category = Constants.CAT_DOCUMENT, label =
    "Compute Native Order for a Word/Phrase", description =
    "Computes the native sort order for " + "a sepcific word/phrase within a dialect.")
public class ComputeNativeOrderForAsset {

  public static final String ID = "Document.ComputeNativeOrderForAsset";

  private static final Log log = LogFactory.getLog(ComputeNativeOrderForAsset.class);

  protected NativeOrderComputeService service = Framework
      .getService(NativeOrderComputeService.class);

  protected AutomationService automation = Framework.getService(AutomationService.class);

  @Context
  protected CoreSession session;

  @Context
  protected OperationContext ctx;

  @OperationMethod
  public DocumentModel run(DocumentModel input) {

    // Check if word or phrase
    if (input.getType().equals(FV_WORD) || input.getType().equals(FV_PHRASE)) {
      service.computeAssetNativeOrderTranslation(session, input);

      Map<String, Object> parameters = new HashMap<>();
      parameters.put("message", "Word/Phrase sort order updated. Republish if needed.");

      try {
        automation.run(ctx, "WebUI.AddInfoMessage", parameters);
      } catch (OperationException e) {
        log.error(e);
      }
    }

    return input;
  }
}
