package ca.firstvoices.operations;

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

import java.util.HashMap;
import java.util.Map;

import static ca.firstvoices.utils.FVExportConstants.*;
import static ca.firstvoices.utils.FVExportUtils.*;

/*
 * This end-point will return all the documents export by a specific principal
 */
@Operation(id=FVFormattedDocumentGetter.ID, category= Constants.CAT_DOCUMENT, label="Get exported documents", description="Retrieve formatted (CSV or PDF) documents from principals home directory.")
public class FVFormattedDocumentGetter
{
    public static final String ID = "Document.GetFormattedDocument";

    protected AutomationService automation = Framework.getService(AutomationService.class);

    @Param( name = "format", values = {CSV_FORMAT, PDF_FORMAT} )
    protected String format = CSV_FORMAT;

    @Context
    protected CoreSession session;

    @Context
    protected OperationContext ctx;


    /**
     * @param input - dialect to check for export documents
     * @return - list of ALL export documents associated with requesting user
     *
     */
    // input should be DocumentModel for a dialect where we will check for existence of exported files
    @OperationMethod
    public DocumentModelList run( DocumentModel input)
    {
        Map<String, Object> parameters = new HashMap<String, Object>();
        DocumentModelList result = null;

        try
        {
            DocumentModel resF = findDialectChildWithRef( session, input.getRef(), DIALECT_RESOURCES_TYPE );
            String workDigest = makePrincipalWorkDigest( session.getPrincipal() );

            DocumentModelList exportFileDocs = findExportDocs( session, resF.getId(), workDigest );

            if( exportFileDocs != null )
            {
                result = exportFileDocs; //"fileName:" + exportFileName + ", documentId:" + exportFileDoc.getId() ;
            }
            else
            {
                parameters.put("message", "Error: While attempting to retrieve formatted documents from your (" + ctx.getPrincipal().getName() + ") home directory.");

                automation.run(ctx, "WebUI.AddInfoMessage", parameters);
            }
        }
        catch (OperationException e)
        {
            e.printStackTrace();
        }

        return result;
    }

    private DocumentModelList findExportDocs( CoreSession session, String resourcesFolderGUID, String workDigest )
    {
        DocumentModelList wrappers = null;

        String wrapperQ = "SELECT * FROM FVExport WHERE ecm:ancestorId = '" + resourcesFolderGUID + "' AND fvexport:workdigest = '" + workDigest + "' ORDER BY dc:created DESC";
        DocumentModelList docs = session.query( wrapperQ );

        if( docs != null && docs.size() > 0)
        {
            wrappers = docs;
        }

        return wrappers;
    }

}
