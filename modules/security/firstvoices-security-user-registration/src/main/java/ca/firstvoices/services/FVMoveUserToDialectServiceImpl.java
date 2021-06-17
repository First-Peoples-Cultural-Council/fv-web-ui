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

package ca.firstvoices.services;

import static ca.firstvoices.services.FVUserGroupUpdateUtilities.updateFVProperty;
import static ca.firstvoices.utils.FVOperationCredentialsVerification.groupUpdate;
import static ca.firstvoices.utils.FVOperationCredentialsVerification.newUserHomeChange;
import static ca.firstvoices.utils.FVRegistrationConstants.APPEND;
import static ca.firstvoices.utils.FVRegistrationConstants.GROUP_SCHEMA;
import static ca.firstvoices.utils.FVRegistrationConstants.MEMBERS;
import static ca.firstvoices.utils.FVRegistrationConstants.REMOVE;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;

public class FVMoveUserToDialectServiceImpl implements FVMoveUserToDialectService {

  private UserManager userManager = null;

  public void placeNewUserInGroup(DocumentModel dialect, String groupName, String newUsername) {
    CoreSession session = dialect.getCoreSession();
    userManager = Framework.getService(UserManager.class);

    if (groupUpdate(session, groupName.toLowerCase())) {
      throw new IllegalArgumentException(
          "placeNewUserInGroup: No sufficient privileges to modify group: " + groupName);
    }

    if (newUserHomeChange(session,
        userManager,
        newUsername,
        dialect.getId())) {
      throw new IllegalArgumentException(
          "placeNewUserInGroup: No sufficient privileges to modify user: " + newUsername);
    }

    userManager = null;
    // allow system to move user between groups
    systemPlaceNewUserInGroup(dialect, groupName, newUsername, session);
  }

  public void systemPlaceNewUserInGroup(
      DocumentModel dialect, String groupName, String newUsername, CoreSession session) {
    CoreInstance.doPrivileged(session, s -> {
      moveUserBetweenGroups(dialect, newUsername, "members", groupName.toLowerCase());
    });
  }

  public void moveUserBetweenGroups(
      DocumentModel dialect, String userName, String fromGroupName, String toGroupName) {
    if (userManager == null) {
      userManager = Framework.getService(UserManager.class);
    }

    userManager = Framework.getService(UserManager.class);

    fromGroupName = fromGroupName.toLowerCase();
    toGroupName = toGroupName.toLowerCase();

    DocumentModel toGroup = userManager.getGroupModel(toGroupName);

    if (toGroup != null) {
      DocumentModel membersGroup = userManager.getGroupModel(fromGroupName);

      StringList userList = new StringList();
      userList.add(userName);
      membersGroup = updateFVProperty(REMOVE, membersGroup, userList, GROUP_SCHEMA, MEMBERS);
      userManager.updateGroup(membersGroup);
      toGroup = updateFVProperty(APPEND, toGroup, userList, GROUP_SCHEMA, MEMBERS);
      userManager.updateGroup(toGroup);
      userManager = null;
    }
  }


}
