package ca.firstvoices.dialect.categories.operations;

import ca.firstvoices.dialect.categories.Constants;
import ca.firstvoices.dialect.categories.services.MigrateCategoriesService;
import ca.firstvoices.dialect.categories.workers.MigrateCategoriesWorker;
import ca.firstvoices.services.MaintenanceLogger;
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

@Operation(id = MigrateCategories.ID, category = Constants.GROUP_NAME,
    label = Constants.MIGRATE_CATEGORIES_ACTION_ID,
    description = "Operation to start migration of dialect to Local Categories")
public class MigrateCategories {

  public static final String ID = Constants.MIGRATE_CATEGORIES_ACTION_ID;

  MigrateCategoriesService migrateCategoriesService = Framework.getService(
      MigrateCategoriesService.class);

  MaintenanceLogger maintenanceLogger = Framework.getService(MaintenanceLogger.class);

  @Context
  protected CoreSession session;

  @Context
  protected WorkManager workManager;

  @Param(name = "phase", required = true, values = { "init", "work" })
  protected String phase = "init";

  @Param(name = "batchSize")
  protected int batchSize = 1000;

  @OperationMethod
  public void run(DocumentModel dialect) throws OperationException {

    protectOperation();

    // This is the first phase that triggers the work.
    // Migrates the category tree from Shared Categories to Local
    // If successful and category tree migrated, it adds required job to complete phase 2.
    if (phase.equals("init")) {

      boolean success = migrateCategoriesService.migrateCategoriesTree(session, dialect);

      if (success) {
        maintenanceLogger.addToRequiredJobs(dialect, Constants.MIGRATE_CATEGORIES_JOB_ID);
      } else {
        throw new OperationException(
            "Task to migrate categories was unsuccessful. Job not queued.");
      }

    } else if (phase.equals("work")) {
      // Call worker
      MigrateCategoriesWorker worker = new MigrateCategoriesWorker(
          dialect.getRef(), Constants.MIGRATE_CATEGORIES_JOB_ID, batchSize);
      workManager.schedule(worker, true);

      // Alternatively, we can call the service directly (not async)
      //migrateCategoriesService.migrateWords(session, dialect, 1000);
    }
  }

  /**
   * Maintenance tasks should just be available to system admins.
   * This is done via a filter in fv-maintenance contrib, but here for extra caution
   * This should become a service as part of First Voices Security
   */
  private void protectOperation() {
    if (!session.getPrincipal().isAdministrator()) {
      throw new WebSecurityException(
          "Privilege to execute maintenance operations is not granted to " + session.getPrincipal()
              .getName());
    }
  }
}
