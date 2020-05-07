package ca.firstvoices.dialect.categories.operations;

import ca.firstvoices.dialect.categories.Constants;
import ca.firstvoices.dialect.categories.services.MigrateToLocalCategoriesService;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.api.Framework;

@Operation(id = MigrateCategories.ID, category = Constants.GROUP_NAME, label = "Categories.Migrate",
    description = "")
public class MigrateCategories {

  public static final String ID = "Categories.Migrate";

  MigrateToLocalCategoriesService migrateToLocalCategoriesService = Framework.getService(MigrateToLocalCategoriesService.class);

  @Context
  protected OperationContext ctx;

  @OperationMethod
  public void run(DocumentModel dialect) {
    CoreSession session = ctx.getCoreSession();

    boolean success = migrateToLocalCategoriesService.migrateCategoriesTree(session, dialect);

    if (success) {
      // Category tree migrated; set flag to update words.
      Set<String> requiredJobs = new HashSet<>(Arrays.asList((String[]) dialect.getPropertyValue("fv-maintenance:required_jobs")));
      requiredJobs.add("migrate_categories");
      dialect.setProperty("fv-maintenance", "required_jobs", requiredJobs);

      // Update dialect
      session.saveDocument(dialect);
    }

    // This should be done in a worker!
    if (!migrateToLocalCategoriesService.migrateWords(session, dialect, 500)) {
      // remove flag from jobs
      Set<String> requiredJobs = new HashSet<>(Arrays.asList((String[]) dialect.getPropertyValue("fv-maintenance:required_jobs")));

      if (!requiredJobs.isEmpty()) {
        requiredJobs.remove("migrate_categories");
        dialect.setProperty("fv-maintenance", "required_jobs", requiredJobs);

        // Update dialect
        session.saveDocument(dialect);
      }

      // A good place to set feature as enabled?
    }
  }
}
