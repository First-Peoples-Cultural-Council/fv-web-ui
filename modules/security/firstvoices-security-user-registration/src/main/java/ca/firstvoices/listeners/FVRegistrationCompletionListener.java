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

package ca.firstvoices.listeners;

import static ca.firstvoices.utils.FVRegistrationConstants.GROUP_NAME_ARG;
import static ca.firstvoices.utils.FVRegistrationConstants.INVITATION_VALIDATED;
import static ca.firstvoices.utils.FVRegistrationConstants.LADMIN_APPROVED_GROUP_CHANGE;
import static ca.firstvoices.utils.FVRegistrationConstants.MEMBERS;
import static ca.firstvoices.utils.FVRegistrationConstants.SYSTEM_APPROVED_GROUP_CHANGE;
import static ca.firstvoices.utils.FVRegistrationConstants.USER_NAME_ARG;

import ca.firstvoices.services.FVMoveUserToDialectServiceImpl;
import ca.firstvoices.utils.FVRegistrationUtilities;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;

/**
 *
 */
public class FVRegistrationCompletionListener implements EventListener {

  private static final Log log =
      LogFactory.getLog(ca.firstvoices.listeners.FVRegistrationCompletionListener.class);

  // accepts documentRemoved && registrationValidated

  @Override
  public void handleEvent(Event event) {
    EventContext ctx;
    ctx = event.getContext();
    if (!(ctx instanceof DocumentEventContext)) {
      return;
    }

    DocumentEventContext docCtx = (DocumentEventContext) ctx;

    FVRegistrationUtilities regUtil = new FVRegistrationUtilities();
    FVMoveUserToDialectServiceImpl util = new FVMoveUserToDialectServiceImpl();
    Object[] args;
    DocumentModel dialect;

    switch (event.getName()) {
      // TODO: this event is not triggered yet
      // TODO: should be triggered when administrator approves a member to join Private
      //  (Enabled) dialect.
      case LADMIN_APPROVED_GROUP_CHANGE: // <event>newUserApprovedByLanguageAdministrator</event>
        dialect = docCtx.getSourceDocument();

        try {
          util.placeNewUserInGroup(dialect,
              (String) docCtx.getProperty(GROUP_NAME_ARG),
              (String) docCtx.getProperty(USER_NAME_ARG));
        } catch (Exception e) {
          log.error(e);
        }
        break;

      // this is in case of users joining Published dialects ie. Public
      case SYSTEM_APPROVED_GROUP_CHANGE:
        dialect = docCtx.getSourceDocument();

        try {
          util.systemPlaceNewUserInGroup(dialect,
              (String) docCtx.getProperty(GROUP_NAME_ARG),
              (String) docCtx.getProperty(USER_NAME_ARG),
              dialect.getCoreSession());
        } catch (Exception e) {
          log.error(e);
        }
        break;

      case "documentRemoved":
        // TODO: use it to make sure user name is not left in the system when registration is
        //  deleted on timeout
        break;

      // Event is fired after a user creates a password.
      case INVITATION_VALIDATED:
        args = docCtx.getArguments();

        for (Object o : args) {
          if (o == null) {
            break;
          }

          DocumentModel registrationDoc = (DocumentModel) o;

          if ("FVUserRegistration".equals(registrationDoc.getType())) {
            completeUserRegistration(registrationDoc);
          }
        }
        break;
      default:
        break;
    }
  }

  private void completeUserRegistration(DocumentModel registrationDoc) {
    UserManager userManager = Framework.getService(UserManager.class);

    CoreInstance.doPrivileged(registrationDoc.getCoreSession(), session -> {
      String username = (String) registrationDoc.getPropertyValue("userinfo:login");
      NuxeoPrincipal principal = userManager.getPrincipal(username);
      DocumentModel userDoc = userManager.getUserModel(username);

      try {
        // Set creation time
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date(System.currentTimeMillis()));

        // Update user properties
        userDoc.setPropertyValue("user:traditionalName",
            registrationDoc.getPropertyValue("fvuserinfo:traditionalName"));
        userDoc.setPropertyValue("user:ua",
            registrationDoc.getPropertyValue("fvuserinfo:ua"));
        userDoc.setPropertyValue("user:ip",
            registrationDoc.getPropertyValue("fvuserinfo:ip"));
        userDoc.setPropertyValue("user:referer",
            registrationDoc.getPropertyValue("fvuserinfo:referer"));
        userDoc.setPropertyValue("user:created", calendar);

        // Update user doc properties
        principal.setModel(userDoc);
        // Add to default members group
        principal.setGroups(Collections.singletonList(MEMBERS));

        // Update user
        userManager.updateUser(principal.getModel());

      } catch (Exception e) {
        log.error("Exception while updating user and completing registration " + e);
        throw new NuxeoException(e);
      }
    });
  }
}
