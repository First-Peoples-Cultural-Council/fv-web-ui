/*
 * (C) Copyright 2016 Nuxeo SA (http://nuxeo.com/) and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Contributors:
 *     Nelson Silva <nsilva@nuxeo.com>
 */
package ca.firstvoices.operations;

import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.UnrestrictedSessionRunner;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.user.registration.UserRegistrationService;

import ca.firstvoices.utils.CustomSecurityConstants;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

//TODO Do we need it?

/**
 * Operation to accept a user invitation.
 */
@Operation(id = UserInviteApprove.ID, category = Constants.CAT_USERS_GROUPS, label = "Approve user invite",
        description = "Approves a request to join the system.")
public class UserInviteApprove {

    public static final String ID = "User.ApproveInvite";

    @Context
    protected UserManager userManager;

    @Context
    protected UserRegistrationService registrationService;

    @Param(name = "registrationId" )
    protected String registrationId;

    @Param(name = "group", required = false)
    protected String group = "members";

    @Param(name = "comment", required = false)
    protected String comment;

    @Param(name = "appurl", required = false)
    protected String appurl = null;

    @Context
    protected CoreSession session;

    @OperationMethod
    public void run() {

        Map<String, Serializable> additionalInfo = new HashMap<String, Serializable>();
        DocumentModel registrationDoc = session.getDocument(new IdRef(registrationId));

        // Add approved groups to registration document
        ArrayList<String> approved_groups = new ArrayList<String>();
        approved_groups.add(group);
        registrationDoc.setPropertyValue("userinfo:groups", approved_groups);

        // Add current user to contributors
        String[] contributors = (String []) registrationDoc.getProperty("dublincore", "contributors");
        NuxeoPrincipal currentUser = (NuxeoPrincipal) session.getPrincipal();

        String[] newContributors = Arrays.copyOf(contributors, contributors.length + 1);
        newContributors[newContributors.length - 1] = currentUser.getName();

        registrationDoc.setPropertyValue("dc:contributors", newContributors);
        registrationDoc.setPropertyValue("dc:lastContributor", currentUser.getName());

        registrationDoc.setPropertyValue("registration:comment", comment);

        // Save document before accepting
        session.saveDocument(registrationDoc);

        // Set additional information for email
        additionalInfo.put("enterPasswordUrl", appurl + registrationService.getConfiguration(UserRegistrationService.CONFIGURATION_NAME).getEnterPasswordUrl());

        // Determine the document url to add it into the email
        String dialectId = (String) registrationDoc.getPropertyValue("docinfo:documentId");
        DocumentModel dialect = session.getDocument(new IdRef(dialectId));

        additionalInfo.put("docUrl", appurl + "explore" + dialect.getPathAsString());

        // Accept registration
        registrationService.acceptRegistrationRequest(registrationId, additionalInfo);
    }

    protected static class UnrestrictedSourceDocumentResolver extends UnrestrictedSessionRunner {

        private final String docid;

        public DocumentModel dialect;

        protected UnrestrictedSourceDocumentResolver(CoreSession session, String docId) {
            super(session);
            docid = docId;
        }

        @Override
        public void run() {
            // Get requested space (dialect)
            dialect = session.getDocument(new IdRef(docid));

            if (dialect.isProxy()) {
                dialect = session.getSourceDocument(dialect.getRef());

                if (dialect.isVersion()) {
                    dialect = session.getSourceDocument(dialect.getRef());
                }
            }
        }

    }

    protected static class UnrestrictedGroupResolver extends UnrestrictedSessionRunner {

        private DocumentModel dialect;

        public ArrayList<String> member_groups = new ArrayList<String>();
        public String language_admin_group;

        protected UnrestrictedGroupResolver(CoreSession session, DocumentModel dialect) {
            super(session);
            this.dialect = dialect;
        }

        @Override
        public void run() {

            // Add user to relevant group
            for (ACE ace : dialect.getACP().getACL(ACL.LOCAL_ACL).getACEs()){

                String username = ace.getUsername();

                if (SecurityConstants.READ.equals(ace.getPermission())) {
                    if (username.contains("_members") && ace.isGranted()) {
                        member_groups.add(username);
                        break;
                    }
                }

                if (SecurityConstants.EVERYTHING.equals(ace.getPermission()) && ace.isGranted()) {
                    if (username.contains(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP)) {
                        language_admin_group = username;
                        break;
                    }
                }
            }
        }

    }

    protected static class UnrestrictedRequestPermissionResolver extends UnrestrictedSessionRunner {

        private String registrationDocId;
        private String language_admin_group;

        protected UnrestrictedRequestPermissionResolver(CoreSession session, String registrationDocId, String language_admin_group) {
            super(session);
            this.registrationDocId = registrationDocId;
            this.language_admin_group = language_admin_group;
        }

        @Override
        public void run() {
            DocumentModel registrationDoc = session.getDocument(new IdRef(registrationDocId));

            ACE registrationACE = new ACE(language_admin_group, "Everything");

            ACP registrationDocACP = registrationDoc.getACP();
            registrationDocACP.addACE("local", registrationACE);
            registrationDoc.setACP(registrationDocACP, false);
        }

    }
}
