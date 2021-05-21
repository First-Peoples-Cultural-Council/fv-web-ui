package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import ca.firstvoices.data.schemas.DialectTypesConstants;
import ca.firstvoices.rest.data.Category;
import ca.firstvoices.rest.data.Category.CategoryTypes;
import ca.firstvoices.rest.data.CategoryList;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.nuxeo.ecm.automation.core.operations.services.PaginableRecordSetImpl;
import org.nuxeo.ecm.automation.core.util.PageProviderHelper;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.platform.query.api.PageProvider;
import org.nuxeo.ecm.platform.query.api.PageProviderDefinition;
import org.nuxeo.ecm.platform.query.api.PageProviderService;
import org.nuxeo.ecm.platform.query.nxql.CoreQueryDocumentPageProvider;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.ecm.webengine.model.impl.DefaultObject;
import org.nuxeo.runtime.api.Framework;

@WebObject(type = "category")
@Produces(MediaType.APPLICATION_JSON)
public class CategoriesObject extends DefaultObject {

  public static final String FIND_CATEGORY_IN_CATEGORIES_PP = "FIND_CATEGORY_IN_CATEGORIES_PP";
  public static final String FIND_PHRASE_CATEGORIES_IN_USE_PP = "FIND_PHRASE_CATEGORIES_IN_USE_PP";
  public static final String FIND_WORD_CATEGORIES_IN_USE_PP = "FIND_WORD_CATEGORIES_IN_USE_PP";

  public static final String PHRASE_CATEGORIES_CONTAINER_NAME = "Phrase Books";
  public static final String WORD_CATEGORIES_CONTAINER_NAME = "Categories";

  final PageProviderService pageProviderService =
      Framework.getService(PageProviderService.class);

  final Map<String, Serializable> props = new HashMap<>();

  /**
   * Accepts the ID of a dialect for which to return all categories for both phrases and words
   * inUseOnly queryParam -  if true, returns only used categories (default true)
   * parents queryParam - if true, does not return child (nested) categories)
   *
   */
  @GET
  @Path("/{dialectId}")
  public Response getCategories(
      @PathParam("dialectId") String id,
      @QueryParam(value = "inUseOnly") @DefaultValue("true") boolean inUseOnly,
      @QueryParam(value = "parentsOnly") @DefaultValue("false") boolean parentsOnly) {

    final CoreSession session = getContext().getCoreSession();

    props.put(CoreQueryDocumentPageProvider.CORE_SESSION_PROPERTY, (Serializable) session);

    IdRef dialectIdRef = new IdRef(id);

    Map<String, Category> allCategories = new HashMap<>();

    // Word Categories
    DocumentModel wordCategoriesContainer =
        session.getChild(dialectIdRef, WORD_CATEGORIES_CONTAINER_NAME);

    List<DocumentModel> allWordCategories = new LinkedList<>();

    if (wordCategoriesContainer != null) {
      allWordCategories =
          (inUseOnly)
              ? getAllUsedCategoriesForType(session, CategoryTypes.WORD, id,
              parentsOnly, wordCategoriesContainer) :
              getAllCategories(wordCategoriesContainer, parentsOnly);
      assignCategories(session, allCategories, allWordCategories,
          CategoryTypes.valueOf("WORD"));
    }

    // Phrase Categories
    DocumentModel phraseCategoriesContainer =
        session.getChild(dialectIdRef, PHRASE_CATEGORIES_CONTAINER_NAME);

    List<DocumentModel> allPhraseCategories = new LinkedList<>();

    if (phraseCategoriesContainer != null) {
      allPhraseCategories =
          (inUseOnly)
              ? getAllUsedCategoriesForType(session, CategoryTypes.PHRASE, id,
              parentsOnly, phraseCategoriesContainer) :
              getAllCategories(phraseCategoriesContainer, parentsOnly);
      assignCategories(session, allCategories, allPhraseCategories,
          CategoryTypes.valueOf("PHRASE"));
    }

    if (allWordCategories.isEmpty() && allPhraseCategories.isEmpty()) {
      // No categories found
      return Response.ok(new CategoryList(Collections.emptyList())).build();
    }

    List<Category> list = new ArrayList<>(allCategories.values());

    // Sort alphabetically
    list.sort(Comparator.comparing(Category::getTitle,
        Comparator.nullsLast(Comparator.naturalOrder())));

    return Response.ok(new CategoryList(list)).build();

  }

  /**
   * Will return all categories that are descendants of the container provided
   * @param categoriesContainer - parent of categories you are retrieving
   * @param parentsOnly - whether to return nested categories or not
   */
  private List<DocumentModel> getAllCategories(
      DocumentModel categoriesContainer, boolean parentsOnly) {

    // Set parent id to anything (%)
    String parentId = "%";

    if (parentsOnly) {
      parentId = categoriesContainer.getId();
    }

    PageProvider<DocumentModel> allCategoriesProvider =
        (PageProvider<DocumentModel>) pageProviderService.getPageProvider(
            FIND_CATEGORY_IN_CATEGORIES_PP,
            null,
            null,
            null,
            props,
            categoriesContainer.getId(),
            parentId);

    List<DocumentModel> allCategories = new LinkedList<>();
    allCategories.addAll(allCategoriesProvider.getCurrentPage());
    while (allCategoriesProvider.isNextPageAvailable()) {
      allCategoriesProvider.nextPage();
      allCategories.addAll(allCategoriesProvider.getCurrentPage());
    }

    return allCategories;
  }

  /**
   * Will query all words/phrases within a dialect to extract used categories.
   * @param session
   * @param type - type of entry you are querying categories from (words or phrases)
   * @param dialectId - site to query within
   * @param parentsOnly - whether to return nested children or not
   * @param parentContainer - container of the categories (e.g. Categories / Phrase Books)
   */
  private List<DocumentModel> getAllUsedCategoriesForType(CoreSession session,
      CategoryTypes type, String dialectId, boolean parentsOnly, DocumentModel parentContainer) {

    String categoryIdField = "fv-word:categories/*";
    String pageProvider = FIND_WORD_CATEGORIES_IN_USE_PP;

    if (CategoryTypes.PHRASE.equals(type)) {
      pageProvider = FIND_PHRASE_CATEGORIES_IN_USE_PP;
      categoryIdField = "fv-phrase:phrase_books/*";
    }

    PageProviderDefinition def = PageProviderHelper.getPageProviderDefinition(pageProvider);

    PageProvider<Map<String, Serializable>> pp =
        (PageProvider<Map<String, Serializable>>) PageProviderHelper.getPageProvider(
        session, def, null, null, null, null, null,
            dialectId);

    List<DocumentModel> allCategories = new LinkedList<>();

    PaginableRecordSetImpl records = new PaginableRecordSetImpl(pp);

    if (!records.hasError()) {
      for (Map<String, Serializable> category : records) {
        IdRef categoryRef = new IdRef(String.valueOf(category.get(categoryIdField)));
        if (session.exists(categoryRef)) {
          DocumentModel categoryDoc = session.getDocument(categoryRef);
          if (!parentsOnly || categoryDoc.getParentRef().equals(parentContainer.getRef())) {
            allCategories.add(categoryDoc);
          }
        }
      }
    }

    return allCategories;
  }

  /**
   * Creates category objects and adds them to the supplied array
   * @param session
   * @param currentCategories existing categories to add new categories to
   * @param newCatgories new categories to add
   * @param entryType type of categories being added (words/phrases)
   */
  private void assignCategories(CoreSession session,
      Map<String, Category> currentCategories, List<DocumentModel> newCatgories,
      CategoryTypes entryType) {

    // Copy of current categories to confirm references
    Set<String> categoryIds = currentCategories.keySet();

    for (DocumentModel category : newCatgories) {

      String parentId = null;
      DocumentRef parentDocumentRef = category.getParentRef();
      if (parentDocumentRef != null) {
        DocumentModel document = session.getDocument(parentDocumentRef);
        if (DialectTypesConstants.FV_CATEGORY.equals(document.getType())) {
          parentId = document.getId();
        }

        if (categoryIds.contains(category.getId())) {
          // If the key is already in there, we've already found this category
          // for words. It is assigned to both words and phrases
          entryType = CategoryTypes.valueOf("ALL");
        }

        Category c = new Category(category.getId(), parentId, category.getTitle(),
            entryType.getValue());
        currentCategories.put(category.getId(), c);
      }
    }
  }
}
