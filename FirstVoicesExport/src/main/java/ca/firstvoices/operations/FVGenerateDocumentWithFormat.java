package ca.firstvoices.operations;

import ca.firstvoices.utils.FVExportUtils;
import ca.firstvoices.utils.FVExportWorkInfo;
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
import org.nuxeo.runtime.api.Framework;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static ca.firstvoices.utils.FVExportConstants.*;
import static ca.firstvoices.utils.FVExportUtils.getPathToChildInDialect;


@Operation(id=FVGenerateDocumentWithFormat.ID, category= Constants.CAT_DOCUMENT, label="Export Document with format", description="Export word or phrase documents with format (CSV or PDF). ")
public class FVGenerateDocumentWithFormat
{
    private class GeneratedQueryArguments
    {
        ArrayList<String> docsToProcess;
        String actualQuery;
    }

    public static final String ID = "Document.FVGenerateDocumentWithFormat";

    @Param( name = "query" )
    protected String query;

    @Param( name = "columns" )
    protected StringList columns;

    @Param( name = "format", values = {"CSV", "PDF"} )
    protected String format = "CSV";

    @Param( name = "exportElement", values = {"WORD", "PHRASE"} )
    protected String exportElement = "WORD";


    protected AutomationService automation = Framework.getService(AutomationService.class);

    @Context
    protected CoreSession session;

    @Context
    protected OperationContext ctx;


    @OperationMethod
    public DocumentModel run(DocumentModel input)
    {
        Map<String, Object> parameters = new HashMap<String, Object>();
        DocumentModel wrapper = null;

        try
        {
            FVExportWorkInfo workInfo = new FVExportWorkInfo();
            workInfo.workDuration = System.currentTimeMillis();;

            GeneratedQueryArguments workParams = getDocumentIDs( "*", input );

            if( workParams != null )
            {
                DocumentModel resourceFolder = FVExportUtils.findDialectChild( input, DIALECT_RESOURCES_TYPE );

                EventProducer eventProducer = Framework.getService( EventProducer.class );
                DocumentEventContext export_ctx =  new DocumentEventContext( session, session.getPrincipal(), input );

                workInfo.columns = columns;
                workInfo.dialectGUID = input.getId();
                workInfo.resourcesFolderGUID = resourceFolder.getId();
                workInfo.dialectName = input.getName();
                workInfo.exportFormat = format;
                workInfo.exportQuery = workParams.actualQuery;
                workInfo.initiatorName = session.getPrincipal().getName();
                workInfo.workDigest = FVExportUtils.makePrincipalWorkDigest(session.getPrincipal());
                workInfo.exportDigest = FVExportUtils.makeExportDigest( session.getPrincipal(), workParams.actualQuery, columns );
                workInfo.fileName = workInfo.getWrapperName();
                workInfo.exportElement = exportElement;
                workInfo.originalWorkloadSize = workParams.docsToProcess.size();

                // check if wrapper already exists
                wrapper = findWrapper( session, workInfo );

                if( wrapper != null )
                {
                    session.removeDocument( wrapper.getRef() );
                }

                String pathToNewDocument = getPathToChildInDialect(session, session.getDocument(new IdRef(workInfo.dialectGUID)), DIALECT_RESOURCES_TYPE );
                wrapper = session.createDocumentModel( pathToNewDocument, workInfo.fileName, "FVExport" );

                wrapper.setPropertyValue( "fvexport:dialect",       workInfo.dialectGUID );
                wrapper.setPropertyValue( "fvexport:format",        workInfo.exportFormat );
                wrapper.setPropertyValue( "fvexport:query",         workInfo.exportQuery );
                wrapper.setPropertyValue( "fvexport:columns",       workInfo.columns.toString() );
                wrapper.setPropertyValue( "fvexport:workdigest",    workInfo.workDigest );
                wrapper.setPropertyValue( "fvexport:exportdigest",  workInfo.exportDigest );
                wrapper.setPropertyValue( "fvexport:progress",  "Started.... " );

                workInfo.wrapper = wrapper;
                wrapper = session.createDocument(wrapper);
                session.save();

                export_ctx.setProperty( EXPORT_WORK_INFO, workInfo );
                export_ctx.setProperty( WORDS_TO_EXPORT, workParams.docsToProcess );
                Event event;

                event = export_ctx.newEvent(PRODUCE_FORMATTED_DOCUMENT);


                eventProducer.fireEvent(event);

                parameters.put( "message", "Request to export documents in " + format + " was successfully submitted" );
            }
            else
            {
                // return information
                parameters.put("message", "Error: While attempting to export documents in " + format);
            }

            automation.run(ctx, "WebUI.AddInfoMessage", parameters);

        }
        catch (OperationException e)
        {
            e.printStackTrace();
        }

        return wrapper;
    }


    private GeneratedQueryArguments getDocumentIDs( String query, DocumentModel dialect )
    {
        DocumentModelList docs;
        GeneratedQueryArguments returnArgs = new GeneratedQueryArguments();
        DocumentModel dictionary = FVExportUtils.findDialectChild( dialect, DIALECT_DICTIONARY_TYPE );
        String generatedQuery;

        if( exportElement.equals("WORD") )
        {
            generatedQuery = "SELECT * FROM FVWord WHERE ecm:ancestorId = '" + dictionary.getId() + "' AND ecm:currentLifeCycleState <> 'deleted' AND ecm:isProxy = 0 AND ecm:isVersion = 0 ORDER BY ecm:name";
        }
        else
        {
            generatedQuery = "SELECT * FROM FVPhrase WHERE ecm:ancestorId = '" + dictionary.getId() + "' AND ecm:currentLifeCycleState <> 'deleted' AND ecm:isProxy = 0 AND ecm:isVersion = 0 ORDER BY ecm:name";

        }

        if( query.equals("*") )
        {
            docs = session.query( generatedQuery ); // TODO: be weary of limits of how many records will be returned

            if( docs.size() == 0 ) return null;
        }
        else
        {
            docs = session.query( query );

            if( docs.size() == 0 ) return null;
        }

        ArrayList<String> docsToProcess = new ArrayList<>();

        for( DocumentModel doc: docs )
        {
            docsToProcess.add( doc.getId() );
        }

        returnArgs.docsToProcess = docsToProcess;
        returnArgs.actualQuery = generatedQuery;

        return returnArgs;
    }

    private DocumentModel findWrapper( CoreSession session, FVExportWorkInfo workInfo )
    {
        DocumentModel wrapper = null;

        String wrapperQ = "SELECT * FROM FVExport WHERE ecm:ancestorId = '" + workInfo.resourcesFolderGUID + "' AND fvexport:workdigest = '" + workInfo.workDigest + "' AND fvexport:exportdigest = '" + workInfo.exportDigest + "'";
        DocumentModelList docs = session.query( wrapperQ );

        if( docs != null && docs.size() > 0)
        {
            wrapper = docs.get( 0 );
        }

        return wrapper;
    }
}