package ca.firstvoices.dialect.categories.operations;

import ca.firstvoices.dialect.categories.Constants;
import ca.firstvoices.dialect.categories.services.MigrateCategoriesService;
import ca.firstvoices.operations.MaintenanceOperation;
import ca.firstvoices.services.MaintenanceLogger;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.api.Framework;

@Operation(id = MigrateCategories.ID, category = Constants.GROUP_NAME, label = Constants.MIGRATE_CATEGORIES_ACTION_ID,
    description = "Operation to begin the migration of a dialect from Shared Categories to Local Categories")
public class MigrateCategories extends MaintenanceOperation {

  public static final String ID = Constants.MIGRATE_CATEGORIES_ACTION_ID;

  MigrateCategoriesService migrateCategoriesService = Framework.getService(
      MigrateCategoriesService.class);

  MaintenanceLogger maintenanceLogger = Framework.getService(MaintenanceLogger.class);

  @Context
  protected CoreSession session;

  @Param(name = "phase")
  protected int phase = 0;

  @Param(name = "batchSize")
  protected int batchSize = 1;

  public MigrateCategories() {
    super();
  }

  @OperationMethod
  public void run(DocumentModel dialect) throws OperationException {

    // This is the first phase that triggers the work.
    // Migrates the category tree from Shared Categories to Local
    // If successful and category tree migrated, it adds required job to complete phase 2.
    if (phase == 1) {

      boolean success = migrateCategoriesService.migrateCategoriesTree(session, dialect);

      if (success) {
        maintenanceLogger.addToRequiredJobs(dialect, Constants.MIGRATE_CATEGORIES_JOB_ID);
      } else {
        throw new OperationException("Task to migrate categories was unsuccessful. Job not queued.");
      }
    } else if (phase == 2) {
      migrateCategoriesService.migrateWords(session, dialect, batchSize);
    }

  }
}
