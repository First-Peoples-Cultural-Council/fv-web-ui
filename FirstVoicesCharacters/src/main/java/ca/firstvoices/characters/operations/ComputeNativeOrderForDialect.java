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

import static ca.firstvoices.characters.Constants.COMPUTE_ORDER_JOB_ID;

import ca.firstvoices.characters.nativeorder.workers.ComputeNativeOrderDialectWorker;
import ca.firstvoices.characters.services.CustomOrderComputeService;
import ca.firstvoices.maintenance.common.AbstractMaintenanceOperation;
import ca.firstvoices.maintenance.common.RequiredJobsUtils;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;

/*
 *
 */
@Operation(id = ComputeNativeOrderForDialect.ID, category = Constants.CAT_DOCUMENT, label =
    "Compute Native Order for Dialect", description =
    "Computes the native sort order for all " + "words/phrases within a dialect.")
public class ComputeNativeOrderForDialect extends AbstractMaintenanceOperation {

  public static final String ID = "Document.ComputeNativeOrderForDialect";

  protected CustomOrderComputeService service = Framework
      .getService(CustomOrderComputeService.class);

  protected AutomationService automation = Framework.getService(AutomationService.class);

  @Context
  protected CoreSession session;

  @Context
  protected OperationContext ctx;

  /**
   * Init phase will add the operation`ID`
   */
  @Param(name = "phase", values = {"init", "work"})
  protected String phase = "init";

  @OperationMethod
  public void run(DocumentModel dialect) throws OperationException {
    limitToSuperAdmin(session);
    limitToDialect(dialect);
    executePhases(dialect, phase);
  }

  protected void executeInitPhase(DocumentModel dialect) {
    RequiredJobsUtils.addToRequiredJobs(dialect, COMPUTE_ORDER_JOB_ID);
  }

  /**
   * Will add and clean confusables for the specified dialect
   *
   * @param dialect
   */
  protected void executeWorkPhase(DocumentModel dialect) {
    WorkManager workManager = Framework.getService(WorkManager.class);
    ComputeNativeOrderDialectWorker worker = new ComputeNativeOrderDialectWorker(
        dialect.getRef());
    workManager.schedule(worker);
  }
}
