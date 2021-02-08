package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import ca.firstvoices.data.schemas.DialectTypesConstants;
import ca.firstvoices.rest.data.Category;
import ca.firstvoices.rest.data.CategoryList;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.platform.query.api.PageProvider;
import org.nuxeo.ecm.platform.query.api.PageProviderService;
import org.nuxeo.ecm.platform.query.nxql.CoreQueryDocumentPageProvider;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.ecm.webengine.model.impl.DefaultObject;
import org.nuxeo.runtime.api.Framework;

@WebObject(type = "category")
@Produces(MediaType.APPLICATION_JSON)
public class CategoriesObject extends DefaultObject {

  public static final String FIND_CATEGORIES_PP = "FIND_CATEGORIES_PP";
  public static final String FIND_CATEGORY_IN_CATEGORIES_PP = "FIND_CATEGORY_IN_CATEGORIES_PP";
  public static final String FIND_WORDS_WITH_CATEGORY_PP = "FIND_WORDS_WITH_CATEGORY_PP";
  public static final String FIND_WORDS_WITH_CATEGORY_PROXIED_PP =
      "FIND_WORDS_WITH_CATEGORY_PROXIED_PP";

  /**
   * Accepts the ID of a dialect for which to return all categories (and their item counts)
   * inUseOnly queryParam, if true, filters out zero-usage categories
   */
  @GET
  @Path("/{dialectId}")
  public Response getCategories(
      @PathParam("dialectId") String id,
      @QueryParam(value = "inUseOnly") @DefaultValue("true") boolean inUseOnly) {

    // First find fvcategories with title 'Categories' that are descendant of id (the dialect)
    // then descendant FVCategory instances are the individual categories
    // Then any FVWord having a reference to the category is counted

    final PageProviderService pageProviderService = Framework.getService(PageProviderService.class);

    final Map<String, Serializable> props = new HashMap<>();

    final CoreSession session = getContext().getCoreSession();

    props.put(CoreQueryDocumentPageProvider.CORE_SESSION_PROPERTY, (Serializable) session);

    PageProvider<DocumentModel> pageProvider =
        (PageProvider<DocumentModel>) pageProviderService.getPageProvider(FIND_CATEGORIES_PP,
            null,
            null,
            null,
            props,
            id);

    Map<String, Category> categoryMap = new HashMap<>();

    DocumentModel categoriesDoc = pageProvider.getCurrentEntry();
    if (categoriesDoc == null) {
      return Response.ok(new CategoryList(Collections.emptyList())).build();
    }

    pageProvider = (PageProvider<DocumentModel>) pageProviderService.getPageProvider(
        FIND_CATEGORY_IN_CATEGORIES_PP,
        null,
        null,
        null,
        props,
        categoriesDoc.getId());

    List<DocumentModel> allCategories = new LinkedList<>();
    allCategories.addAll(pageProvider.getCurrentPage());
    while (pageProvider.isNextPageAvailable()) {
      pageProvider.nextPage();
      allCategories.addAll(pageProvider.getCurrentPage());
    }

    String wordsInCategoryPP = FIND_WORDS_WITH_CATEGORY_PP;
    if (categoriesDoc.getPathAsString().toLowerCase().startsWith("/fv/sections")) {
      wordsInCategoryPP = FIND_WORDS_WITH_CATEGORY_PROXIED_PP;
    }

    for (DocumentModel category : allCategories) {


      PageProvider<DocumentModel> wordsInCategoryPageProvider =
          (PageProvider<DocumentModel>) pageProviderService.getPageProvider(
              wordsInCategoryPP,
              null,
              null,
              null,
              props,
              category.getId());


      List<DocumentModel> allWords = new LinkedList<>(wordsInCategoryPageProvider.getCurrentPage());
      while (wordsInCategoryPageProvider.isNextPageAvailable()) {
        wordsInCategoryPageProvider.nextPage();
        allWords.addAll(wordsInCategoryPageProvider.getCurrentPage());
      }

      int entryCount = allWords.size();

      String parentId = null;
      DocumentRef parentDocumentRef = category.getParentRef();
      if (parentDocumentRef != null) {
        DocumentModel document = session.getDocument(parentDocumentRef);
        if (DialectTypesConstants.FV_CATEGORY.equals(document.getType())) {
          parentId = document.getId();
        }

        Category c = new Category(category.getId(), parentId, category.getTitle(), entryCount);
        categoryMap.put(category.getId(), c);
      }
    }

    for (final Category cat : categoryMap.values()) {
      if (cat.getParentId() != null && categoryMap.containsKey(cat.getParentId())) {
        categoryMap.get(cat.getParentId()).incrementEntryCount(cat.getEntryCount());
      }
    }

    List<Category> list = new ArrayList<>(categoryMap.values());

    if (inUseOnly) {
      list.removeIf(i -> i.getEntryCount() == 0);
    }

    return Response.ok(new CategoryList(list)).build();

  }
}
