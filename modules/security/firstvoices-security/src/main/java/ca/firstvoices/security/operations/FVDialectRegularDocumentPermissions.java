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

package ca.firstvoices.security.operations;

import ca.firstvoices.security.utils.CustomSecurityConstants;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.collectors.DocumentModelCollector;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentNotFoundException;
import org.nuxeo.ecm.core.api.security.SecurityConstants;

/**
 * This method will assign the correct permissions when a new dialect is created.
 */
@Operation(id = FVDialectRegularDocumentPermissions.ID, category = Constants.CAT_USERS_GROUPS,
    label = "FVDialectRegularDocumentPermissions", description = "")
public class FVDialectRegularDocumentPermissions extends AbstractFirstVoicesDialectOperation {

  public static final String ID = "FVDialectRegularDocumentPermissions";

  private static final Log log = LogFactory.getLog(FVDialectRegularDocumentPermissions.class);

  @OperationMethod(collector = DocumentModelCollector.class)
  public DocumentModel run(DocumentModel input) {

    // Don't process published document
    if (input.isProxy()) {
      return input;
    }

    HashMap<String, String> groupsToCreate = new HashMap<>();

    try {
      groupsToCreate
          .put(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP, SecurityConstants.EVERYTHING);
      groupsToCreate.put(CustomSecurityConstants.RECORDERS_GROUP, CustomSecurityConstants.RECORD);
      groupsToCreate
          .put(CustomSecurityConstants.RECORDERS_APPROVERS_GROUP, CustomSecurityConstants.APPROVE);
      groupsToCreate.put(userManager.getGroupMembersField(), SecurityConstants.READ);

      for (Map.Entry<String, String> group : groupsToCreate.entrySet()) {
        processGroup(input, group);
      }
    } catch (DocumentNotFoundException e) {
      log.warn("Could not find document.", e);
    } catch (Exception e) {
      log.warn("Could not create groups automatically.", e);
    }

    return input;
  }

  @Override
  protected ArrayList<String> addParentsToGroup(ArrayList<String> currentGroups,
      DocumentModel groupDocModel, Map.Entry<String, String> currentGroup, DocumentModel input) {

    // All groups have their 'members' group as parent (except for members)
    if (!userManager.getGroupMembersField().equals(currentGroup.getKey())) {
      String dialectMembersGroupName = generateGroupNameFromDialect(input.getName(),
          userManager.getGroupMembersField());
      currentGroups.add(dialectMembersGroupName);
    }

    // Recorders with Approval should have the Recorders group as a parent
    if (CustomSecurityConstants.RECORDERS_APPROVERS_GROUP.equals(currentGroup.getKey())) {
      String dialectRecordersGroupName = generateGroupNameFromDialect(input.getName(),
          CustomSecurityConstants.RECORDERS_GROUP);
      currentGroups.add(dialectRecordersGroupName);
    }

    return currentGroups;
  }

}
