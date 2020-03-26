package ca.firstvoices.operations;

import static ca.firstvoices.utils.FVExportConstants.CSV_FORMAT;
import static ca.firstvoices.utils.FVExportConstants.DIALECT_DICTIONARY_TYPE;
import static ca.firstvoices.utils.FVExportConstants.DIALECT_RESOURCES_TYPE;
import static ca.firstvoices.utils.FVExportConstants.DOCS_TO_EXPORT;
import static ca.firstvoices.utils.FVExportConstants.EXPORT_WORK_INFO;
import static ca.firstvoices.utils.FVExportConstants.FVEXPORT;
import static ca.firstvoices.utils.FVExportConstants.FVPHRASE;
import static ca.firstvoices.utils.FVExportConstants.FVWORD;
import static ca.firstvoices.utils.FVExportConstants.PDF_FORMAT;
import static ca.firstvoices.utils.FVExportConstants.PRODUCE_FORMATTED_DOCUMENT;
import static ca.firstvoices.utils.FVExportProperties.FVEXPORT_COLUMNS;
import static ca.firstvoices.utils.FVExportProperties.FVEXPORT_DIALECT;
import static ca.firstvoices.utils.FVExportProperties.FVEXPORT_DIGEST;
import static ca.firstvoices.utils.FVExportProperties.FVEXPORT_FORMAT;
import static ca.firstvoices.utils.FVExportProperties.FVEXPORT_PROGRESS_STRING;
import static ca.firstvoices.utils.FVExportProperties.FVEXPORT_PROGRESS_VALUE;
import static ca.firstvoices.utils.FVExportProperties.FVEXPORT_QUERY;
import static ca.firstvoices.utils.FVExportProperties.FVEXPORT_WORK_DIGEST;
import static ca.firstvoices.utils.FVExportUtils.checkForRunningWorkerBeforeProceeding;
import static ca.firstvoices.utils.FVExportUtils.getPathToChildInDialect;
import static ca.firstvoices.utils.FVExportUtils.makeExportWorkerID;

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

import ca.firstvoices.utils.FVExportUtils;
import ca.firstvoices.utils.FVExportWorkInfo;

/*
 * FVGenerateDocumentWithFormat endpoint starts the export of words or phrases base on provided parameters
 * for specified dialect and ties it to the requesting user.
 * Initial setup includes collection of the document IDS to be processed and filling in the work information
 * which will be passed between different stages of the export process.
 *
 * Document representing the wrapper which will hold the generated export document is returned back to the
 * requesting user.
 */

@Operation(id = FVGenerateDocumentWithFormat.ID, category = Constants.CAT_DOCUMENT, label = "Export Document with format", description = "Export word or phrase documents with format (CSV or PDF). ")
public class FVGenerateDocumentWithFormat {
    private class GeneratedQueryArguments {
        ArrayList<String> docsToProcess;

        String actualQuery;
    }

    public static final String ID = "Document.FVGenerateDocumentWithFormat";

    private static final Log log = LogFactory.getLog(FVGenerateDocumentWithFormat.class);

    @Param(name = "query")
    protected String query;

    @Param(name = "columns")
    protected StringList columns;

    @Param(name = "format", values = { CSV_FORMAT, PDF_FORMAT })
    protected String format = CSV_FORMAT;

    @Param(name = "exportElement", values = { FVWORD, FVPHRASE })
    protected String exportElement = FVWORD;

    protected AutomationService automation = Framework.getService(AutomationService.class);

    protected WorkManager workManager = Framework.getService(WorkManager.class);

    @Context
    protected CoreSession session;

    @Context
    protected OperationContext ctx;

    /**
     * @param input - dialect for which the export is to be generated
     * @return - wrapper document which will hold the exported document once finished
     */
    @OperationMethod
    public DocumentModel run(DocumentModel input) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        DocumentModel wrapper = null;

        try {
            FVExportWorkInfo workInfo = new FVExportWorkInfo();

            // setup work information for export
            workInfo.workDuration = System.currentTimeMillis();
            ;
            workInfo.columns = columns;
            workInfo.dialectGUID = input.getId();
            workInfo.dialectName = input.getName();
            workInfo.exportFormat = format;
            workInfo.initiatorName = session.getPrincipal().getName();
            workInfo.exportElement = exportElement;
            workInfo.continueAutoEvent = null;

            if (format.equals(CSV_FORMAT)) {
                workInfo.mimeType = "text/csv";
                workInfo.encoding = "UTF-8";
            }

            GeneratedQueryArguments workParams = getDocumentIDs(query, input);

            if (workParams != null) {
                DocumentModel resourceFolder = FVExportUtils.findDialectChild(input, DIALECT_RESOURCES_TYPE);

                EventProducer eventProducer = Framework.getService(EventProducer.class);
                DocumentEventContext export_ctx = new DocumentEventContext(session, session.getPrincipal(), input);

                // complete work information setup
                workInfo.resourcesFolderGUID = resourceFolder.getId();
                workInfo.exportDigest = FVExportUtils.makeExportDigest(session.getPrincipal(), workParams.actualQuery,
                        columns);
                workInfo.workDigest = FVExportUtils.makePrincipalWorkDigest(session.getPrincipal());
                workInfo.exportQuery = workParams.actualQuery;
                workInfo.originalWorkloadSize = workParams.docsToProcess.size();
                workInfo.fileName = workInfo.getWrapperName();

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
                        session.getDocument(new IdRef(workInfo.dialectGUID)), DIALECT_RESOURCES_TYPE);

                if (pathToNewDocument == null) {
                    parameters.put("message", "Error:Could not get path to new document.");
                } else {
                    wrapper = session.createDocumentModel(pathToNewDocument, workInfo.fileName, FVEXPORT);

                    wrapper.setPropertyValue(FVEXPORT_DIALECT, workInfo.dialectGUID);
                    wrapper.setPropertyValue(FVEXPORT_FORMAT, workInfo.exportFormat);
                    wrapper.setPropertyValue(FVEXPORT_QUERY, workInfo.exportQuery);
                    wrapper.setPropertyValue(FVEXPORT_COLUMNS, workInfo.columns.toString());
                    wrapper.setPropertyValue(FVEXPORT_WORK_DIGEST, workInfo.workDigest);
                    wrapper.setPropertyValue(FVEXPORT_DIGEST, workInfo.exportDigest);
                    wrapper.setPropertyValue(FVEXPORT_PROGRESS_STRING, "Started.... ");
                    wrapper.setPropertyValue(FVEXPORT_PROGRESS_VALUE, 0.0);

                    workInfo.wrapper = wrapper;
                    wrapper = session.createDocument(wrapper);
                    session.save();

                    export_ctx.setProperty(EXPORT_WORK_INFO, workInfo);
                    export_ctx.setProperty(DOCS_TO_EXPORT, workParams.docsToProcess);
                    Event event;
                    event = export_ctx.newEvent(PRODUCE_FORMATTED_DOCUMENT);
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
     * @param query - as supplied by requesting user
     * @param dialect - dialect associated with a user requesting export
     * @return - string of the query which was executed
     */
    private GeneratedQueryArguments getDocumentIDs(String query, DocumentModel dialect) {
        DocumentModelList docs;
        GeneratedQueryArguments returnArgs = new GeneratedQueryArguments();
        DocumentModel dictionary = FVExportUtils.findDialectChild(dialect, DIALECT_DICTIONARY_TYPE);
        String generatedQuery;

        generatedQuery = "SELECT * FROM " + exportElement + " WHERE ecm:ancestorId = '" + dictionary.getId()
                + "' AND ecm:isTrashed = 0 AND ecm:isProxy = 0 AND ecm:isVersion = 0 ORDER BY ecm:name";

        if (query.equals("*")) {
            docs = session.query(generatedQuery); // TODO: be weary of limits of how many records will be returned

            if (docs.size() == 0)
                return null;
        } else {
            docs = session.query(query);

            if (docs.size() == 0)
                return null;
        }

        ArrayList<String> docsToProcess = new ArrayList<>();

        for (DocumentModel doc : docs) {
            docsToProcess.add(doc.getId());
        }

        returnArgs.docsToProcess = docsToProcess;
        returnArgs.actualQuery = generatedQuery;

        return returnArgs;
    }

    /**
     * @param session - session associated with the the endpoint
     * @param workInfo - work information
     * @return - existing wrapper or null if document does not exist
     */
    private DocumentModel findWrapper(CoreSession session, FVExportWorkInfo workInfo) {
        DocumentModel wrapper = null;

        String wrapperQ = "SELECT * FROM " + FVEXPORT + " WHERE ecm:ancestorId = '" + workInfo.resourcesFolderGUID
                + "' AND fvexport:workdigest = '" + workInfo.workDigest + "' AND fvexport:exportdigest = '"
                + workInfo.exportDigest + "'";
        DocumentModelList docs = session.query(wrapperQ);

        if (docs != null && docs.size() > 0) {
            wrapper = docs.get(0);
        }

        return wrapper;
    }
}