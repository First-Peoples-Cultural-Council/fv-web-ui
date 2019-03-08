package ca.firstvoices.operations;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;

import javax.security.auth.login.LoginContext;

import static ca.firstvoices.utils.FVRegistrationConstants.*;

/*
    public static final int REGISTRATION_CAN_PROCEED       = 0;
    public static final int EMAIL_EXISTS_ERROR             = 1;
    public static final int LOGIN_EXISTS_ERROR             = 2;
    public static final int LOGIN_AND_EMAIL_EXIST_ERROR    = 3;
    public static final int REGISTRATION_EXISTS_ERROR      = 4;

*/
@Operation(id = FVValidateRegistrationAttempt.ID, category = Constants.CAT_USERS_GROUPS, label = "FVValidateRegistrationAttempt",
        description = "Validate new user registration attempt. Input: Login and Email of the new user. Return error code (email exists, login exist, registration can be accepted)")
public class FVValidateRegistrationAttempt
{
    public static final String ID = "FVValidateRegistrationAttempt";
    private static final Log log = LogFactory.getLog(FVValidateRegistrationAttempt.class);


    @Param(name = "Login:")
    protected String login;

    @Param(name = "email:", required = false )
    protected String email = null;


    @OperationMethod
    public int run()
    {
        LoginContext lctx = null;
        CoreSession session = null;

        DocumentModelList registrations = null;
        DocumentModel userE = null;
        DocumentModel user = null;
        int verificationState = REGISTRATION_CAN_PROCEED;

        try
        {
            lctx = Framework.login();
            session = CoreInstance.openCoreSession("default");
            UserManager userManager = Framework.getService( UserManager.class );

            user = userManager.getUserModel(login);

            if( user != null )
            {
                verificationState = LOGIN_EXISTS_ERROR;
            }
            else
            {
                String querryStr = null;

                if (email != null)
                {
                    userE = userManager.getUserModel(email);

                    if( userE != null )
                    {
                        verificationState = LOGIN_AND_EMAIL_EXIST_ERROR;
                    }
                    else
                    {
                        querryStr = String.format("Select * from Document where ecm:mixinType = 'UserRegistration' AND ecm:currentLifeCycleState = 'approved' AND ( %s = '%s' OR %s = '%s')", "userinfo:login", login, "userinfo:email", email);
                    }
                }
                else
                {
                    querryStr = String.format("Select * from Document where ecm:mixinType = 'UserRegistration' AND ecm:currentLifeCycleState = 'approved' AND  %s = '%s' ", "userinfo:login", login);
                }

                if( userE == null && querryStr != null )
                {
                    registrations = session.query(querryStr );

                    if( registrations != null && !registrations.isEmpty() )
                    {
                        verificationState = REGISTRATION_EXISTS_ERROR;
                    }
                }
            }

            lctx.logout();
        }
        catch (Exception e)
        {
            log.warn(e);
        }
        finally
        {
            if( session != null) session.close();
        }

        return verificationState;
    }
}
