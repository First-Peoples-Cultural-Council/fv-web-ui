package ca.firstvoices.workers;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import static ca.firstvoices.utils.FVExportConstants.CYCLIC_EXPORT_WORKER_CATEGORY;
import static ca.firstvoices.utils.FVExportConstants.CYCLIC_WORKER_ID;

/*
   Worker description is in FVAbstractExportWorker file.
*/

public class FVCyclicExportWorker extends FVAbstractExportWork
{
    private static final Log log = LogFactory.getLog(FVCyclicExportWorker.class);

    @Override
    public String getCategory() {
        return CYCLIC_EXPORT_WORKER_CATEGORY;
    }

    @Override
    public String getTitle() {
        return "Produce formatted document when triggered by cron.";
    }

    public FVCyclicExportWorker() { super( CYCLIC_WORKER_ID ); } // we will not need more than one

    @Override
    public void work()
    {

        // make a list of all known exports in FV
        // start new update cycle
        // things to consider
        // - using temp file for storing outstanding work?
        // - how to drive updates
        // - how to check if export needs to be updated
        // - how to trigger autoamtic re-run of the worker, outside of cron, to process all exports
        try
        {
            log.warn("FVCyclicExportWorker is not implemented yet.");
        }
        catch (Exception e)
        {
            log.warn(e);
        }
    }
}
