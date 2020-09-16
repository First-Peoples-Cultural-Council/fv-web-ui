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

package ca.firstvoices.characters.operations;

import ca.firstvoices.characters.Constants;
import ca.firstvoices.characters.workers.CleanConfusablesWorker;
import ca.firstvoices.maintenance.common.AbstractMaintenanceOperation;
import ca.firstvoices.maintenance.common.RequiredJobsUtils;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.work.api.WorkManager;

@Operation(id = CleanConfusables.ID, category = Constants.GROUP_NAME, label =
    Constants.CLEAN_CONFUSABLES_ACTION_ID, description =
    "Operation to queue/work on `clean confusables` on dictionary items")
public class CleanConfusables extends AbstractMaintenanceOperation {

  public static final String ID = Constants.CLEAN_CONFUSABLES_ACTION_ID;

  @Context
  protected CoreSession session;

  @Context
  protected WorkManager workManager;

  @Param(name = "phase", values = {"init", "work"})
  protected String phase = "init";

  @Param(name = "batchSize")
  protected int batchSize = 1000;

  @OperationMethod
  public void run(DocumentModel dialect) throws OperationException {

    limitToSuperAdmin(session);
    limitToDialect(dialect);

    // We should only clean if AddConfusables is not in the queue
    if (!RequiredJobsUtils.hasRequiredJobs(dialect, Constants.ADD_CONFUSABLES_JOB_ID)) {
      executePhases(dialect, phase);
    }
  }

  @Override
  protected void executeInitPhase(DocumentModel dialect) {
    RequiredJobsUtils.addToRequiredJobs(dialect, Constants.CLEAN_CONFUSABLES_JOB_ID);
  }

  @Override
  protected void executeWorkPhase(DocumentModel dialect) {
    // Initiate worker to perform operation
    CleanConfusablesWorker worker = new CleanConfusablesWorker(dialect.getRef(),
        Constants.CLEAN_CONFUSABLES_JOB_ID, batchSize);
    workManager.schedule(worker, true);
  }
}
