package ca.firstvoices.maintenance.dialect.categories.operations;

import ca.firstvoices.maintenance.dialect.categories.Constants;
import ca.firstvoices.maintenance.dialect.categories.services.MigrateCategoriesService;
import ca.firstvoices.maintenance.services.MaintenanceLogger;
import java.io.Serializable;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import org.json.JSONException;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.IterableQueryResult;
import org.nuxeo.ecm.core.api.impl.blob.StringBlob;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.ecm.webengine.model.exceptions.WebSecurityException;
import org.nuxeo.runtime.api.Framework;

@Operation(id = MigrateCategoriesStatus.ID, category = Constants.GROUP_NAME,
    label = Constants.MIGRATE_CATEGORIES_STATUS_ACTION_ID,
    description = "Operation to show the status of the migration for categories")
public class MigrateCategoriesStatus {

  public static final String ID = Constants.MIGRATE_CATEGORIES_STATUS_ACTION_ID;
  @Context
  protected CoreSession session;
  @Context
  protected WorkManager workManager;
  MigrateCategoriesService migrateCategoriesService = Framework.getService(
      MigrateCategoriesService.class);
  MaintenanceLogger maintenanceLogger = Framework.getService(MaintenanceLogger.class);

  @OperationMethod
  public Blob run(DocumentModel dialect) throws OperationException {

    protectOperation();

    if (!dialect.getType().equals("FVDialect")) {
      throw new OperationException("Document type must be FVDialect");
    }

    // Count total shared and local categories that are used by words
    int sharedCategoriesCount = 0;
    int localCategoriesCount = 0;

    IterableQueryResult results = session.queryAndFetch(
        migrateCategoriesService.getUniqueCategoriesQuery(dialect.getId()), "NXQL", true, null);
    Iterator<Map<String, Serializable>> it = results.iterator();

    while (it.hasNext()) {
      Map<String, Serializable> item = it.next();
      String uid = (String) item.get("fv-word:categories/*");
      DocumentModel category = session.getDocument(new IdRef(uid));

      if (category.getPathAsString().contains("Shared Categories")) {
        ++sharedCategoriesCount;
      } else {
        ++localCategoriesCount;
      }
    }

    results.close();

    // Check if required job exists
    boolean requiredJobExists = false;

    Set<String> requiredJobs = maintenanceLogger.getRequiredJobs(dialect);

    if (requiredJobs.contains(Constants.MIGRATE_CATEGORIES_JOB_ID)) {
      requiredJobExists = true;
    }

    // Check and see how many local categories were created
    DocumentModelList localCategories = migrateCategoriesService.getCategories(session, dialect);
    long localCategoriesCreated = localCategories.totalSize();

    // Check and see how many shared categories exist
    DocumentModelList sharedCategories = migrateCategoriesService.getCategories(session, null);
    long sharedCategoriesCreated = sharedCategories.totalSize();

    JSONObject json = new JSONObject();

    try {
      json.put("words_referencing_shared_categories", new Integer(sharedCategoriesCount));
      json.put("words_referencing_local_categories", new Integer(localCategoriesCount));
      json.put("required_category_migration_job_exists", Boolean.valueOf(requiredJobExists));
      json.put("local_categories_created", new Double(localCategoriesCreated));
      json.put("shared_categories_total", new Double(sharedCategoriesCreated));
    } catch (JSONException e) {
      e.printStackTrace();
    }

    return new StringBlob(json.toString(), "application/json");
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
