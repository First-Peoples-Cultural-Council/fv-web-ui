package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import ca.firstvoices.rest.helpers.PageProviderHelper;
import java.util.List;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.ecm.webengine.model.impl.DefaultObject;

@WebObject(type = "category")
@Produces(MediaType.APPLICATION_JSON)
public class CategoriesObject extends DefaultObject {

  public static final String CATEGORIES_LIST_PP = "CATEGORIES_LIST_PP";
  public static final String CATEGORIES_LIST_PUBLIC_PP = "CATEGORIES_LIST_PUBLIC_ONLY_PP";
  public static final String CATEGORY_CHILDREN_PP = "CATEGORY_CHILDREN_PP";


  @GET
  @Path("/")
  public List<DocumentModel> listCategories(@QueryParam(value = "pageSize") Integer pageSize,
                                            @QueryParam(value = "currentPage") Integer currentPage,
                                            @DefaultValue(value = "true")
                                            @QueryParam(value = "publicOnly") boolean publicOnly) {
    if (publicOnly) {
      return PageProviderHelper.getPageProviderResults(getContext().getCoreSession(),
          CATEGORIES_LIST_PUBLIC_PP,
          pageSize,
          currentPage);
    }
    return PageProviderHelper.getPageProviderResults(getContext().getCoreSession(),
        CATEGORIES_LIST_PP,
        pageSize,
        currentPage);
  }

  @GET
  @Path("/{id}")
  public List<DocumentModel> getCategoryChildren(@PathParam("id") String id,
                                                 @QueryParam(value = "pageSize") Integer pageSize,
                                                 @QueryParam(value = "currentPage")
                                                     Integer currentPage) {
    return PageProviderHelper.getPageProviderResults(getContext().getCoreSession(),
        CATEGORY_CHILDREN_PP,
        pageSize,
        currentPage,
        id);
  }

}
