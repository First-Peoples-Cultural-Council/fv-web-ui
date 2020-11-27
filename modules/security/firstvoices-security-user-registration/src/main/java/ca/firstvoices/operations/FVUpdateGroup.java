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

import static ca.firstvoices.services.FVUserGroupUpdateUtilities.updateFVProperty;
import static ca.firstvoices.utils.FVOperationCredentialsVerification.terminateOnInvalidCredentials_GroupUpdate;
import static ca.firstvoices.utils.FVRegistrationConstants.APPEND;
import static ca.firstvoices.utils.FVRegistrationConstants.GROUP_COLON;
import static ca.firstvoices.utils.FVRegistrationConstants.GROUP_DESCRIPTION;
import static ca.firstvoices.utils.FVRegistrationConstants.GROUP_LABEL;
import static ca.firstvoices.utils.FVRegistrationConstants.GROUP_SCHEMA;
import static ca.firstvoices.utils.FVRegistrationConstants.MEMBERS;
import static ca.firstvoices.utils.FVRegistrationConstants.PARENT_GROUPS;
import static ca.firstvoices.utils.FVRegistrationConstants.REMOVE;
import static ca.firstvoices.utils.FVRegistrationConstants.SUB_GROUPS;
import static ca.firstvoices.utils.FVRegistrationConstants.UPDATE;

import java.util.AbstractMap.SimpleEntry;
import java.util.Arrays;
import java.util.Map.Entry;
import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.util.Properties;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.usermanager.UserManager;

/**
 *
 */
@Operation(id = FVUpdateGroup.ID, category = Constants.CAT_USERS_GROUPS, label = "FVUpdateGroup",
    description =
    "Updates group information. "
        + "Possible actions are 'update'(default), 'append' and 'remove' .")
public class FVUpdateGroup {

  public static final String ID = "FVUpdateGroup";

  @Context
  protected UserManager userManager;

  @Context
  protected CoreSession session;

  @Param(name = "groupname")
  protected String groupName;

  @Param(name = "grouplabel", required = false)
  protected String groupLabel;

  @Param(name = "description", required = false)
  protected String groupDescription;

  @Param(name = "members", required = false)
  protected StringList members;

  @Param(name = "membersAction", required = false, values = {UPDATE, APPEND, REMOVE})
  protected String membersAction = UPDATE;

  @Param(name = "subGroups", required = false)
  protected StringList subGroups;

  @Param(name = "subGroupsAction", required = false, values = {UPDATE, APPEND, REMOVE})
  protected String subGroupsAction = UPDATE;

  @Param(name = "parentGroups", required = false)
  protected StringList parentGroups;

  @Param(name = "parentGroupsAction", required = false, values = {UPDATE, APPEND, REMOVE})
  protected String parentGroupsAction = UPDATE;

  @Param(name = "properties", required = false)
  protected Properties properties = new Properties();

  @OperationMethod
  public String run() throws OperationException {
    DocumentModel groupDoc = userManager.getGroupModel(groupName.toLowerCase());

    if (groupDoc == null) {
      throw new OperationException("Cannot update non-existent group: " + groupName);
    }

    if (terminateOnInvalidCredentials_GroupUpdate(session, groupName)) {
      return "You do not have permission to change " + groupDoc.getName(); // invalid credentials
    }

    if (members != null) {
      updateFVProperty(membersAction, groupDoc, members, GROUP_SCHEMA, MEMBERS);
    }

    if (subGroups != null) {
      StringList alwaysLowerCase = new StringList();
      for (String gn : subGroups) {
        alwaysLowerCase.add(gn.toLowerCase());
      }

      updateFVProperty(subGroupsAction, groupDoc, alwaysLowerCase, GROUP_SCHEMA, SUB_GROUPS);
    }

    if (parentGroups != null) {
      StringList alwaysLowerCase = new StringList();
      for (String gn : parentGroups) {
        alwaysLowerCase.add(gn.toLowerCase());
      }
      updateFVProperty(parentGroupsAction, groupDoc, alwaysLowerCase, GROUP_SCHEMA, PARENT_GROUPS);
    }

    for (Entry<String, String> entry : Arrays.asList(new SimpleEntry<>(GROUP_LABEL, groupLabel),
        new SimpleEntry<>(GROUP_DESCRIPTION, groupDescription))) {
      String key = entry.getKey();
      String value = entry.getValue();
      if (StringUtils.isNotBlank(value)) {
        properties.put(key, value);
      }
    }
    for (Entry<String, String> entry : properties.entrySet()) {
      String key = entry.getKey();
      String value = entry.getValue();
      if (key.startsWith(GROUP_COLON)) {
        key = key.substring(GROUP_COLON.length());
      }
      groupDoc.setProperty(GROUP_SCHEMA, key, value);
    }

    userManager.updateGroup(groupDoc);
    groupDoc = userManager.getGroupModel(groupName.toLowerCase());

    return "Updated " + groupDoc.getName();
  }
}
