package ca.firstvoices.webengine;

import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import org.nuxeo.ecm.webengine.invite.UserInvitationObject;
import org.nuxeo.ecm.webengine.model.WebObject;


/**
 * This file is necessary in order to register the /fv/users/ path
 * For user registration requests
 */
@Path("/fv/users")
@Produces("text/html;charset=UTF-8")
@WebObject(type = "FVUserRegistration", superType = "userRegistration")
public class FVUserInvitationObject extends UserInvitationObject {
}