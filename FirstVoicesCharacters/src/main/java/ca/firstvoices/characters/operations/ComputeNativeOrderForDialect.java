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

package ca.firstvoices.characters.nativeorder.operations;

import static ca.firstvoices.characters.Constants.COMPUTE_ORDER_JOB_ID;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_DIALECT;

import ca.firstvoices.characters.nativeorder.workers.ComputeNativeOrderDialectWorker;
import ca.firstvoices.characters.services.CustomOrderComputeService;
import ca.firstvoices.characters.utils.MaintenanceUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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
import org.nuxeo.ecm.webengine.model.exceptions.WebSecurityException;
import org.nuxeo.runtime.api.Framework;

/*
 *
 */
@Operation(id = ComputeNativeOrderForDialect.ID, category = Constants.CAT_DOCUMENT, label =
    "Compute Native Order for Dialect", description =
    "Computes the native sort order for all " + "words/phrases within a dialect.")
public class ComputeNativeOrderForDialect {

  public static final String ID = "Document.ComputeNativeOrderForDialect";

  private static final Log log = LogFactory.getLog(ComputeNativeOrderForDialect.class);

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

  /**
   * Maintenance tasks should just be available to system admins. This is done via a filter in
   * fv-maintenance contrib, but here for extra caution This should become a service as part of
   * First Voices Security
   */
  protected void limitToSuperAdmin(CoreSession session) throws WebSecurityException {
    if (!session.getPrincipal().isAdministrator()) {
      throw new WebSecurityException(
          "Privilege to execute maintenance operations is not granted to " + session.getPrincipal()
              .getName());
    }
  }

  /**
   * Will limit the operation to a dialect type
   *
   * @param dialect
   */
  protected void limitToDialect(DocumentModel dialect) throws OperationException {
    if (!dialect.getType().equals(FV_DIALECT)) {
      throw new OperationException("Document type must be FVDialect");
    }
  }

  /**
   * Main method to execute phases based on input `executeInitPhase` and `executeWorkPhase` must be
   * defined in child class Override to add more phases or modify logic
   *
   * @param doc   the input document
   * @param phase the phase to execute
   * @throws OperationException
   */
  protected void executePhases(DocumentModel doc, String phase) throws OperationException {
    switch (String.valueOf(phase)) {
      case "init":
        executeInitPhase(doc);
        break;

      case "work":
        executeWorkPhase(doc);
        break;

      default:
        throw new OperationException("A phase was not specified for this operation");
    }
  }


  @OperationMethod
  public void run(DocumentModel dialect) throws OperationException {
    limitToSuperAdmin(session);
    limitToDialect(dialect);
    executePhases(dialect, phase);
  }

  protected void executeInitPhase(DocumentModel dialect) {
    MaintenanceUtils.addToRequiredJobs(dialect, COMPUTE_ORDER_JOB_ID);
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
