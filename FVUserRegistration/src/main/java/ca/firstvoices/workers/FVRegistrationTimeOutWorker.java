package ca.firstvoices.workers;

import ca.firstvoices.utils.FVRegistrationMailUtilities;
import ca.firstvoices.utils.FVRegistrationUtilities;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;

import java.util.Calendar;

import static ca.firstvoices.operations.FVGetPendingUserRegistrations.APPROVED;
import static ca.firstvoices.utils.FVRegistrationConstants.*;

/**
 *
 */
public class FVRegistrationTimeOutWorker extends AbstractWork {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    private static final Log log = LogFactory.getLog(FVRegistrationTimeOutWorker.class);

    public static final String CATEGORY_CHECK_REGISTRATION_TIMEOUT = "checkEditLocks";

    @Override
    public String getCategory() {
        return CATEGORY_CHECK_REGISTRATION_TIMEOUT;
    }

    @Override
    public String getTitle() {
        return "Check user registration timeout.";
    }

    public FVRegistrationTimeOutWorker() {
        super("check-registration-timeout");
    }

    private int checkRegistrationTimeOut(Calendar dateRegistered) {
        long diffDays = FVRegistrationUtilities.calculateRegistrationAgeInDays(dateRegistered);
        long modHours = FVRegistrationUtilities.calculateRegistrationModHours(dateRegistered);

        int actionValue = 0;

        // currently set to check at 2am, 10am, 6pm
        if (diffDays == REGISTRATION_DELETION_IN_DAYS && modHours < 8)
            actionValue = REGISTRATION_DELETION_ACT;
        else if (diffDays == REGISTRATION_EXPIRATION_IN_DAYS && modHours < 8)
            actionValue = REGISTRATION_EXPIRATION_ACT;
        else if (diffDays == MID_REGISTRATION_PERIOD_IN_DAYS && modHours < 8)
            actionValue = MID_REGISTRATION_PERIOD_ACT;

        return actionValue;
    }

    @Override
    public void work() {

        CoreInstance.doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(), session -> {
            FVRegistrationMailUtilities mailUtil = new FVRegistrationMailUtilities();

            DocumentModelList registrations = session.query(
                    "SELECT * FROM FVUserRegistration WHERE ecm:currentLifeCycleState = '" + APPROVED + "'");

            for (DocumentModel uReg : registrations) {
                Calendar regCreated = (Calendar) uReg.getPropertyValue("dc:created");

                if (regCreated == null) {
                    // Seems like some registrations can come in with dc:created = null, so set current time to those
                    Calendar date = Calendar.getInstance();
                    uReg.setPropertyValue("dc:created", date);
                    session.saveDocument(uReg);
                }
                else {
                    int regTOType = checkRegistrationTimeOut(regCreated);

                    // regTOType
                    //
                    // 0 - no action required (either already dealt with or still within no-action period)
                    //
                    // MID_REGISTRATION_PERIOD_ACT - registration is closing on timeout
                    // an email needs to be sent to a user who started registration
                    // and email informing LanguageAdministrator that user registration will be deleted in ? days
                    //
                    // REGISTRATION_EXPIRATION_ACT - registration timed out and it will be deleted in 24 hrs - last chance
                    // to activate account
                    // send an email to originator of registration request with information about cancellation
                    //
                    // REGISTRATION_DELETION_ACT - registration should be deleted
                    //

                    switch (regTOType) {
                        // TODO: Add to Audit log => log.info( "Registration period expired for user" +
                        // uReg.getPropertyValue("userinfo:firstName") + " " + uReg.getPropertyValue("userinfo:lastName") + ".
                        // Registration was deleted.");
                        case REGISTRATION_DELETION_ACT:
                            session.removeDocument(uReg.getRef());
                            break;

                        case MID_REGISTRATION_PERIOD_ACT:
                        case REGISTRATION_EXPIRATION_ACT:
                            try {
                                mailUtil.emailReminder(regTOType, uReg, session);
                            } catch (Exception e) {
                                log.error("Can not send reminder email", e);
                            }
                            break;
                    }
                }
            }
        });

    }

}