package ca.firstvoices.maintenance.dialect.categories.services;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.services.UnpublishedChangesService;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
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

  private static final Log log = LogFactory.getLog(MigrateCategoriesService.class);

  DocumentModelList localCategories = null;
  DocumentModel localCategoriesDirectory = null;

  /**
   * This method will migrate a category tree from Shared Categories to Local Categories.
   * It does not update references. It will also publish the categories if the dialect is published.
   * @param session
   * @param dialect
   * @return true if categories were copied, false otherwise
   */
  @Override
  public boolean migrateCategoriesTree(CoreSession session, DocumentModel dialect) {

    FirstVoicesPublisherService publisherService = Framework.getService(FirstVoicesPublisherService.class);

    int copiedCategories = 0;

    localCategoriesDirectory = session.getChild(dialect.getRef(), "Categories");

    // Get the local categories that already exist
    localCategories = getCategories(session, dialect);

    // Get the unique categories from all the words in this dialect
    for (String categoryId : getUniqueCategories(session, dialect.getId())) {
      DocumentModel category = session.getDocument(new IdRef(categoryId));
      DocumentModel parentCategory = session.getParentDocument(category.getRef());

      // check if category exists. If so, skip.
      if (categoryExists(category)) {
        continue;
      }

      DocumentModel copiedCategory = copyCategory(session, category);
      ++copiedCategories;
    }

    return copiedCategories > 0;
  }


  @Override
  public int migrateWords(CoreSession session, DocumentModel dialect, int batchSize) {

    if (session == null) {
      log.error("Migrate words could not run on " + dialect.getTitle() + ".");
      return 0;
    }

    FirstVoicesPublisherService publisherService = Framework.getService(FirstVoicesPublisherService.class);
    UnpublishedChangesService unpublishedChangesService = Framework.getService(UnpublishedChangesService.class);

    // Get the local categories that already exist
    localCategories = getCategories(session, dialect);

    // Get the shared categories
    DocumentModelList sharedCategories = getCategories(session, null);

    if (sharedCategories.size() > 0) {
      String ids = "'" + sharedCategories.stream().map(DocumentModel::getId).collect(Collectors.joining("','")) + "'";

      // This would benefit greatly from an ES query using ElasticSearchService
      // Get all words that reference shared categories
      String query =  "SELECT * FROM FVWord"
          + " WHERE fva:dialect = '" + dialect.getId() + "' "
          + " AND fv-word:categories/* IN ( " + ids + ")"
          + " AND ecm:isTrashed = 0"
          + " AND ecm:isProxy = 0"
          + " AND ecm:isVersion = 0";
      DocumentModelList words = session.query(query, null, batchSize, 0, true);

      for (DocumentModel word : words) {

        // Get unpublished changes
        // Remember to do this here, BEFORE we modify the document
        boolean unpublishedChangesExist = unpublishedChangesService.checkUnpublishedChanges(session, word);

        // Update category Ids
        List<String> categoryIds = Arrays.asList((String[]) word.getPropertyValue("fv-word:categories"));
        categoryIds = categoryIds.stream().map(id -> getLocalCategory(session, id)).collect(Collectors.toList());
        word.setProperty("fv-word", "categories", categoryIds);

        // Save document
        session.saveDocument(word);

        // If word is published and no unpublished changes exist - republish
        if (word.getCurrentLifeCycleState().equals("Published")) {
          // Check for unpublished changes
          if (!unpublishedChangesExist) {
            publisherService.republish(word);
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
        .filter(localCategory -> localCategory.getTitle().equals(category.getTitle()))
        .findFirst()
        .orElse(null);
  }

  // This is a search based on title
  private boolean categoryExists(DocumentModel categoryToCopy) {
    return getExistingCategory(categoryToCopy) != null;
  }

  private DocumentModel copyCategory(CoreSession session, DocumentModel category) {
    String localCategoryDirPath = localCategoriesDirectory.getPathAsString();

    if (!isParent(session, category)) {

      // For child categories, create parent if it does not exist
      DocumentModel parentCategory = session.getParentDocument(category.getRef());
      DocumentModel newLocalParent;

      // Check if parent category exists
      if (!categoryExists(parentCategory)) {
        newLocalParent = copyCategory(session, parentCategory);
      } else {
        newLocalParent = getExistingCategory(parentCategory);
      }

      localCategoryDirPath = newLocalParent.getPathAsString();
    }

    // Create new category
    DocumentModel newLocalCategory = session.createDocumentModel(
        localCategoryDirPath, category.getName(), "FVCategory");
    newLocalCategory.setPropertyValue("dc:title", category.getTitle());
    DocumentModel newCategory = session.createDocument(newLocalCategory);

    // Add to local cache
    localCategories.add(newCategory);

    return newCategory;
  }

  private ArrayList<String> getUniqueCategories(CoreSession session, String dialectId) {

    ArrayList<String> categoryIds = new ArrayList<>();

    String query = "SELECT fv-word:categories/* FROM FVWord "
        + "WHERE fv-word:categories/* IS NOT NULL "
        + "AND fva:dialect = '" + dialectId + "' "
        + "AND ecm:isTrashed = 0"
        + "AND ecm:isVersion = 0";


    IterableQueryResult results = session.queryAndFetch(query, "NXQL", true, null);
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
    DocumentModel sharedCategory = session.getDocument(new IdRef(sharedCategoryId));
    return localCategories.stream().filter(localCategory -> localCategory.getTitle().equals(sharedCategory.getTitle())).findFirst().orElse(sharedCategory).getId();
  }

  private DocumentModelList getCategories(CoreSession session, DocumentModel dialect) {

    DocumentModelList categories = null;
    DocumentModel categoriesDirectory;

    if (dialect == null) {
      // Get shared categories directory
      categoriesDirectory = getSharedCategoriesDirectory(session);
    } else {
      // Get local categories directory
      categoriesDirectory = getLocalCategoriesDirectory(session, dialect);
    }

    String query = "SELECT * FROM FVCategory "
        + "WHERE ecm:ancestorId = '" + categoriesDirectory.getId() + "' "
        + "AND ecm:isTrashed = 0"
        + "AND ecm:isVersion = 0";

    try {
      categories = session.query(query);
    } catch (NuxeoException e) {
      e.printStackTrace();
    }

    return categories;
  }

  private DocumentModel getSharedCategoriesDirectory(CoreSession session) {
    return session.getDocument(new PathRef("/FV/Workspaces/SharedData/Shared Categories"));
  }

  private DocumentModel getLocalCategoriesDirectory(CoreSession session, DocumentModel dialect) {
    return session.getChild(dialect.getRef(), "Categories");
  }

  private boolean isParent(CoreSession session, DocumentModel category) {
    DocumentModel parent = session.getParentDocument(category.getRef());
    return parent.getTitle().equals("Shared Categories");
  }

}
