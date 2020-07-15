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

package ca.firstvoices.maintenance.dialect.categories.operations;

import static ca.firstvoices.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.schemas.DomainTypesConstants.FV_DIALECT;

import ca.firstvoices.maintenance.dialect.categories.Constants;
import ca.firstvoices.maintenance.dialect.categories.services.MigrateCategoriesService;
import ca.firstvoices.maintenance.dialect.categories.workers.MigrateCategoriesWorker;
import ca.firstvoices.maintenance.services.MaintenanceLogger;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.ecm.webengine.model.exceptions.WebSecurityException;
import org.nuxeo.runtime.api.Framework;

@Operation(id = MigrateCategories.ID, category = Constants.GROUP_NAME, label =
    Constants.MIGRATE_CATEGORIES_ACTION_ID, description =
    "Operation to start migration of " + "dialect to Local Categories")
public class MigrateCategories {

  public static final String ID = Constants.MIGRATE_CATEGORIES_ACTION_ID;
  @Context
  protected CoreSession session;
  @Context
  protected WorkManager workManager;
  @Param(name = "phase", values = {"init", "work"})
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

    // This is the first phase that triggers the work.
    // Migrates the category tree from Shared Categories to Local
    // If successful and category tree migrated, it adds required job to complete phase 2.
    if (phase.equals("init")) {

      boolean success = migrateCategoriesService.migrateCategoriesTree(session, dialect);

      if (success) {
        // After tree has been created, publish all categories
        if (dialect.getCurrentLifeCycleState().equals(PUBLISHED_STATE)) {
          migrateCategoriesService.publishCategoriesTree(session, dialect);
        }

        // Add job to update references
        maintenanceLogger.addToRequiredJobs(dialect, Constants.MIGRATE_CATEGORIES_JOB_ID);

      } else {
        throw new OperationException(
            "Migrate categories tree not completed and job not queued. Tree is possibly already "
                + "migrated.");
      }

    } else if (phase.equals("work")) {
      // Call worker
      MigrateCategoriesWorker worker = new MigrateCategoriesWorker(dialect.getRef(),
          Constants.MIGRATE_CATEGORIES_JOB_ID, batchSize);
      workManager.schedule(worker, true);

      // Alternatively, we can call the service directly (not async)
      //migrateCategoriesService.migrateWords(session, dialect, 1000);
    } else if (phase.equals("syncwork")) {
      int wordsRemaining = migrateCategoriesService.migrateWords(session, dialect, batchSize);
      while (wordsRemaining != 0) {
        int nextWordsRemaining = migrateCategoriesService.migrateWords(session, dialect, batchSize);

        // No progress, worker is stuck
        if (nextWordsRemaining == wordsRemaining) {
          throw new NuxeoException(
              "Progress is stuck synchronously migrating words on " + dialect.getTitle());
        }

        wordsRemaining = nextWordsRemaining;

      }
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
