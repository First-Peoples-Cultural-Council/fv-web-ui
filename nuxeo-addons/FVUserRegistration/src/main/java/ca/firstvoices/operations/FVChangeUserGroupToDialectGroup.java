package ca.firstvoices.operations;

import ca.firstvoices.services.FVMoveUserToDialectServiceImpl;
import ca.firstvoices.utils.FVRegistrationUtilities;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

import javax.ws.rs.core.Response;

@Operation(id = FVChangeUserGroupToDialectGroup.ID, category = Constants.CAT_USERS_GROUPS, label = "FVChangeUserGroupToDialectGroup",
        description = "Language administrator operation to include user(s) in one of the dialect groups (members, recorders, recorders+)")
public class FVChangeUserGroupToDialectGroup
{

    public static final String ID = "FVChangeUserGroupToDialectGroup";

    private static final Log log = LogFactory.getLog(FVGetPendingUserRegistrations.class);

    @Context
    protected CoreSession session;

    @Param(name = "userNames" )
    protected StringList userNames = null;

    @Param(name = "groupName" )
    protected String groupName;

    @OperationMethod
    public Object run( DocumentModel dialect )
    {
        FVMoveUserToDialectServiceImpl util = new FVMoveUserToDialectServiceImpl();

        try
        {
            for (String uName : userNames)
            {
                util.placeNewUserInGroup(dialect, groupName, uName);
                log.info("Moved user " + uName +" to group " + groupName );
            }

            // Remove registration request as it has been dealt with
            // Future user modifications should be done via other look-ups
            FVRegistrationUtilities.removeRegistrationsForUsers(session, userNames);
        }
        catch( Exception e)
        {
            log.error( e );
            return Response.status(Response.Status.FORBIDDEN).entity(e.getMessage()).build();
        }

        return Response.status(200).entity("User(s) updated successfully.").build();
    }
}
