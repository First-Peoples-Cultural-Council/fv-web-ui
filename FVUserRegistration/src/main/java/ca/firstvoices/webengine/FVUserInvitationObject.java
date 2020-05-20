/*
 *
 *  *
 *  * Copyright 2020 First People's Cultural Council
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  * /
 *
 */

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
