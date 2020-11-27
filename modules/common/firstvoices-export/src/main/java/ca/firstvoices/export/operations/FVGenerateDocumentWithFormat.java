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
import static ca.firstvoices.export.utils.FVExportConstants.DIALECT_DICTIONARY_TYPE;
import static ca.firstvoices.export.utils.FVExportConstants.DIALECT_RESOURCES_TYPE;
import static ca.firstvoices.export.utils.FVExportConstants.DOCS_TO_EXPORT;
import static ca.firstvoices.export.utils.FVExportConstants.EXPORT_WORK_INFO;
import static ca.firstvoices.export.utils.FVExportConstants.FVEXPORT;
import static ca.firstvoices.export.utils.FVExportConstants.FVPHRASE;
import static ca.firstvoices.export.utils.FVExportConstants.FVWORD;
import static ca.firstvoices.export.utils.FVExportConstants.PDF_FORMAT;
import static ca.firstvoices.export.utils.FVExportConstants.PRODUCE_FORMATTED_DOCUMENT;
import static ca.firstvoices.export.utils.FVExportProperties.FVEXPORT_COLUMNS;
import static ca.firstvoices.export.utils.FVExportProperties.FVEXPORT_DIALECT;
import static ca.firstvoices.export.utils.FVExportProperties.FVEXPORT_DIGEST;
import static ca.firstvoices.export.utils.FVExportProperties.FVEXPORT_FORMAT;
import static ca.firstvoices.export.utils.FVExportProperties.FVEXPORT_PROGRESS_STRING;
import static ca.firstvoices.export.utils.FVExportProperties.FVEXPORT_PROGRESS_VALUE;
import static ca.firstvoices.export.utils.FVExportProperties.FVEXPORT_QUERY;
import static ca.firstvoices.export.utils.FVExportProperties.FVEXPORT_WORK_DIGEST;
import static ca.firstvoices.export.utils.FVExportUtils.checkForRunningWorkerBeforeProceeding;
import static ca.firstvoices.export.utils.FVExportUtils.getPathToChildInDialect;
import static ca.firstvoices.export.utils.FVExportUtils.makeExportWorkerID;

import ca.firstvoices.export.utils.FVExportUtils;
import ca.firstvoices.export.utils.FVExportWorkInfo;
import java.util.ArrayList;
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
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventProducer;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;

/*
 * FVGenerateDocumentWithFormat endpoint starts the export of words or phrases base on provided
 * parameters
 * for specified dialect and ties it to the requesting user.
 * Initial setup includes collection of the document IDS to be processed and filling in the work
 *  information
 * which will be passed between different stages of the export process.
 *
 * Document representing the wrapper which will hold the generated export document is returned
 * back to the
 * requesting user.
 */

@Operation(id = FVGenerateDocumentWithFormat.ID,
    category = Constants.CAT_DOCUMENT,
    label = "Export Document with format",
    description = "Export word or phrase documents with format " + "(CSV or PDF). ")
public class FVGenerateDocumentWithFormat {

  public static final String ID = "Document.FVGenerateDocumentWithFormat";
  private static final Log log = LogFactory.getLog(FVGenerateDocumentWithFormat.class);
  @Param(name = "query") protected String query;
  @Param(name = "columns") protected StringList columns;
  @Param(name = "format", values = {CSV_FORMAT, PDF_FORMAT}) protected String format = CSV_FORMAT;
  @Param(name = "exportElement", values = {FVWORD, FVPHRASE}) protected String exportElement =
      FVWORD;
  protected AutomationService automation = Framework.getService(AutomationService.class);
  protected WorkManager workManager = Framework.getService(WorkManager.class);
  @Context protected CoreSession session;
  @Context protected OperationContext ctx;

  /**
   * @param input - dialect for which the export is to be generated
   * @return - wrapper document which will hold the exported document once finished
   */
  @OperationMethod
  public DocumentModel run(DocumentModel input) {
    Map<String, Object> parameters = new HashMap<>();
    DocumentModel wrapper = null;

    try {
      FVExportWorkInfo workInfo = new FVExportWorkInfo();

      // setup work information for export
      workInfo.setWorkDuration(System.currentTimeMillis());
      workInfo.setColumns(columns);
      workInfo.setDialectGUID(input.getId());
      workInfo.setDialectName(input.getName());
      workInfo.setExportFormat(format);
      workInfo.setInitiatorName(session.getPrincipal().getName());
      workInfo.setExportElement(exportElement);
      workInfo.setContinueAutoEvent(null);

      if (format.equals(CSV_FORMAT)) {
        workInfo.setMimeType("text/csv");
        workInfo.setEncoding("UTF-8");
      }

      GeneratedQueryArguments workParams = getDocumentIDs(query, input);

      if (workParams != null) {
        DocumentModel resourceFolder =
            FVExportUtils.findDialectChild(input, DIALECT_RESOURCES_TYPE);

        EventProducer eventProducer = Framework.getService(EventProducer.class);
        DocumentEventContext exportCtx =
            new DocumentEventContext(session, session.getPrincipal(), input);

        // complete work information setup
        workInfo.setResourcesFolderGUID(resourceFolder.getId());
        workInfo.setExportDigest(FVExportUtils.makeExportDigest(session.getPrincipal(),
            workParams.actualQuery,
            columns));
        workInfo.setWorkDigest(FVExportUtils.makePrincipalWorkDigest(session.getPrincipal()));
        workInfo.setExportQuery(workParams.actualQuery);
        workInfo.setOriginalWorkloadSize(workParams.docsToProcess.size());
        workInfo.setFileName(workInfo.getWrapperName());

        // check if wrapper already exists
        wrapper = findWrapper(session, workInfo);

        if (wrapper != null) {
          if (checkForRunningWorkerBeforeProceeding(makeExportWorkerID(workInfo), workManager)) {
            return wrapper; // return a valid wrapper if export is already running
          }

          // cannot delete wrapper if worker is running to create export file
          session.removeDocument(wrapper.getRef());
        }

        String pathToNewDocument = getPathToChildInDialect(session,
            session.getDocument(new IdRef(workInfo.getDialectGUID())),
            DIALECT_RESOURCES_TYPE);

        if (pathToNewDocument == null) {
          parameters.put("message", "Error:Could not get path to new document.");
        } else {
          wrapper =
              session.createDocumentModel(pathToNewDocument, workInfo.getFileName(), FVEXPORT);

          wrapper.setPropertyValue(FVEXPORT_DIALECT, workInfo.getDialectGUID());
          wrapper.setPropertyValue(FVEXPORT_FORMAT, workInfo.getExportFormat());
          wrapper.setPropertyValue(FVEXPORT_QUERY, workInfo.getExportQuery());
          wrapper.setPropertyValue(FVEXPORT_COLUMNS, workInfo.getColumns().toString());
          wrapper.setPropertyValue(FVEXPORT_WORK_DIGEST, workInfo.getWorkDigest());
          wrapper.setPropertyValue(FVEXPORT_DIGEST, workInfo.getExportDigest());
          wrapper.setPropertyValue(FVEXPORT_PROGRESS_STRING, "Started.... ");
          wrapper.setPropertyValue(FVEXPORT_PROGRESS_VALUE, 0.0);

          workInfo.setWrapper(wrapper);
          wrapper = session.createDocument(wrapper);
          session.save();

          exportCtx.setProperty(EXPORT_WORK_INFO, workInfo);
          exportCtx.setProperty(DOCS_TO_EXPORT, workParams.docsToProcess);
          Event event;
          event = exportCtx.newEvent(PRODUCE_FORMATTED_DOCUMENT);
          eventProducer.fireEvent(event);

          parameters.put("message", "Request to export documents in " + format + " was submitted");
        }
      } else {
        // return information
        parameters.put("message", "Error:Nothing to export for " + format);
      }

      automation.run(ctx, "WebUI.AddInfoMessage", parameters);

    } catch (OperationException e) {
      log.error(e);
    }

    return wrapper;
  }

  /**
   * @param query   - as supplied by requesting user
   * @param dialect - dialect associated with a user requesting export
   * @return - string of the query which was executed
   */
  private GeneratedQueryArguments getDocumentIDs(String query, DocumentModel dialect) {
    DocumentModelList docs;
    DocumentModel dictionary = FVExportUtils.findDialectChild(dialect, DIALECT_DICTIONARY_TYPE);
    String generatedQuery;

    generatedQuery =
        "SELECT * FROM " + exportElement + " WHERE ecm:ancestorId = '" + dictionary.getId()
            + "' AND ecm:isTrashed = 0 AND ecm:isProxy = 0 AND ecm:isVersion = 0 ORDER BY "
            + "ecm:name";

    if (query.equals("*")) {
      docs = session.query(generatedQuery); // TODO: be weary of limits of how many records will be
      // returned

      if (docs.isEmpty()) {
        return null;
      }
    } else {
      docs = session.query(query);

      if (docs.isEmpty()) {
        return null;
      }
    }

    ArrayList<String> docsToProcess = new ArrayList<>();

    for (DocumentModel doc : docs) {
      docsToProcess.add(doc.getId());
    }
    GeneratedQueryArguments returnArgs = new GeneratedQueryArguments();

    returnArgs.docsToProcess = docsToProcess;
    returnArgs.actualQuery = generatedQuery;

    return returnArgs;
  }

  /**
   * @param session  - session associated with the the endpoint
   * @param workInfo - work information
   * @return - existing wrapper or null if document does not exist
   */
  private DocumentModel findWrapper(CoreSession session, FVExportWorkInfo workInfo) {
    DocumentModel wrapper = null;

    String wrapperQ = "SELECT * FROM " + FVEXPORT + " WHERE ecm:ancestorId = '"
        + workInfo.getResourcesFolderGUID() + "' AND fvexport:workdigest = '"
        + workInfo.getWorkDigest() + "' AND fvexport:exportdigest = '" + workInfo.getExportDigest()
        + "'";
    DocumentModelList docs = session.query(wrapperQ);

    if (docs != null && !docs.isEmpty()) {
      wrapper = docs.get(0);
    }

    return wrapper;
  }

  private class GeneratedQueryArguments {

    ArrayList<String> docsToProcess;

    String actualQuery;
  }
}
