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

package ca.firstvoices.maintenance.listeners;

import ca.firstvoices.maintenance.common.CommonConstants;
import ca.firstvoices.maintenance.services.MaintenanceLogger;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Logger;
import org.nuxeo.ecm.core.CoreService;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.runtime.api.Framework;

/**
 * Listener to manage adding and removing required jobs from other events This is meant for packages
 * outside of fv-maintenance (or that cannot include it as a dependency)
 * `addToRequiredJobs`/`removeFromRequiredJobs` may also be called directly when package is
 * included
 */
public class ManageRequiredJobsListener implements EventListener {

  public static final String JOB_CONTAINER_PROP = "jobContainer";
  public static final String JOB_IDS_PROP = "jobIds";
  public static final String SUCCESS_PROP = "success";
  private static final Logger log =
      Logger.getLogger(ManageRequiredJobsListener.class.getCanonicalName());
  private final MaintenanceLogger ml = Framework.getService(MaintenanceLogger.class);

  @Override
  public void handleEvent(Event event) {
    CoreService coreService = Framework.getService(CoreService.class);
    if (coreService == null) {
      // CoreService failed to start, no need to go further
      return;
    }

    String eventId = event.getName();
    EventContext eventContext = event.getContext();

    if (!eventId.equals(CommonConstants.ADD_TO_REQUIRED_JOBS_EVENT_ID) && !eventId
        .equals(CommonConstants.REMOVE_FROM_REQUIRED_JOBS_EVENT_ID)) {
      return;
    }

    if (!eventContext.hasProperty(JOB_CONTAINER_PROP) || !eventContext.hasProperty(JOB_IDS_PROP)) {
      log.warning(() -> "event " + eventId + " in required job listener not given required props");
      return;
    }

    // container likely to be a dialect type, but can be used for other types
    DocumentModel container = (DocumentModel) eventContext.getProperty(JOB_CONTAINER_PROP);

    if (!(eventContext.getProperty(JOB_IDS_PROP) instanceof Set)) {
      log.severe(() -> "Illegal job format sent. Expected Set but got " + eventContext
          .getProperty(JOB_IDS_PROP).getClass());
      return;
    }

    @SuppressWarnings("unchecked")
    Set<String> jobs = (HashSet<String>) eventContext.getProperty(JOB_IDS_PROP);

    switch (eventId) {

      case CommonConstants.ADD_TO_REQUIRED_JOBS_EVENT_ID:
        for (String job : jobs) {
          ml.addToRequiredJobs(container, job);
        }
        break;

      case CommonConstants.REMOVE_FROM_REQUIRED_JOBS_EVENT_ID:

        boolean success = false;

        if (eventContext.hasProperty(SUCCESS_PROP)) {
          success = (boolean) eventContext.getProperty(SUCCESS_PROP);
        }

        for (String job : jobs) {
          ml.removeFromRequiredJobs(container, job, success);
        }

        break;

      default:
        log.warning(() -> "Tried to handle unknown event: " + eventId);
        break;
    }
  }
}

