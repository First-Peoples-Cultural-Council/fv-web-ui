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
 *     Kristof Subryan <vtr_monk@mac.com>
 */
package ca.firstvoices.operations;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.user.invite.UserInvitationService.ValidationMethod;
import org.nuxeo.ecm.user.registration.DocumentRegistrationInfo;
import org.nuxeo.ecm.user.registration.UserRegistrationService;

import ca.firstvoices.utils.FVRegistrationUtilities;

/**
 * Operation to invite a User.
 */
@Operation(id = UserInvite.ID, category = Constants.CAT_USERS_GROUPS, label = "Invite a user", description = "Stores a registration request and returns its ID.")
public class UserInvite {

    public static final String ID = "User.Invite";

    private static final Log log = LogFactory.getLog(UserInvite.class);

    @Context
    protected UserManager userManager;

    @Context
    protected UserRegistrationService registrationService;

    @Context
    protected CoreSession session;

    @Context
    protected AutomationService autoService;

    @Context
    protected OperationContext ctx;

    @Param(name = "docInfo", required = false)
    protected DocumentRegistrationInfo docInfo = null;

    @Param(name = "validationMethod", required = false)
    protected ValidationMethod validationMethod = ValidationMethod.EMAIL;

    @Param(name = "autoAccept", required = false)
    protected boolean autoAccept = false;

    @Param(name = "info", required = false)
    protected Map<String, Serializable> info = new HashMap<>();

    @Param(name = "comment", required = false)
    protected String comment;

    @OperationMethod
    public String run(DocumentModel registrationRequest) throws Exception {
        FVRegistrationUtilities utilCommon = new FVRegistrationUtilities();
        /*
         * This operation has for most part similar code to sister operation FVQuickUserRegistration. The main
         * difference is in conditions we apply for both. Common code is split into 2 parts - registrationCommonSetup -
         * registrationCommonFinish Each of the operations executes it own, context specific conditions and any other
         * operations following if appropriate. In this case email to the user is sent by Nuxeo and since administrator
         * initiated invitation we do not send an email.
         */
        utilCommon.registrationCommonSetup(registrationRequest, session, userManager);

        autoAccept = utilCommon.UserInviteCondition(registrationRequest, session);

        String registrationId = utilCommon.registrationCommonFinish(registrationService, registrationRequest, info,
                comment, validationMethod, autoAccept, session);

        return registrationId;
    }
}
