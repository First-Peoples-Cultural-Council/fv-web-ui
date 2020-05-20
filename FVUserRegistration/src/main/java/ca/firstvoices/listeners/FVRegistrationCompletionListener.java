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
import static ca.firstvoices.utils.FVRegistrationConstants.SYSTEM_APPROVED_GROUP_CHANGE;
import static ca.firstvoices.utils.FVRegistrationConstants.USER_NAME_ARG;

import ca.firstvoices.services.FVMoveUserToDialectServiceImpl;
import ca.firstvoices.utils.FVRegistrationUtilities;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;

/**
 *
 */
public class FVRegistrationCompletionListener implements EventListener {

  private static final Log log = LogFactory
      .getLog(ca.firstvoices.listeners.FVRegistrationCompletionListener.class);

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
          util.placeNewUserInGroup(dialect, (String) docCtx.getProperty(GROUP_NAME_ARG),
              (String) docCtx.getProperty(USER_NAME_ARG));
        } catch (Exception e) {
          log.error(e);
        }
        break;

      // this is in case of users joining Published dialects ie. Public
      case SYSTEM_APPROVED_GROUP_CHANGE:
        dialect = docCtx.getSourceDocument();

        try {
          util.systemPlaceNewUserInGroup(dialect, (String) docCtx.getProperty(GROUP_NAME_ARG),
              (String) docCtx.getProperty(USER_NAME_ARG), dialect.getCoreSession());
        } catch (Exception e) {
          log.error(e);
        }
        break;

      case "documentRemoved":
        // TODO: use it to make sure user name is not left in the system when registration is
        //  deleted on timeout
        break;

      // This will be executed after a user has created a password.
      case INVITATION_VALIDATED:
        args = docCtx.getArguments();

        for (Object o : args) {
          if (o == null) {
            break;
          }

          DocumentModel ureg = (DocumentModel) o;
          String argument = ureg.getType();

          if (argument.equals("FVUserRegistration")) {
            regUtil.registrationValidationHandler(ureg.getRef(), ureg.getCoreSession());
          }
        }
        break;
      default:
        break;
    }
  }
}
