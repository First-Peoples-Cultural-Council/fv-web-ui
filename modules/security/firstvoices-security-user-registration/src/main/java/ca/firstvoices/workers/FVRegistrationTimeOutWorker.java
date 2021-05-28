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

package ca.firstvoices.workers;

import static ca.firstvoices.operations.FVGetPendingUserRegistrations.APPROVED;
import static ca.firstvoices.utils.FVRegistrationConstants.MID_REGISTRATION_PERIOD_ACT;
import static ca.firstvoices.utils.FVRegistrationConstants.MID_REGISTRATION_PERIOD_IN_DAYS;
import static ca.firstvoices.utils.FVRegistrationConstants.REGISTRATION_DELETION_ACT;
import static ca.firstvoices.utils.FVRegistrationConstants.REGISTRATION_DELETION_IN_DAYS;
import static ca.firstvoices.utils.FVRegistrationConstants.REGISTRATION_EXPIRATION_ACT;
import static ca.firstvoices.utils.FVRegistrationConstants.REGISTRATION_EXPIRATION_IN_DAYS;
import ca.firstvoices.utils.FVRegistrationMailUtilities;
import ca.firstvoices.utils.FVRegistrationUtilities;
import java.util.Calendar;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;

/**
 *
 */
public class FVRegistrationTimeOutWorker extends AbstractWork {

  public static final String CATEGORY_CHECK_REGISTRATION_TIMEOUT = "checkEditLocks";
  /**
   *
   */
  private static final long serialVersionUID = 1L;
  private static final Log log = LogFactory.getLog(FVRegistrationTimeOutWorker.class);

  public FVRegistrationTimeOutWorker() {
    super("check-registration-timeout");
  }

  @Override
  public String getCategory() {
    return CATEGORY_CHECK_REGISTRATION_TIMEOUT;
  }

  @Override
  public String getTitle() {
    return "Check user registration timeout.";
  }

  private int checkRegistrationTimeOut(Calendar dateRegistered) {
    long diffDays = FVRegistrationUtilities.calculateRegistrationAgeInDays(dateRegistered);
    long modHours = FVRegistrationUtilities.calculateRegistrationModHours(dateRegistered);

    int actionValue = 0;

    // currently set to check at 2am, 10am, 6pm
    if (diffDays == REGISTRATION_DELETION_IN_DAYS && modHours < 8) {
      actionValue = REGISTRATION_DELETION_ACT;
    } else if (diffDays == REGISTRATION_EXPIRATION_IN_DAYS && modHours < 8) {
      actionValue = REGISTRATION_EXPIRATION_ACT;
    } else if (diffDays == MID_REGISTRATION_PERIOD_IN_DAYS && modHours < 8) {
      actionValue = MID_REGISTRATION_PERIOD_ACT;
    }

    return actionValue;
  }

  @Override
  public void work() {

    CoreInstance.doPrivileged(Framework
        .getService(RepositoryManager.class)
        .getDefaultRepositoryName(),
        session -> {
        FVRegistrationMailUtilities mailUtil = new FVRegistrationMailUtilities();

        DocumentModelList registrations = session.query(
            "SELECT * FROM FVUserRegistration WHERE ecm:currentLifeCycleState = '"
                + APPROVED + "'");

        for (DocumentModel userRegistrations : registrations) {
          Calendar regCreated = (Calendar) userRegistrations.getPropertyValue("dc:created");

          if (regCreated == null) {
            // Seems like some registrations can come in with dc:created = null, so set
            // current time to those
            Calendar date = Calendar.getInstance();
            userRegistrations.setPropertyValue("dc:created", date);
            session.saveDocument(userRegistrations);
          } else {
            int regTOType = checkRegistrationTimeOut(regCreated);

            // regTOType
            //
            // 0 - no action required (either already dealt with or still within no-action
            // period)
            //
            // MID_REGISTRATION_PERIOD_ACT - registration is closing on timeout
            // an email needs to be sent to a user who started registration
            // and email informing LanguageAdministrator that user registration will be
            // deleted in ? days
            //
            // REGISTRATION_EXPIRATION_ACT - registration timed out and it will be deleted
            // in 24 hrs - last chance
            // to activate account
            // send an email to originator of registration request with information about
            // cancellation
            //
            // REGISTRATION_DELETION_ACT - registration should be deleted
            //

            switch (regTOType) {
              // TODO: Add to Audit log => log.info( "Registration period expired for user" +
              // userRegistrations.getPropertyValue("userinfo:firstName") + " "
              // + userRegistrations.getPropertyValue
              // ("userinfo:lastName") + ".
              // Registration was deleted.");
              case REGISTRATION_DELETION_ACT:
                session.removeDocument(userRegistrations.getRef());
                break;

              case MID_REGISTRATION_PERIOD_ACT:
              case REGISTRATION_EXPIRATION_ACT:
                try {
                  mailUtil.emailReminder(regTOType, userRegistrations, session);
                } catch (Exception e) {
                  log.error("Can not send reminder email", e);
                }
                break;
              default:
                break;
            }
          }
        }
      });

  }

}
