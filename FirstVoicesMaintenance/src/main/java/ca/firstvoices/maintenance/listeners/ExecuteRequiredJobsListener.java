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

import ca.firstvoices.maintenance.Constants;
import ca.firstvoices.maintenance.services.MaintenanceLogger;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.CoreService;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.runtime.api.Framework;

/**
 * Listener will be called by schedule (see fv-maintenace-contrib.xml) Will execute `work` phases
 * for up to 2 jobs for every dialect that has pending jobs
 */
public class ExecuteRequiredJobsListener implements EventListener {

  // Maximum amount of jobs to execute per dialect
  public static final int REQUIRED_JOB_LIMIT = 2;

  // Get logger
  private static final Logger log = Logger
      .getLogger(ExecuteRequiredJobsListener.class.getCanonicalName());

  @Override
  public void handleEvent(Event event) {
    CoreService coreService = Framework.getService(CoreService.class);
    if (coreService == null) {
      // CoreService failed to start, no need to go further
      return;
    }

    if (!event.getName().equals(Constants.EXECUTE_REQUIRED_JOBS_EVENT_ID)) {
      return;
    }

    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {
              // Get all dialects that need jobs to execute
              String query = "SELECT * FROM FVDialect WHERE "
                  + " fv-maintenance:required_jobs/* IS NOT NULL AND" + " ecm:isVersion = 0 AND "
                  + " ecm:isProxy = 0 AND " + " ecm:isTrashed = 0 " + " ORDER BY dc:modified ASC";

              DocumentModelList dialects = session.query(query);

              // Nothing to process
              if (dialects == null || dialects.isEmpty()) {
                return;
              }

              AutomationService automation = Framework.getService(AutomationService.class);
              MaintenanceLogger maintenanceLogger = Framework.getService(MaintenanceLogger.class);

              for (DocumentModel dialect : dialects) {

                Set<String> requiredJobs = maintenanceLogger.getRequiredJobs(dialect);
                if (requiredJobs != null && !requiredJobs.isEmpty()) {
                  try {
                    // Trigger Phase 2 (work) of related operation
                    OperationContext operation = new OperationContext(session);
                    operation.setInput(dialect);

                    Map<String, Object> params = new HashMap<>();
                    params.put("phase", "work");
                    params.put("batchSize", 1000);

                    int jobsExecuted = 0;

                    // Execute `work` phases for required jobs, up to maximum
                    while (requiredJobs.iterator().hasNext() && jobsExecuted < REQUIRED_JOB_LIMIT) {
                      String nextRequiredJob = requiredJobs.iterator().next();
                      automation.run(operation, nextRequiredJob, params);

                      ++jobsExecuted;
                    }

                    if (jobsExecuted == (REQUIRED_JOB_LIMIT - 1)) {
                      log.warning(
                          () -> "Reached required job limit for dialect " + dialect.getTitle());
                    }

                  } catch (OperationException e) {
                    event.markBubbleException();
                    log.severe(
                        () -> "Failed when trying to execute required jobs with message: " + e
                            .getMessage());
                  }
                }
              }

            });

  }
}

