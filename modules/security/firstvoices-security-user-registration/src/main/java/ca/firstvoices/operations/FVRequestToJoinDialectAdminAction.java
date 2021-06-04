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

/*
 * Contributors:
 *     Kristof Subryan <vtr_monk@mac.com>
 */

package ca.firstvoices.operations;

import static ca.firstvoices.utils.FVSiteJoinRequestUtilities.SITE_JOIN_REQUEST_SCHEMA;

import ca.firstvoices.utils.CustomSecurityConstants;
import ca.firstvoices.utils.FVUserPreferencesUtilities;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.UnrestrictedSessionRunner;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventProducer;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;


@Operation(id = FVRequestToJoinDialectAdminAction.ID,
    category = Constants.CAT_USERS_GROUPS,
    label = "Request to join dialect administrative action (approve, ignore)",
    description = "Process approve/ignore requests on existing Request To Join documents")
public class FVRequestToJoinDialectAdminAction {

  public static final String ID = "LanguageAdmin.RequestToJoinDialectAction";

  private final List<String> validStartingStatuses = Arrays.asList("NEW", "IGNORE");
  private final List<String> validTargetStatuses = Arrays.asList("ACCEPT", "IGNORE");
  private final List<String> validGroups = Arrays.asList(CustomSecurityConstants.MEMBERS_GROUP,
      CustomSecurityConstants.LANGUAGE_ADMINS_GROUP, CustomSecurityConstants.RECORDERS_GROUP,
      CustomSecurityConstants.RECORDERS_WITH_APPROVAL_GROUP, "N/A");

  @Context protected CoreSession session;

  @Context protected UserManager userManager;

  @Context protected OperationContext operationContext;

  @Param(name = "requestId", required = true) protected String requestId;
  @Param(name = "messageToUser", required = false) protected String messageToUser;
  @Param(name = "newStatus", required = true) protected String newStatus;
  @Param(name = "group", required = false) protected String group;

  @OperationMethod
  public void run() {
    NuxeoPrincipal user = operationContext.getPrincipal();
    new JoinRequestAdminActionRunner(session,
        user,
        requestId,
        newStatus,
        messageToUser,
        group).runUnrestricted();
  }

  private class JoinRequestAdminActionRunner extends UnrestrictedSessionRunner {

    private final String requestId;
    private final String newStatus;
    private final String messageToUser;
    private final String group;
    private final NuxeoPrincipal callingUser;


    public JoinRequestAdminActionRunner(
        CoreSession session, final NuxeoPrincipal callingUser, final String requestId,
        final String newStatus, final String messageToUser, final String group) {
      super(session);
      this.callingUser = callingUser;
      this.requestId = requestId;
      this.newStatus = newStatus;
      this.messageToUser = messageToUser;
      this.group = group;
    }

    @Override
    public void run() {
      DocumentModel joinRequestDocument = session.getDocument(new IdRef(requestId));

      // check the join request for action actually exists
      if (joinRequestDocument == null || !joinRequestDocument
          .getType()
          .equals("FVSiteJoinRequest")) {
        throw new IllegalArgumentException();
      }

      //validate params
      if (validTargetStatuses.stream().noneMatch(s -> s.equals(newStatus))) {
        throw new IllegalArgumentException("Invalid requested status");
      }

      if (validStartingStatuses.stream().noneMatch(s -> s.equals(
          joinRequestDocument.getProperty(SITE_JOIN_REQUEST_SCHEMA,
          "status")))) {
        throw new IllegalArgumentException("Invalid starting status");
      }

      if (validGroups.stream().noneMatch(s -> s.equals(group))) {
        throw new IllegalArgumentException("Invalid group to be assigned to `" + group + "`");
      }

      //resolve target dialect
      String dialectId = joinRequestDocument
          .getProperty(SITE_JOIN_REQUEST_SCHEMA, "dialect")
          .toString();

      DocumentModel dialectDocument = session.getDocument(new IdRef(dialectId));
      if (dialectDocument == null) {
        throw new IllegalArgumentException("dialect not found");
      }


      String languageAdminGroupName = null;

      // resolve target group(s) and admin group (to be used for adding the user and also for
      // validating the access of the requestor
      List<String> targetGroups = new ArrayList<>();
      for (ACE ace : dialectDocument.getACP().getACL(ACL.LOCAL_ACL).getACEs()) {
        String acePrincipal = ace.getUsername();

        if (newStatus.equals("ACCEPT")
            && SecurityConstants.READ.equals(ace.getPermission())
            && acePrincipal.contains(group) && ace.isGranted()) {
          targetGroups.add(acePrincipal);
        }

        if (acePrincipal.contains(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP)
            && ace.isGranted()) {
          languageAdminGroupName = acePrincipal;
        }
      }

      if (languageAdminGroupName == null) {
        throw new IllegalArgumentException("Cannot resolve language admin group");
      }

      // verify permission
      if (!callingUser.isMemberOf(languageAdminGroupName)) {
        throw new IllegalArgumentException("Insufficient access");
      }


      if (newStatus.equals("ACCEPT")) {

        //resolve target user
        String email = joinRequestDocument.getProperty(SITE_JOIN_REQUEST_SCHEMA, "user").toString();
        Map<String, Serializable> userSearchCriteria = new HashMap<>();
        userSearchCriteria.put("email", email);
        DocumentModelList foundUsers = userManager.searchUsers(userSearchCriteria, null);
        if (foundUsers.size() != 1) {
          throw new IllegalArgumentException("ambiguous or nonexistent user");
        }

        DocumentModel user = foundUsers.get(0);
        final String username = (String) user.getProperty("user", "username");


        // update target groups
        for (String targetGroupName : targetGroups) {
          DocumentModel groupDocument = userManager.getGroupModel(targetGroupName);
          List<String> groupMembersList = (List<String>) groupDocument.getProperty("group",
              "members");
          groupMembersList.add(username);
          groupDocument.setProperty("group", "members", groupMembersList);
          userManager.updateGroup(groupDocument);
        }

        // update user preferences to ensure user is redirected to site
        String preferences =
            FVUserPreferencesUtilities.createDefaultFromSite(dialectId);
        user.setPropertyValue("preferences", preferences);
        userManager.updateUser(user);

        EventProducer eventProducer = Framework.getService(EventProducer.class);
        DocumentEventContext ctx = new DocumentEventContext(session,
            session.getPrincipal(),
            joinRequestDocument);
        Event event = ctx.newEvent("joinRequestAccepted");
        eventProducer.fireEvent(event);

      }

      // update request document
      joinRequestDocument.setProperty(SITE_JOIN_REQUEST_SCHEMA, "status", newStatus);
      joinRequestDocument.setProperty(SITE_JOIN_REQUEST_SCHEMA, "messageToUser", messageToUser);
      joinRequestDocument.setProperty(SITE_JOIN_REQUEST_SCHEMA, "group", group);
      session.saveDocument(joinRequestDocument);


    }
  }

}

