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
import static ca.firstvoices.utils.FVOperationCredentialsVerification.terminateOnInvalidCredentials_GroupUpdate;
import static ca.firstvoices.utils.FVOperationCredentialsVerification.terminateOnInvalidCredentials_NewUserHomeChange;
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

  public void placeNewUserInGroup(DocumentModel dialect, String groupName, String newUsername)
      throws Exception {
    CoreSession session = dialect.getCoreSession();
    userManager = Framework.getService(UserManager.class);

    if (terminateOnInvalidCredentials_GroupUpdate(session, groupName.toLowerCase())) {
      throw new Exception(
          "placeNewUserInGroup: No sufficient privileges to modify group: " + groupName);
    }

    if (terminateOnInvalidCredentials_NewUserHomeChange(session, userManager, newUsername,
        dialect.getId())) {
      throw new Exception(
          "placeNewUserInGroup: No sufficient privileges to modify user: " + newUsername);
    }

    userManager = null;
    // allow system to move user between groups
    systemPlaceNewUserInGroup(dialect, groupName, newUsername, session);
  }

  public void systemPlaceNewUserInGroup(DocumentModel dialect, String groupName, String newUsername,
      CoreSession session) throws Exception {
    CoreInstance.doPrivileged(session, s -> {
      moveUserBetweenGroups(dialect, newUsername, "members", groupName.toLowerCase());
    });
  }

  public void moveUserBetweenGroups(DocumentModel dialect, String userName, String fromGroupName,
      String toGroupName) {
    if (userManager == null) {
      userManager = Framework.getService(UserManager.class);
    }

    userManager = Framework.getService(UserManager.class);

    fromGroupName = fromGroupName.toLowerCase();
    toGroupName = toGroupName.toLowerCase();

    DocumentModel toGroup = userManager.getGroupModel(toGroupName);

    //        if (toGroup == null) {
    //            throw new Exception("moveUserBetweenGroups: Cannot update non-existent group:
    //            " + toGroupName);
    //        }

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

  @Override
  public void removeUserFromGroup(DocumentModel dialect, String fromGroupName) {
    if (userManager == null) {
      userManager = Framework.getService(UserManager.class);
    }
  }

  @Override
  public void addUserToGroup(DocumentModel dialect, String toGroupName) {
    if (userManager == null) {
      userManager = Framework.getService(UserManager.class);
    }
  }

}

/*
 * OperationContext ctx = new OperationContext(session); // // Map<String, Object> params = new
 * HashMap<>(); //
 * params.put("groupname", "members"); // params.put("members", username ); // params.put
 * ("membersAction", REMOVE ); //
 * // automationService.run(ctx, "FVUpdateGroup", params); // // params.put("groupname",
 * newUserGroup); //
 * params.put("members", username ); // params.put("membersAction", APPEND ); // //
 * automationService.run(ctx,
 * "FVUpdateGroup", params); // // params.clear(); // params.put("username", username); //
 * params.put("groups",
 * newUserGroup); // params.put("groupsAction", UPDATE); // automationService.run(ctx,
 * "FVUpdateUser", params);
 * DocumentModel groupDoc = userManager.getGroupModel(groupName.toLowerCase()); if (groupDoc ==
 * null) { throw new
 * OperationException("Cannot update non-existent group: " + groupName); } if(
 * terminateOnInvalidCredentials_GU(
 * session, userManager, groupName ) ) return; // invalid credentials if( members != null ) {
 * updateFVProperty(
 * membersAction, groupDoc, members, GROUP_SCHEMA, MEMBERS ); } if (subGroups != null) {
 * StringList alwaysLowerCase =
 * new StringList(); for(String gn : subGroups ) { alwaysLowerCase.add( gn.toLowerCase()); }
 * updateFVProperty(
 * subGroupsAction, groupDoc, alwaysLowerCase, GROUP_SCHEMA, SUB_GROUPS ); } if (parentGroups !=
 *  null ) { StringList
 * alwaysLowerCase = new StringList(); for(String gn : parentGroups ) { alwaysLowerCase.add( gn
 * .toLowerCase()); }
 * updateFVProperty( parentGroupsAction, groupDoc, alwaysLowerCase, GROUP_SCHEMA, PARENT_GROUPS
 * ); } for (Entry<String,
 * String> entry : Arrays.asList( new SimpleEntry<>(GROUP_LABEL, groupLabel), new SimpleEntry<>
 (GROUP_DESCRIPTION,
 * groupDescription))) { String key = entry.getKey(); String value = entry.getValue(); if
 * (StringUtils.isNotBlank(value)) { properties.put(key, value); } } for (Entry<String, String>
 entry :
 * properties.entrySet()) { String key = entry.getKey(); String value = entry.getValue(); if
 * (key.startsWith(GROUP_COLON)) { key = key.substring(GROUP_COLON.length()); } groupDoc
 * .setProperty(GROUP_SCHEMA, key,
 * value); } userManager.updateGroup(groupDoc); groupDoc = userManager.getGroupModel(groupName
 * .toLowerCase());
 */
