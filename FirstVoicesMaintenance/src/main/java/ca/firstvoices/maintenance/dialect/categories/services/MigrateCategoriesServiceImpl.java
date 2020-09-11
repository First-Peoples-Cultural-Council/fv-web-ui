package ca.firstvoices.maintenance.dialect.categories.services;

import static ca.firstvoices.data.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CATEGORY;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.services.UnpublishedChangesService;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.IterableQueryResult;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.runtime.api.Framework;

public class MigrateCategoriesServiceImpl implements MigrateCategoriesService {

  private static final Log log = LogFactory.getLog(MigrateCategoriesServiceImpl.class);

  DocumentModelList localCategories = null;

  DocumentModel localCategoriesDirectory = null;

  /**
   * This method will migrate a category tree from Shared Categories to Local Categories. It does
   * not update references. It will also publish the categories if the dialect is published.
   *
   * @param session
   * @param dialect
   * @return true if categories were copied, false otherwise
   */
  @Override
  public boolean migrateCategoriesTree(CoreSession session, DocumentModel dialect) {

    int copiedCategories = 0;

    DocumentModel dictionary = session.getChild(dialect.getRef(), "Dictionary");
    localCategoriesDirectory = session.getChild(dialect.getRef(), "Categories");

    // Get the local categories that already exist
    localCategories = getCategories(session, dialect, false);

    // Get the unique categories from all the words in this dialect
    for (String categoryId : getUniqueCategories(session, dictionary.getId())) {
      IdRef categoryRef = new IdRef(categoryId);
      boolean categoryDeleted = !session.exists(categoryRef);

      if (categoryDeleted || categoryExists(session.getDocument(categoryRef))) {
        if (categoryDeleted) {
          // If the category is permanently deleted, error to log. Do not migrate.
          log.error("Referenced category " + categoryId + " does not exist in dialect " + dialect
              .getTitle());
        }

        continue;
      }

      DocumentModel category = session.getDocument(categoryRef);

      copyCategory(session, category);
      ++copiedCategories;
    }

    return copiedCategories > 0;
  }


  @Override
  public int migrateWords(CoreSession session, DocumentModel dialect, int batchSize) {

    if (session == null) {
      throw new NuxeoException(
          "Migrate words could not run on " + dialect.getTitle() + " as " + "session is null.");
    }

    FirstVoicesPublisherService publisherService = Framework
        .getService(FirstVoicesPublisherService.class);
    UnpublishedChangesService unpublishedChangesService = Framework
        .getService(UnpublishedChangesService.class);

    // Get the local categories that already exist
    localCategories = getCategories(session, dialect, false);

    // Get the shared categories
    DocumentModelList sharedCategories = getCategories(session, null, true);

    if (sharedCategories != null && !sharedCategories.isEmpty()) {
      String ids = "'" + sharedCategories.stream().map(DocumentModel::getId)
          .collect(Collectors.joining("','")) + "'";

      DocumentModel dictionary = session.getChild(dialect.getRef(), "Dictionary");

      // This would benefit greatly from an ES query using ElasticSearchService
      // Get all words that reference shared categories
      String query = "SELECT * FROM FVWord" + " WHERE ecm:parentId = '" + dictionary.getId() + "' "
          + " AND fv-word:categories/* IN ( " + ids + ")" + " AND ecm:isTrashed = 0"
          + " AND ecm:isProxy = 0" + " AND ecm:isVersion = 0";
      DocumentModelList words = session.query(query, null, batchSize, 0, true);

      for (DocumentModel word : words) {

        // Get unpublished changes
        // Remember to do this here, BEFORE we modify the document
        boolean unpublishedChangesExist = unpublishedChangesService
            .checkUnpublishedChanges(session, word);

        // Update category Ids
        List<String> categoryIds = Arrays
            .asList((String[]) word.getPropertyValue("fv-word:categories"));
        categoryIds = categoryIds.stream().map(id -> getLocalCategory(session, id))
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
        word.setProperty("fv-word", "categories", categoryIds);

        // Save document
        session.saveDocument(word);

        // If word is published and no unpublished changes exist - republish
        if (word.getCurrentLifeCycleState().equals(PUBLISHED_STATE)) {
          // Check for unpublished changes
          if (!unpublishedChangesExist) {
            publisherService.queueRepublish(word);
          } else {
            log.info(word.getPathAsString() + "has unpublished changes yet the category has been "
                + "migrated. Republish manually.");
          }
        }
      }

      // Return total words found
      return (int) words.totalSize();
    }

    return 0;
  }

  @Override
  public void publishCategoriesTree(CoreSession session, DocumentModel dialect) {

    AutomationService automationService = Framework.getService(AutomationService.class);

    DocumentModel localCategoriesDir = getLocalCategoriesDirectory(session, dialect);

    try {
      OperationContext operation = new OperationContext(session);
      operation.setInput(localCategoriesDir);
      automationService.run(operation, "FVPublish");

    } catch (OperationException e) {
      e.printStackTrace();
    }

  }

  private DocumentModel getExistingCategory(DocumentModel category) {
    return localCategories.stream()
        .filter(localCategory -> localCategory.getTitle().equals(category.getTitle())).findFirst()
        .orElse(null);
  }

  // This is a search based on title
  private boolean categoryExists(DocumentModel categoryToCopy) {
    return getExistingCategory(categoryToCopy) != null;
  }

  private DocumentModel copyCategory(CoreSession session, DocumentModel category) {
    String localCategoryDirPath = localCategoriesDirectory.getPathAsString();

    DocumentModel parent = session.getParentDocument(category.getRef());
    boolean isParent = parent != null && parent.getTitle().equals("Shared Categories");

    if (!isParent) {

      // For child categories, create parent if it does not exist
      DocumentModel parentCategory = session.getParentDocument(category.getRef());
      DocumentModel newLocalParent;

      // Check if parent category exists
      if (!categoryExists(parentCategory)) {
        newLocalParent = copyCategory(session, parentCategory);
      } else {
        newLocalParent = getExistingCategory(parentCategory);
      }

      if (newLocalParent != null) {
        localCategoryDirPath = newLocalParent.getPathAsString();
      } else {
        throw new NuxeoException("newLocalParent is null in Migrate Categories service/worker");
      }
    }

    // Create new category
    // Replace `.trashed` in name if the shared category is trashed
    String newCategoryName = category.getName().replace(".trashed", "");

    DocumentModel newLocalCategory = session
        .createDocumentModel(localCategoryDirPath, newCategoryName, FV_CATEGORY);
    newLocalCategory.setPropertyValue("dc:title", category.getTitle());
    DocumentModel newCategory = session.createDocument(newLocalCategory);

    // Add to local cache
    localCategories.add(newCategory);

    return newCategory;
  }

  private ArrayList<String> getUniqueCategories(CoreSession session, String dictionaryId) {

    ArrayList<String> categoryIds = new ArrayList<>();

    IterableQueryResult results = session
        .queryAndFetch(getUniqueCategoriesQuery(dictionaryId), "NXQL", true, (Object[]) null);
    Iterator<Map<String, Serializable>> it = results.iterator();

    while (it.hasNext()) {
      Map<String, Serializable> item = it.next();
      String uid = (String) item.get("fv-word:categories/*");
      categoryIds.add(uid);
    }

    results.close();

    return categoryIds;
  }

  private String getLocalCategory(CoreSession session, String sharedCategoryId) {
    IdRef sharedCategoryIdRef = new IdRef(sharedCategoryId);

    if (!session.exists(sharedCategoryIdRef)) {
      // If the category is permanently deleted, skip reference
      return null;
    }

    DocumentModel sharedCategory = session.getDocument(new IdRef(sharedCategoryId));
    return localCategories.stream()
        .filter(localCategory -> localCategory.getTitle().equals(sharedCategory.getTitle()))
        .findFirst().orElse(sharedCategory).getId();
  }

  public DocumentModelList getCategories(CoreSession session, DocumentModel dialect,
      boolean includeProxies) {

    DocumentModelList categories = null;
    DocumentModel categoriesDirectory;

    if (dialect == null) {
      // Get shared categories directory
      categoriesDirectory = getSharedCategoriesDirectory(session);
    } else {
      // Get local categories directory
      categoriesDirectory = getLocalCategoriesDirectory(session, dialect);
    }

    String query =
        "SELECT * FROM FVCategory" + " WHERE ecm:ancestorId = '" + categoriesDirectory.getId() + "'"
            + " AND ecm:isTrashed = 0" + " AND ecm:isProxy = 0" + " AND ecm:isVersion = 0";

    if (dialect == null && includeProxies) {
      // Override query to get both 'workspace' and 'sections' categories
      // Needed due to FW-1445 - issue with some words referencing sections categories
      query = "SELECT * FROM FVCategory"
          + " WHERE (ecm:path STARTSWITH '/FV/Workspaces/SharedData/Shared Categories'"
          + " OR ecm:path STARTSWITH '/FV/sections/SharedData/Shared Categories') "
          + " AND ecm:isTrashed = 0" + " AND ecm:isVersion = 0";
    }

    try {
      categories = session.query(query, null, 1000, 0, true);
    } catch (NuxeoException e) {
      e.printStackTrace();
    }

    return categories;
  }

  public String getUniqueCategoriesQuery(String dictionaryId) {
    return "SELECT DISTINCT fv-word:categories/* FROM FVWord "
        + "WHERE fv-word:categories/* IS NOT NULL " + "AND ecm:parentId = '" + dictionaryId + "' "
        + "AND ecm:isTrashed = 0 " + "AND ecm:isProxy = 0 " + "AND ecm:isVersion = 0";
  }

  private DocumentModel getSharedCategoriesDirectory(CoreSession session) {
    return session.getDocument(new PathRef("/FV/Workspaces/SharedData/Shared Categories"));
  }

  private DocumentModel getLocalCategoriesDirectory(CoreSession session, DocumentModel dialect) {
    return session.getChild(dialect.getRef(), "Categories");
  }

}
