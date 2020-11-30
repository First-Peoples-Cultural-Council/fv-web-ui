package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import ca.firstvoices.rest.data.Label;
import ca.firstvoices.rest.data.LabelCategory;
import ca.firstvoices.rest.data.LabelCategoryList;
import ca.firstvoices.rest.data.LabelList;
import ca.firstvoices.rest.freshness.services.DirectoryFreshnessService;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.apache.http.HttpHeaders;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.query.sql.model.Predicates;
import org.nuxeo.ecm.core.query.sql.model.QueryBuilder;
import org.nuxeo.ecm.directory.Directory;
import org.nuxeo.ecm.directory.Session;
import org.nuxeo.ecm.directory.api.DirectoryService;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.ecm.webengine.model.impl.DefaultObject;
import org.nuxeo.runtime.api.Framework;

/**
 * End-point to handle labels
 */
@WebObject(type = "label")
@Produces(MediaType.APPLICATION_JSON)
public class LabelsObject extends DefaultObject {

  @GET
  @Path("/immersive_labels")
  public Response getImmersiveLabels(@Context HttpServletRequest request) {
    return getLabelResponse(request,
        new QueryBuilder().predicate(Predicates.eq("enableForImmersion", true)));
  }

  @GET
  @Path("/labels")
  public Response getLabels(@Context HttpServletRequest request) {
    return getLabelResponse(request, new QueryBuilder());
  }

  private Response getLabelResponse(
      HttpServletRequest request, QueryBuilder qb) {
    DirectoryService ds = Framework.getService(DirectoryService.class);

    DirectoryFreshnessService freshnessService =
        Framework.getService(DirectoryFreshnessService.class);

    String etag = freshnessService.getSerial(DirectoryFreshnessService.FV_LABEL_DIRECTORY);
    String ifNoneMatch = request.getHeader(HttpHeaders.IF_NONE_MATCH);

    if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
      return Response.notModified().build();
    }
    Directory d = ds.getDirectory("fv_labels");
    try (Session session = d.getSession()) {

      DocumentModelList result = session.query(qb, false);
      List<Label> labels = result.stream().map(dm -> new Label(dm.getPropertyValue("id").toString(),
          dm.getPropertyValue("label").toString(),
          dm.getPropertyValue("type").toString(),
          dm.getPropertyValue("category").toString(),
          dm.getPropertyValue("template_strings").toString())).collect(Collectors.toList());


      Response.ResponseBuilder responseBuilder =
          Response.ok().entity(new LabelList(labels)).cacheControl(CacheControl.valueOf(
              "must-revalidate"));

      if (etag != null) {
        responseBuilder.header(HttpHeaders.ETAG, etag);
      }

      return responseBuilder.build();
    }
  }

  @GET
  @Path("/categories")
  public Response getLabelCategories(@Context HttpServletRequest request) {
    DirectoryService ds = Framework.getService(DirectoryService.class);
    DirectoryFreshnessService freshnessService =
        Framework.getService(DirectoryFreshnessService.class);


    String etag =
        freshnessService.getSerial(DirectoryFreshnessService.FV_LABEL_CATEGORIES_DIRECTORY);
    String ifNoneMatch = request.getHeader(HttpHeaders.IF_NONE_MATCH);

    if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
      return Response.notModified().build();
    }

    Directory d = ds.getDirectory("fv_label_categories");
    try (Session session = d.getSession()) {

      DocumentModelList result = session.query(new QueryBuilder(), false);
      List<LabelCategory> categories = result.stream().map(dm -> new LabelCategory(dm
          .getPropertyValue("id")
          .toString(),
          dm.getPropertyValue("parent").toString(),
          dm.getPropertyValue("label").toString())).collect(Collectors.toList());


      Response.ResponseBuilder responseBuilder = Response.ok().entity(new LabelCategoryList(
          categories)).cacheControl(CacheControl.valueOf("must-revalidate"));

      if (etag != null) {
        responseBuilder.header(HttpHeaders.ETAG, etag);
      }

      return responseBuilder.build();
    }
  }

}

