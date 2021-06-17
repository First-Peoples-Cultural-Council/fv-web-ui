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

package ca.firstvoices.operations;

import ca.firstvoices.services.FVMoveUserToDialectServiceImpl;
import ca.firstvoices.utils.FVRegistrationUtilities;
import javax.ws.rs.core.Response;
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

@Operation(id = FVChangeUserGroupToDialectGroup.ID,
    category = Constants.CAT_USERS_GROUPS,
    label = "FVChangeUserGroupToDialectGroup",
    description = "Language administrator operation "
        + "to include user(s) in one of the dialect groups (members, recorders, recorders+)")
public class FVChangeUserGroupToDialectGroup {

  public static final String ID = "FVChangeUserGroupToDialectGroup";

  private static final Log log = LogFactory.getLog(FVChangeUserGroupToDialectGroup.class);

  @Context protected CoreSession session;

  @Param(name = "userNames") protected StringList userNames = null;

  @Param(name = "groupName") protected String groupName;

  @OperationMethod
  public Object run(DocumentModel dialect) {
    FVMoveUserToDialectServiceImpl util = new FVMoveUserToDialectServiceImpl();

    try {
      for (String userName : userNames) {
        util.placeNewUserInGroup(dialect, groupName, userName);
        log.info("Moved user " + userName + " to group " + groupName);
      }

      // Remove registration request as it has been dealt with
      // Future user modifications should be done via other look-ups
      FVRegistrationUtilities.removeRegistrationsForUsers(session, userNames);
    } catch (Exception e) {
      log.error(e);
      return Response.status(Response.Status.FORBIDDEN).entity(e.getMessage()).build();
    }

    return Response.status(200).entity("User(s) updated successfully.").build();
  }
}
