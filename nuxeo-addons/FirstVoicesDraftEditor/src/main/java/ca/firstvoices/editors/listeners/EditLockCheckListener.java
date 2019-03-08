package ca.firstvoices.editors.listeners;

import ca.firstvoices.editors.services.DraftEditorService;
import ca.firstvoices.editors.workers.FVEditLockWorker;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;

public class EditLockCheckListener implements EventListener
{
    private static final Log log = LogFactory.getLog(EditLockCheckListener.class);

    public static final String CHECK_EDITOR_LOCKS_EVENT_NAME = "checkEditLocks";

    protected DraftEditorService service = Framework.getService(DraftEditorService.class);
    protected WorkManager workManager = Framework.getService(WorkManager.class);

    @Override
    public void handleEvent(Event event)
    {
        if (CHECK_EDITOR_LOCKS_EVENT_NAME.equals(event.getName()))
        {
            FVEditLockWorker doCheckLocks = new FVEditLockWorker();
            workManager.schedule(doCheckLocks, true);
        }
    }

}
