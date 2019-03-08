package ca.firstvoices.webengine;

import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.nuxeo.ecm.webengine.invite.UserInvitationObject;
import org.nuxeo.ecm.webengine.model.WebObject;


/**
 * @author <a href="mailto:akervern@nuxeo.com">Arnaud Kervern</a>
 */
@Path("/fv/users")
@Produces("text/html;charset=UTF-8")
@WebObject(type = "FVUserRegistration", superType = "userRegistration")
public class FVUserInvitationObject extends UserInvitationObject {
//    protected String requestedSpace;
//    protected String ageGroup;
//    protected String role;
//
//    public String getRequestedSpace() {
//        return requestedSpace;
//    }
//
//    public void setRequestedSpace(String requestedSpace) {
//        this.requestedSpace = requestedSpace;
//    }
//
//    public String getAgeGroup() {
//        return ageGroup;
//    }
//
//    public void setAgeGroup(String ageGroup) {
//        this.ageGroup = ageGroup;
//    }
//
//    public String getRole() {
//        return role;
//    }
//
//    public void setRole(String role) {
//        this.role = role;
//    }

}