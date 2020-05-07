package ca.firstvoices.dialect.categories.services;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.services.UnpublishedChangesService;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.IterableQueryResult;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.runtime.api.Framework;

public class MigrateToLocalCategoriesServiceImpl implements MigrateToLocalCategoriesService {

  DocumentModelList localCategories = null;
  DocumentModel localCategoriesDirectory = null;

  @Override
  public boolean migrateWords(CoreSession session, DocumentModel dialect, int batchSize) {

    FirstVoicesPublisherService publisherService = Framework.getService(FirstVoicesPublisherService.class);
    UnpublishedChangesService unpublishedChangesService = Framework.getService(UnpublishedChangesService.class);

    // Unpublished changes warnings
    int unpublishedChangesFound = 0;

    // Get the local categories that already exist
    localCategories = getCategories(session, dialect.getId());

    DocumentModelList sharedCategories = getCategories(session, getSharedCategoriesContainer(session).getId());

    if (sharedCategories.size() > 0) {
      String ids = "'" + sharedCategories.stream().map(DocumentModel::getId).collect(Collectors.joining("','")) + "'";

      // Get all words that reference shared categories
      String query =  "SELECT * FROM FVWord"
          + " WHERE fva:dialect = '" + dialect.getId() + "' "
          + " AND fv-word:categories/* IN ( " + ids + ")"
          + " AND ecm:isTrashed = 0"
          + " AND ecm:isVersion = 0";
      DocumentModelList words = session.query(query, batchSize);

      if (words.size() == 0) {
        return false;
      }

      for (DocumentModel word : words) {

        // First, check for unpublished changes
        boolean unpublishedChangesExist = unpublishedChangesService.checkUnpublishedChanges(session, word);

        // Update category Ids
        List<String> categoryIds = Arrays.asList((String[]) word.getPropertyValue("fv-word:categories"));
        categoryIds = categoryIds.stream().map(id -> getLocalCategory(session, id)).collect(Collectors.toList());
        word.setProperty("fv-word", "categories", categoryIds);

        // Save document
        session.saveDocument(word);

        // If word is published, and no unpublished changes exist - republish
        if (word.getCurrentLifeCycleState().equals("Published")) {
          if (!unpublishedChangesExist) {
            publisherService.republish(word);
          } else {
            ++unpublishedChangesFound;
          }
        }
      }

      // Good opportunity to output a warning about unpublished changes
      if (unpublishedChangesFound > 0) {

        Date eventDate = new Date(new Date().getTime());
        Calendar calendarEventDate = Calendar.getInstance();
        calendarEventDate.setTime(eventDate);

          HashMap<String, Object> errorEntry = new HashMap<String, Object>();
          errorEntry.put("id", "unpublished_words");
          errorEntry.put("message", unpublishedChangesFound + " found after updating " + words + " word categories.");
          errorEntry.put("created", calendarEventDate);
          errorEntry.put("job", null);

          ArrayList<HashMap<String, Object>> warnings = (ArrayList<HashMap<String, Object>>) dialect.getProperty("fv-maintenance", "warnings");

          if (warnings == null) {
            warnings = new ArrayList<HashMap<String, Object>>();
          }

        warnings.add(errorEntry);

          dialect.setProperty("fv-maintenance", "warnings", warnings);

        session.saveDocument(dialect);
      }

      return words.size() > 0;
    }

    return false;
  }

  @Override
  public boolean migrateCategoriesTree(CoreSession session, DocumentModel dialect) {

    FirstVoicesPublisherService publisherService = Framework.getService(FirstVoicesPublisherService.class);

    int copiedCategories = 0;

    localCategoriesDirectory = session.getChild(dialect.getRef(), "Categories");

    // Get the local categories that already exist
    localCategories = getCategories(session, dialect.getId());

    // Get the unique categories from all the words in this dialect
    for (String categoryId : getUniqueCategories(session, dialect.getId())) {
      DocumentModel category = session.getDocument(new IdRef(categoryId));
      DocumentModel parentCategory = session.getParentDocument(category.getRef());

      // Skip if category exists locally
      if (categoryExists(category)) {
        continue;
      }

      DocumentModel copiedCategory = null;

      if (parentCategory.getTitle().equals("Shared Categories")) {
        // Copy category and children (categoryId is a "parent" shared category)
        copiedCategory = copyCategory(session, category.getId());
        ++copiedCategories;
      } else {
        // Copy parent and children (categoryId is a "child" shared category)
        copiedCategory = copyCategory(session, parentCategory.getId());
        ++copiedCategories;
      }

      if (copiedCategory != null && dialect.getCurrentLifeCycleState().equals("Published")) {
         publisherService.publish(copiedCategory);
      }
    }

    return copiedCategories > 0;
  }

  // This is a search based on title
  private boolean categoryExists(DocumentModel categoryToCopy) {
    DocumentModel category = localCategories.stream()
        .filter(localCategory -> localCategory.getTitle().equals(categoryToCopy.getTitle()))
        .findFirst()
        .orElse(null);

    return category != null;
  }

  private DocumentModel copyCategory(CoreSession session, String categoryToCopy) {
    DocumentModel category = session.getDocument(new IdRef(categoryToCopy));

    // Copy category to local
    DocumentModel newCategory = session.copy(category.getRef(), localCategoriesDirectory.getRef(), null);

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

    return categoryIds;
  }

  private String getLocalCategory(CoreSession session, String sharedCategoryId) {
    DocumentModel sharedCategory = session.getDocument(new IdRef(sharedCategoryId));
    return localCategories.stream().filter(localCategory -> localCategory.getTitle().equals(sharedCategory.getTitle())).findFirst().orElse(sharedCategory).getId();
  }

  private DocumentModelList getCategories(CoreSession session, String containerId) {

    DocumentModelList categories = null;

    String query = "SELECT * FROM FVCategory "
        + "WHERE ecm:ancestorId = '" + containerId + "' "
        + "AND ecm:isTrashed = 0"
        + "AND ecm:isVersion = 0";

    try {
      categories = session.query(query);
    } catch (NuxeoException e) {
      e.printStackTrace();
    }

    return categories;
  }

  private DocumentModel getSharedCategoriesContainer(CoreSession session) {
    return session.getDocument(new PathRef("/FV/Workspaces/SharedData/Shared Categories"));
  }

}
