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

package ca.firstvoices.export.operations;

import static ca.firstvoices.export.utils.FVExportConstants.CSV_FORMAT;
import static ca.firstvoices.export.utils.FVExportConstants.DIALECT_RESOURCES_TYPE;
import static ca.firstvoices.export.utils.FVExportConstants.PDF_FORMAT;
import static ca.firstvoices.export.utils.FVExportUtils.findDialectChildWithRef;
import static ca.firstvoices.export.utils.FVExportUtils.makePrincipalWorkDigest;
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
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.runtime.api.Framework;

/*
 * This end-point will return all the documents export by a specific principal
 */
@Operation(id = FVFormattedDocumentGetter.ID,
    category = Constants.CAT_DOCUMENT,
    label = "Get " + "exported documents",
    description = "Retrieve formatted (CSV or PDF) documents from " + "principals home directory.")
public class FVFormattedDocumentGetter {

  public static final String ID = "Document.GetFormattedDocument";

  private static final Log log = LogFactory.getLog(FVFormattedDocumentGetter.class);

  protected AutomationService automation = Framework.getService(AutomationService.class);

  @Param(name = "format", values = {CSV_FORMAT, PDF_FORMAT}) protected String format = CSV_FORMAT;

  @Context protected CoreSession session;

  @Context protected OperationContext ctx;

  /**
   * @param input - dialect to check for export documents
   * @return - list of ALL export documents associated with requesting user
   */
  // input should be DocumentModel for a dialect where we will check for existence of exported
  // files
  @OperationMethod
  public DocumentModelList run(DocumentModel input) {
    Map<String, Object> parameters = new HashMap<>();
    DocumentModelList result = null;

    try {
      DocumentModel resF = findDialectChildWithRef(session, input.getRef(), DIALECT_RESOURCES_TYPE);
      String workDigest = makePrincipalWorkDigest(session.getPrincipal());

      DocumentModelList exportFileDocs = findExportDocs(session, resF.getId(), workDigest);

      if (exportFileDocs != null) {
        result = exportFileDocs; // "fileName:" + exportFileName + ", documentId:" +
      } else {
        parameters.put("message",
            "Error: While attempting to retrieve formatted documents from your (" + ctx
                .getPrincipal()
                .getName() + ") home directory.");

        automation.run(ctx, "WebUI.AddInfoMessage", parameters);
      }
    } catch (OperationException e) {
      log.error(e);
    }

    return result;
  }

  private DocumentModelList findExportDocs(
      CoreSession session, String resourcesFolderGUID, String workDigest) {
    DocumentModelList wrappers = null;

    String wrapperQ = "SELECT * FROM FVExport WHERE ecm:ancestorId = '" + resourcesFolderGUID
        + "' AND fvexport:workdigest = '" + workDigest + "' ORDER BY dc:created DESC";
    DocumentModelList docs = session.query(wrapperQ);

    if (docs != null && !docs.isEmpty()) {
      wrappers = docs;
    }

    return wrappers;
  }

}
