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

import java.util.ArrayList;
import java.util.Map;
import org.apache.commons.lang3.text.WordUtils;
import org.apache.commons.logging.Log;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;

public abstract class AbstractFirstVoicesDialectOperation {

  private static Log log;
  protected UserManager userManager = Framework.getService(UserManager.class);

  protected String generateGroupNameFromDialect(String dialectName, String groupName) {
    return dialectName.replace(" ", "_").toLowerCase() + "_" + groupName;
  }

  protected String generateGroupLabelFromDialect(String dialectName, String groupName) {
    return dialectName + " " + WordUtils.capitalize(groupName.replace("_", " "));

  }

  protected abstract ArrayList<String> addParentsToGroup(ArrayList<String> currentParents,
      DocumentModel groupDocModel, Map.Entry<String, String> currentGroup, DocumentModel input);

  /**
   * This method will create the relevant groups in the system when a new dialect is created. It
   * assigns the correct hierarchy to that group.
   *
   * @param input FVDialect being processed
   * @param group Map of groups and relevant permission for that group
   */
  protected void processGroup(DocumentModel input, Map.Entry<String, String> group) {

    String dialectName = input.getName();
    ACP docACP = input.getACP();

    String groupName = generateGroupNameFromDialect(dialectName, group.getKey());
    String groupLabel = generateGroupLabelFromDialect(dialectName, group.getKey());

    if (userManager.getGroup(groupName) == null) {

      DocumentModel groupDocModel = userManager.getBareGroupModel();
      ArrayList<String> parentGroups = new ArrayList<String>();

      parentGroups.add(group.getKey());

      // Create parent group if it does not exist
      if (userManager.getGroup(group.getKey()) == null) {
        DocumentModel parentGroupDocModel = userManager.getBareGroupModel();
        ArrayList<String> parentParentGroups = new ArrayList<String>();
        parentParentGroups.add(userManager.getGroupMembersField());

        parentGroupDocModel
            .setProperty(userManager.getGroupSchemaName(), userManager.getGroupIdField(),
                group.getKey());
        parentGroupDocModel
            .setProperty(userManager.getGroupSchemaName(), userManager.getGroupLabelField(),
                WordUtils.capitalize(group.getKey().replace("_", " ")));
        parentGroupDocModel
            .setProperty(userManager.getGroupSchemaName(), userManager.getGroupParentGroupsField(),
                parentParentGroups);

        // Create parent group
        userManager.createGroup(parentGroupDocModel);
      }

      try {
        // Add additional parent Groups
        parentGroups = addParentsToGroup(parentGroups, groupDocModel, group, input);

        groupDocModel.setProperty(userManager.getGroupSchemaName(), userManager.getGroupIdField(),
            groupName);
        groupDocModel
            .setProperty(userManager.getGroupSchemaName(), userManager.getGroupLabelField(),
                groupLabel);
        groupDocModel
            .setProperty(userManager.getGroupSchemaName(), userManager.getGroupParentGroupsField(),
                parentGroups);

        // Create group
        userManager.createGroup(groupDocModel);
      } catch (Exception e) {
        log.warn("Could not create group automatically.", e);
      }
    }

    // Add permission to document
    ACE recordACE = new ACE(groupName, group.getValue(), true);
    docACP.addACE(ACL.LOCAL_ACL, recordACE);
    input.setACP(docACP, true);
  }

}
