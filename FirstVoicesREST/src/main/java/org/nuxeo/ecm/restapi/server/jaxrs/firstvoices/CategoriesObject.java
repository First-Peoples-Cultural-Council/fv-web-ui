package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.query.api.PageProvider;
import org.nuxeo.ecm.platform.query.api.PageProviderService;
import org.nuxeo.ecm.platform.query.nxql.CoreQueryDocumentPageProvider;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.ecm.webengine.model.impl.DefaultObject;
import org.nuxeo.runtime.api.Framework;

@WebObject(type = "category")
@Produces(MediaType.APPLICATION_JSON)
public class CategoriesObject extends DefaultObject {

  public static final String CATEGORIES_LIST_PP = "CATEGORIES_LIST_PP";
  public static final String CATEGORIES_LIST_PUBLIC_PP = "CATEGORIES_LIST_PUBLIC_ONLY_PP";
  public static final String CATEGORY_CHILDREN_PP = "CATEGORY_CHILDREN_PP";

  private List<DocumentModel> getPageProviderResults(String ppName,
                                                     Integer pageSize,
                                                     Integer currentPage,
                                                     Object... params) {
    PageProviderService pageProviderService = Framework.getService(PageProviderService.class);
    Map<String, Serializable> props = new HashMap<>();
    props.put(
        CoreQueryDocumentPageProvider.CORE_SESSION_PROPERTY,
        (Serializable) getContext().getCoreSession()
    );
    PageProvider<DocumentModel> pageProvider = (PageProvider<DocumentModel>) pageProviderService
        .getPageProvider(ppName, null, null, null, props, params);

    if (pageSize != null) {
      pageProvider.setPageSize(pageSize);
    }
    if (currentPage != null) {
      pageProvider.setCurrentPage(currentPage);
    }

    return pageProvider.getCurrentPage();
  }

  @GET
  @Path("/")
  public List<DocumentModel> listCategories(
      @QueryParam(value = "pageSize") Integer pageSize,
      @QueryParam(value = "currentPage") Integer currentPage,
      @DefaultValue(value = "true") @QueryParam(value = "publicOnly") boolean publicOnly
  ) {
    if (publicOnly) {
      return getPageProviderResults(CATEGORIES_LIST_PUBLIC_PP, pageSize, currentPage);
    }
    return getPageProviderResults(CATEGORIES_LIST_PP, pageSize, currentPage);
  }

  @GET
  @Path("/{id}")
  public List<DocumentModel> getCategoryChildren(
      @PathParam("id") String id,
      @QueryParam(value = "pageSize") Integer pageSize,
      @QueryParam(value = "currentPage") Integer currentPage) {
    return getPageProviderResults(CATEGORY_CHILDREN_PP, pageSize, currentPage, id);
  }

}
