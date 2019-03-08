package ca.firstvoices.listeners;

import ca.firstvoices.utils.FVExportUtils;
import ca.firstvoices.utils.FVExportWorkInfo;
import ca.firstvoices.workers.FVAbstractExportWork;
import ca.firstvoices.workers.FVCyclicExportWorker;
import ca.firstvoices.workers.FVExportBlobWorker;
import ca.firstvoices.workers.FVExportWorker;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;

import java.util.*;


import static ca.firstvoices.utils.FVExportConstants.*;
import static ca.firstvoices.utils.FVExportUtils.makeExportWorkerID;

/*
 *
 */
public class FVExportListener implements EventListener
{
    private static final Log log = LogFactory.getLog(FVExportListener.class);

    protected WorkManager workManager = Framework.getService(WorkManager.class);

    @Override
    public void handleEvent(Event event)
    {
        EventContext ctx = event.getContext();

        switch( event.getName() )
        {
            case PRODUCE_FORMATTED_DOCUMENT: // starting point for an export operations
                FVExportWorkInfo info = (FVExportWorkInfo) ctx.getProperty( EXPORT_WORK_INFO );

                String id = makeExportWorkerID( info );

                if( checkForRunningWorkerBeforeProceeding( id ) )
                {
                    workManager.schedule(produceWorker(ctx, new FVExportWorker(id)), true);
                }
                break;

            case FINISH_EXPORT_BY_WRAPPING_BLOB: // conclusion of the export - send document to be included in a wrapper
                workManager.schedule( produceBlobWorker( ctx ), true);
                break;

            case AUTO_PRODUCE_FORMATTED_DOCUMENT: // placeholder for cyclic export
                if( checkForRunningWorkerBeforeProceeding( CYCLIC_WORKER_ID ) )
                {
                    workManager.schedule( produceWorker(ctx, new FVCyclicExportWorker() ), true);
                }
                break;

            case AUTO_NEXT_EXPORT_WORKER: // cyclic: move to work on next export document
                break;
        }
    }

    private boolean checkForRunningWorkerBeforeProceeding( String workId )
    {
        if( !FVExportUtils.checkForRunningWorkerBeforeProceeding( workId, workManager ) ) return true; // worker is not running

        return false; // worker is running
    }

    private FVAbstractExportWork produceBlobWorker( EventContext ctx )
    {
        FVExportWorkInfo info = (FVExportWorkInfo)ctx.getProperty( EXPORT_WORK_INFO );
        FVExportBlobWorker work = new FVExportBlobWorker( String.valueOf(System.nanoTime()), info );
        return work;
    }

    private FVAbstractExportWork produceWorker( EventContext ctx, FVAbstractExportWork work )
    {
        if( ctx.hasProperty( EXPORT_WORK_INFO) )
        {
            work.setWorkInfo( (FVExportWorkInfo)ctx.getProperty( EXPORT_WORK_INFO ) );

            StringList pc = work.getExportColumns();

            work.setExportColumns( pc );

            work.setDocuments("FV", (ArrayList<String>) ctx.getProperty( DOCS_TO_EXPORT ) );
        }
        else
        {
            FVExportWorkInfo workInfo = new FVExportWorkInfo();

            workInfo.workDuration       = System.currentTimeMillis();;
            workInfo.dialectGUID        = INHERITED_FROM_OTHER;
            workInfo.dialectName        = INHERITED_FROM_OTHER;
            workInfo.exportFormat       = INHERITED_FROM_OTHER;
            workInfo.initiatorName      = INHERITED_FROM_OTHER;
            workInfo.exportElement      = INHERITED_FROM_OTHER;
            workInfo.continueAutoEvent  = AUTO_NEXT_EXPORT_WORKER; // continue to next export document set

            work.setExportQuery( INHERITED_FROM_OTHER );
            work.setInitiatorName( "System" );
            work.setDialectName( INHERITED_FROM_OTHER );
            work.setDialectGUID( INHERITED_FROM_OTHER );
            work.setExportFormat( INHERITED_FROM_OTHER );

            work.setWorkInfo( workInfo );
        }

        return work;
    }
}
