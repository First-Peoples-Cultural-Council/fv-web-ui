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

import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE;

import ca.firstvoices.utils.CustomSecurityConstants;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.collectors.DocumentModelCollector;
import org.nuxeo.ecm.automation.core.util.DocumentHelper;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentNotFoundException;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.SecurityConstants;

/**
 *
 */
@Operation(id = FVDialectPublishedDocumentPermissions.ID, category = Constants.CAT_USERS_GROUPS,
    label = "FVDialectPublishedDocumentPermissions", description = "")
public class FVDialectPublishedDocumentPermissions extends AbstractFirstVoicesDialectOperation {

  public static final String ID = "FVDialectPublishedDocumentPermissions";
  private static final Log log = LogFactory.getLog(FVDialectPublishedDocumentPermissions.class);
  @Context
  protected CoreSession session;

  @OperationMethod(collector = DocumentModelCollector.class)
  public DocumentModel run(DocumentModel input) {

    // If not published document return
    if (!input.isProxy()) {
      return input;
    }

    HashMap<String, String> groupsToCreate = new HashMap<String, String>();

    try {
      groupsToCreate
          .put(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP, SecurityConstants.EVERYTHING);
      groupsToCreate.put(CustomSecurityConstants.RECORDERS_GROUP,
          CustomSecurityConstants.CAN_ASK_FOR_PUBLISH);
      groupsToCreate
          .put(CustomSecurityConstants.RECORDERS_APPROVERS_GROUP, CustomSecurityConstants.APPROVE);

      for (Map.Entry<String, String> group : groupsToCreate.entrySet()) {

        processGroup(input, group);

        // If published document, give Language Administrators access to parent to ask for
        // permission to publish
        if (CustomSecurityConstants.LANGUAGE_ADMINS_GROUP.equals(group.getKey())) {
          DocumentModel parentDoc = session.getParentDocument(input.getRef());

          if (parentDoc != null && FV_LANGUAGE.equals(parentDoc.getType())) {
            String groupName = generateGroupNameFromDialect(input.getName(), group.getKey());
            ACE parentRecordACE = new ACE(groupName, CustomSecurityConstants.CAN_ASK_FOR_PUBLISH,
                true);
            ACP parentDocACP = parentDoc.getACP();
            parentDocACP.addACE(ACL.LOCAL_ACL, parentRecordACE);
            parentDoc.setACP(parentDocACP, true);

            DocumentHelper.saveDocument(parentDoc.getCoreSession(), parentDoc);
          }
        }
      }

    } catch (DocumentNotFoundException e) {
      log.warn("Could not find document.", e);
    } catch (Exception e) {
      log.warn("Could not create groups automatically.", e);
    }

    return input;
  }

  @Override
  protected ArrayList<String> addParentsToGroup(ArrayList<String> currentParents,
      DocumentModel groupDocModel, Map.Entry<String, String> currentGroup, DocumentModel input) {
    return currentParents;
  }
}
