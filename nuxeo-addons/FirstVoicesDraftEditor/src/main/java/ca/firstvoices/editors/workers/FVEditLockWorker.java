package ca.firstvoices.editors.workers;

//import org.nuxeo.ecm.platform.audit.api.AuditLogger;
import ca.firstvoices.editors.services.DraftEditorService;
import ca.firstvoices.editors.synchronizers.SynchronizerFactory;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.Lock;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;

import java.util.Calendar;
import java.util.Date;

public class FVEditLockWorker extends AbstractWork {
    private static final Log log = LogFactory.getLog(SynchronizerFactory.class);

    protected DraftEditorService service = Framework.getService(DraftEditorService.class);

    private static final int LOCK_EXPIRATION_DURATION_IN_MINUTES = 30; // minutes

    public static final String CATEGORY_CHECK_EDITOR_LOCKS = "checkEditLocks";

    @Override
    public String getCategory() {
        return CATEGORY_CHECK_EDITOR_LOCKS;
    }

    @Override
    public String getTitle() {
        return "Check document edit locks.";
    }

    public FVEditLockWorker() {
        super("check-edit-locks");
    }

    private boolean isLockExpired( Calendar lockCreated ) {
        Date now = Calendar.getInstance().getTime();
        Date lockTime = lockCreated.getTime();
        long timeDiff = now.getTime() - lockTime.getTime();

        // <p> calculation below is just minutes within 1 hr <p>
        //
        // if lock is (accidently) held over 1 hr the mod rolls over
        // for expiration times over 60 minutes we need to change the calculation to reflect it.
        // .
        // NOTE: the checking interval duration can impact calculations as well
        // if change to LOCK_EXPIRATION_DURATION_IN_MINUTES is made and is close or longer than 1 hr
        // following should be used
        // return (timeDiff / (60 * 1000) % 60) + 60 * (timeDiff / (60 * 60 * 1000) % 24) > LOCK_EXPIRATION_DURATION_IN_MINUTES;
        // to calculate minutes within 1 day.
        //
        return (timeDiff / (60 * 1000) % 60) > LOCK_EXPIRATION_DURATION_IN_MINUTES;
    }

    @Override
    public void work() {
        //initSession();

        try {
            String query = "SELECT * FROM Document  WHERE ecm:lockOwner IS NOT NULL AND ecm:mixinType IN ('FVLocalConf') AND ecm:isVersion = 0";

            DocumentModelList assets = session.query(query, 100);

            for (DocumentModel child : assets) {
                Lock docLockInfo = child.getLockInfo();
                Calendar lockCreated = docLockInfo.getCreated();

                // TODO: adjust lock expiration time if needed
                if( isLockExpired ( lockCreated ) ) {
                    // trigger lock release
                    if( service.releaseTimedOutLock( child ) ) {
                        String lockOwner = docLockInfo.getOwner();

                        log.warn("Draft-edit lock succesfully released uuid "+child.getId()+ " lock info " + docLockInfo);
                    }
                    else {
                        log.warn("Draft lock did not have to be released uuid "+child.getId());
                    }
                }
            }

        } catch (Exception e) {
            log.warn(e);
        }
    }
}
