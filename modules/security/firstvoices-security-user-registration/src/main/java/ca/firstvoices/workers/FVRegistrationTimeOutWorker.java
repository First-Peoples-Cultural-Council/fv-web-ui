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

import static ca.firstvoices.utils.FVRegistrationConstants.MID_REGISTRATION_PERIOD_ACT;
import static ca.firstvoices.utils.FVRegistrationConstants.MID_REGISTRATION_PERIOD_IN_DAYS;
import static ca.firstvoices.utils.FVRegistrationConstants.REGISTRATION_DELETION_ACT;
import static ca.firstvoices.utils.FVRegistrationConstants.REGISTRATION_DELETION_IN_DAYS;

import ca.firstvoices.utils.FVRegistrationUtilities;
import java.util.Calendar;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventProducer;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
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
        DocumentModelList registrations = session.query(
            "SELECT * FROM FVUserRegistration WHERE ecm:currentLifeCycleState = 'approved'");

        for (DocumentModel registration : registrations) {
          Calendar regCreated = (Calendar) registration.getPropertyValue("dc:created");

          if (regCreated == null) {
            // Seems like some registrations can come in with dc:created = null, so set
            // current time to those
            Calendar date = Calendar.getInstance();
            registration.setPropertyValue("dc:created", date);
            session.saveDocument(registration);
          } else {
            switch (checkRegistrationTimeOut(regCreated)) {
              case REGISTRATION_DELETION_ACT:
                // Remove registration
                session.removeDocument(registration.getRef());
                break;

              case MID_REGISTRATION_PERIOD_ACT:
                // Remind user to register
                EventProducer eventProducer = Framework.getService(EventProducer.class);
                DocumentEventContext ctx = new DocumentEventContext(session,
                    null,
                    registration);
                Event event = ctx.newEvent("registrationExpiring");
                eventProducer.fireEvent(event);
                break;
              default:
                break;
            }
          }
        }
      });

  }

}
