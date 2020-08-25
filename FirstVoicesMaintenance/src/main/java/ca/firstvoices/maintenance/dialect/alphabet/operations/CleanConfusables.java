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

package ca.firstvoices.maintenance.dialect.alphabet.operations;

import static ca.firstvoices.schemas.DomainTypesConstants.FV_DIALECT;

import ca.firstvoices.maintenance.dialect.alphabet.Constants;
import ca.firstvoices.maintenance.dialect.alphabet.workers.CleanConfusablesWorker;
import ca.firstvoices.maintenance.dialect.categories.services.MigrateCategoriesService;
import ca.firstvoices.maintenance.services.MaintenanceLogger;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.ecm.webengine.model.exceptions.WebSecurityException;
import org.nuxeo.runtime.api.Framework;

@Operation(id = CleanConfusables.ID, category = Constants.GROUP_NAME, label =
    Constants.CLEAN_CONFUSABLES_ACTION_ID, description =
    "Operation to clean confusables on dictionary items")
public class CleanConfusables {

  public static final String ID = Constants.CLEAN_CONFUSABLES_ACTION_ID;
  @Context
  protected CoreSession session;
  @Context
  protected WorkManager workManager;
  @Param(name = "phase", values = {"init", "work", "syncwork"})
  protected String phase = "init";
  @Param(name = "batchSize")
  protected int batchSize = 1000;
  MigrateCategoriesService migrateCategoriesService = Framework
      .getService(MigrateCategoriesService.class);
  MaintenanceLogger maintenanceLogger = Framework.getService(MaintenanceLogger.class);

  @OperationMethod
  public void run(DocumentModel dialect) throws OperationException {

    protectOperation();

    if (!dialect.getType().equals(FV_DIALECT)) {
      throw new OperationException("Document type must be FVDialect");
    }

    // Get all confusables from alphabet as a string
    // Iterate over confusables and find all words or phrases in archive that contain that character
    // Correct character
    // When done, clean required job.

    // This is the first phase that triggers the work.
    if (phase.equals("init")) {
      // Add job to update references
      maintenanceLogger.addToRequiredJobs(dialect, Constants.CLEAN_CONFUSABLES_JOB_ID);
    } else if (phase.equals("work")) {

      // Only if alphabet DOES NOT require updating for this specific dialect....

      // Initiate worker to perform operation
      CleanConfusablesWorker worker = new CleanConfusablesWorker(dialect.getRef(),
          Constants.CLEAN_CONFUSABLES_JOB_ID, batchSize);
      workManager.schedule(worker, true);
    }
  }

  /**
   * Maintenance tasks should just be available to system admins. This is done via a filter in
   * fv-maintenance contrib, but here for extra caution This should become a service as part of
   * First Voices Security
   */
  private void protectOperation() {
    if (!session.getPrincipal().isAdministrator()) {
      throw new WebSecurityException(
          "Privilege to execute maintenance operations is not granted to " + session.getPrincipal()
              .getName());
    }
  }
}
