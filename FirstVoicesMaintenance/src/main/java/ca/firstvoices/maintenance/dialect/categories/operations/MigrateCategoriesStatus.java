package ca.firstvoices.maintenance.dialect.categories.operations;

import static ca.firstvoices.schemas.DomainTypesConstants.FV_DIALECT;

import ca.firstvoices.maintenance.dialect.categories.Constants;
import ca.firstvoices.maintenance.dialect.categories.services.MigrateCategoriesService;
import ca.firstvoices.maintenance.services.MaintenanceLogger;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.services.UnpublishedChangesService;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import org.json.JSONException;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
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
  @Param(name = "publishAction", required = false, values = {"force", "ignore"})
  protected String publishAction = "ignore";
  DocumentModel dictionary = null;
  MigrateCategoriesService migrateCategoriesService = Framework.getService(
      MigrateCategoriesService.class);

  MaintenanceLogger maintenanceLogger = Framework.getService(MaintenanceLogger.class);

  UnpublishedChangesService unpublishedChangesService = Framework
      .getService(UnpublishedChangesService.class);

  FirstVoicesPublisherService publisherService = Framework
      .getService(FirstVoicesPublisherService.class);

  AutomationService automationService = Framework
      .getService(AutomationService.class);

  @OperationMethod
  public Blob run(DocumentModel dialect) throws OperationException {

    protectOperation();

    if (!dialect.getType().equals(FV_DIALECT)) {
      throw new OperationException("Document type must be FVDialect");
    }

    // Count total shared and local categories that are used by words
    int sharedCategoriesCount = 0;
    int localCategoriesCount = 0;
    int trashedCategoriesCount = 0;
    int deletedCategoriesCount = 0;

    IterableQueryResult results = null;

    try {
      dictionary = session.getChild(dialect.getRef(), "Dictionary");

      results = session.queryAndFetch(
          migrateCategoriesService.getUniqueCategoriesQuery(dictionary.getId()), "NXQL", true,
          (Object[]) null);
      Iterator<Map<String, Serializable>> it = results.iterator();

      while (it.hasNext()) {
        Map<String, Serializable> item = it.next();
        String uid = (String) item.get("fv-word:categories/*");
        IdRef categoryId = new IdRef(uid);

        if (!session.exists(categoryId)) {
          ++deletedCategoriesCount;
          continue;
        }

        DocumentModel category = session.getDocument(new IdRef(uid));

        if (category.getPathAsString().contains("Shared Categories")) {
          ++sharedCategoriesCount;
        } else {
          ++localCategoriesCount;
        }

        if (category.isTrashed()) {
          ++trashedCategoriesCount;
        }
      }
    } catch (Exception e) {
      throw new OperationException(e.getMessage());
    } finally {
      if (results != null) {
        results.close();
      }
    }

    // Check if required job exists
    boolean requiredJobExists = false;

    Set<String> requiredJobs = maintenanceLogger.getRequiredJobs(dialect);

    if (requiredJobs.contains(Constants.MIGRATE_CATEGORIES_JOB_ID)) {
      requiredJobExists = true;
    }

    // Check and see how many local categories were created
    DocumentModelList localCategories = migrateCategoriesService
        .getCategories(session, dialect, false);
    long localCategoriesCreated = localCategories.totalSize();

    // Check and see how many shared categories exist
    DocumentModelList sharedCategories = migrateCategoriesService
        .getCategories(session, null, false);
    long sharedCategoriesCreated = sharedCategories.totalSize();

    // Do a survey of Shared Categories
    // Do a survey of all shared categories referenced by proxies (i.e. unpublished changes).

    HashMap<String, String> sharedCategoriesInProxies = new HashMap<>();
    HashMap<String, String> wordsFailedPublishing = new HashMap<>();
    HashMap<String, String> wordsFailedPublishingDueToDeleted = new HashMap<>();

    for (DocumentModel sharedCategory : sharedCategories) {

      String sharedCategoryTitle = sharedCategory.getTitle();

      DocumentModel sharedCategoryProxy = publisherService
          .getPublication(session, sharedCategory.getRef());

      if (sharedCategoryProxy != null) {
        String query = "SELECT * FROM FVWord WHERE "
            + "ecm:parentId = '" + dictionary.getId() + "' "
            + "AND ecm:isTrashed = 0 "
            + "AND ecm:isVersion = 0 "
            + "AND ecm:isProxy = 1 "
            + "AND fvproxy:proxied_categories/* IN ('" + sharedCategoryProxy.getId() + "')";

        DocumentModelList sections = session.query(query, null, 1000, 0, true);

        if (publishAction.equals("force")) {

          for (DocumentModel publishedVersion : sections) {

            // Get Workspace document
            OperationContext operation = new OperationContext(session);
            operation.setInput(publishedVersion);

            DocumentModel workingCopy = (DocumentModel) automationService
                .run(operation, "Proxy.GetSourceDocument");

            // Perform actions on words that failed to publish

            // Note: this can happen due to possible existing bug with delete not unpublishing
            if (workingCopy.isTrashed()) {
              // Remove proxy
              session.removeDocument(publishedVersion.getRef());

              // Document under words that failed to publish due to their working copy being trashed
              wordsFailedPublishingDueToDeleted.put(workingCopy.getId(), sharedCategoryTitle);
            } else {
              // Try to republish
              publisherService.republish(workingCopy);

              // Document under words that failed to publish for other reasons
              wordsFailedPublishing.put(workingCopy.getId(), sharedCategoryTitle);
            }
          }
        }

        sharedCategoriesInProxies
            .put(sharedCategoryTitle + " - " + sharedCategoryProxy.getId(),
                String.valueOf((double) sections.totalSize()));
      }
    }

    JSONObject json = new JSONObject();

    try {
      json.put("total_referenced_shared_categories", String.valueOf(sharedCategoriesCount));
      json.put("total_shared_categories", String.valueOf(sharedCategoriesCreated));
      json.put("total_referenced_local_categories", String.valueOf(localCategoriesCount));
      json.put("total_referenced_trashed_categories", String.valueOf(trashedCategoriesCount));
      json.put("total_referenced_deleted_categories", String.valueOf(deletedCategoriesCount));
      json.put("required_category_migration_job_exists", Boolean.valueOf(requiredJobExists));
      json.put("local_categories_created", String.valueOf(localCategoriesCreated));
      json.put("shared_categories_in_proxies", sharedCategoriesInProxies);
      json.put("words_failed_publishing_general", wordsFailedPublishing);
      json.put("words_failed_publishing_deleted", wordsFailedPublishingDueToDeleted);
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
