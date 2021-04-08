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
import ca.firstvoices.characters.workers.AddConfusablesWorker;
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
import org.nuxeo.runtime.api.Framework;

@Operation(id = AddConfusables.ID, category = Constants.GROUP_NAME, label =
    Constants.ADD_CONFUSABLES_ACTION_ID, description =
    "Operation to queue/work on adding confusables to an alphabet.")
public class AddConfusables extends AbstractMaintenanceOperation {

  public static final String ID = Constants.ADD_CONFUSABLES_ACTION_ID;

  /**
   * Init phase will add the operation`ID`
   */
  @Param(name = "phase", values = {"init", "work", "addFromDialects"})
  protected String phase = "init";

  @Context
  protected CoreSession session;

  @OperationMethod
  public void run(DocumentModel dialect) throws OperationException {
    limitToSuperAdmin(session);
    limitToDialect(dialect);

    if ("addFromDialects".equals(phase)) {
      executeWorkPhaseFromAllDialect(dialect);
    } else {
      executePhases(dialect, phase);
    }
  }

  @Override
  protected void executeInitPhase(DocumentModel dialect) {
    RequiredJobsUtils.addToRequiredJobs(dialect, Constants.ADD_CONFUSABLES_JOB_ID);
  }

  /**
   * Will add and clean confusables for the specified dialect
   */
  @Override
  protected void executeWorkPhase(DocumentModel dialect) {
    WorkManager workManager = Framework.getService(WorkManager.class);

    // Add confusables to the alphabet
    // Note: AddConfusablesWorker will trigger `init` job to clean confusables
    AddConfusablesWorker worker = new AddConfusablesWorker(dialect.getRef(),
        Constants.ADD_CONFUSABLES_JOB_ID, false);
    workManager.schedule(worker);
  }

  /**
   * Will add confusables from all other dialects
   */
  protected void executeWorkPhaseFromAllDialect(DocumentModel dialect) {
    WorkManager workManager = Framework.getService(WorkManager.class);

    // Add confusables to the alphabet from other dialects
    AddConfusablesWorker worker = new AddConfusablesWorker(dialect.getRef(),
        Constants.ADD_CONFUSABLES_JOB_ID, true);
    workManager.schedule(worker);
  }
}
