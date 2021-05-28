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

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.user.registration.UserRegistrationService;

//TODO Do we need it?

/**
 * Operation to accept a user invitation.
 */
@Operation(id = UserInviteApprove.ID,
    category = Constants.CAT_USERS_GROUPS,
    label = "Approve " + "user invite",
    description = "Approves a request to join the system.")
public class UserInviteApprove {

  public static final String ID = "User.ApproveInvite";

  @Context protected UserManager userManager;

  @Context protected UserRegistrationService registrationService;

  @Param(name = "registrationId") protected String registrationId;

  @Param(name = "group", required = false) protected String group = "members";

  @Param(name = "comment", required = false) protected String comment;

  @Param(name = "appurl", required = false) protected String appurl = null;

  @Context protected CoreSession session;

  @OperationMethod
  public void run() {
    DocumentModel registrationDoc = session.getDocument(new IdRef(registrationId));

    // Add approved groups to registration document
    ArrayList<String> approvedGroups = new ArrayList<String>();
    approvedGroups.add(group);
    registrationDoc.setPropertyValue("userinfo:groups", approvedGroups);

    // Add current user to contributors
    String[] contributors = (String[]) registrationDoc.getProperty("dublincore", "contributors");
    NuxeoPrincipal currentUser = session.getPrincipal();

    String[] newContributors = Arrays.copyOf(contributors, contributors.length + 1);
    newContributors[newContributors.length - 1] = currentUser.getName();

    registrationDoc.setPropertyValue("dc:contributors", newContributors);
    registrationDoc.setPropertyValue("dc:lastContributor", currentUser.getName());

    registrationDoc.setPropertyValue("registration:comment", comment);

    // Save document before accepting
    session.saveDocument(registrationDoc);

    // Set additional information for email
    Map<String, Serializable> additionalInfo = new HashMap<String, Serializable>();

    additionalInfo.put(
        "enterPasswordUrl",
        appurl + registrationService
            .getConfiguration(UserRegistrationService.CONFIGURATION_NAME)
            .getEnterPasswordUrl());

    // Determine the document url to add it into the email
    String dialectId = (String) registrationDoc.getPropertyValue("docinfo:documentId");
    DocumentModel dialect = session.getDocument(new IdRef(dialectId));

    additionalInfo.put("docUrl", appurl + "explore" + dialect.getPathAsString());

    // Accept registration
    registrationService.acceptRegistrationRequest(registrationId, additionalInfo);
  }

}
