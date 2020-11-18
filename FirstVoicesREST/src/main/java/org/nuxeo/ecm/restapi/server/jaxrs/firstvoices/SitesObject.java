package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import ca.firstvoices.nuxeo.utils.EnricherUtils;
import ca.firstvoices.rest.data.Site;
import ca.firstvoices.rest.data.SiteList;
import ca.firstvoices.rest.helpers.EtagHelper;
import ca.firstvoices.rest.helpers.PageProviderHelper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.apache.http.HttpHeaders;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.UnrestrictedSessionRunner;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.ecm.webengine.model.impl.DefaultObject;

@WebObject(type = "site")
@Produces({MediaType.APPLICATION_JSON})
public class SitesObject extends DefaultObject {

  public static final String PORTALS_LIST_SECTIONS_PP = "PORTALS_LIST_SECTIONS_PP";
  public static final String PORTALS_LIST_WORKSPACES_PP = "PORTALS_LIST_WORKSPACES_PP";

  private Response simplePageProviderResponse(
      HttpServletRequest request, String pageProviderName, Integer pageSize, Integer currentPage,
      boolean doPrivileged) {

    ResponseGeneratingUnrestrictedSessionRunner runner =
        new ResponseGeneratingUnrestrictedSessionRunner(ctx.getCoreSession(),
            request,
            pageProviderName,
            pageSize,
            currentPage);

    runner.runUnrestricted();

    return runner.getResponse();

  }


  @GET
  @Path("sections")
  public Response listSitesSections(
      @Context HttpServletRequest request, @QueryParam(value = "pageSize") Integer pageSize,
      @QueryParam(value = "currentPage") Integer currentPage) {
    return simplePageProviderResponse(request,
        PORTALS_LIST_SECTIONS_PP,
        pageSize,
        currentPage,
        true);
  }

  @GET
  @Path("Workspaces")
  public Response listSitesWorkspaces(
      @Context HttpServletRequest request, @QueryParam(value = "pageSize") Integer pageSize,
      @QueryParam(value = "currentPage") Integer currentPage) {
    return simplePageProviderResponse(request,
        PORTALS_LIST_WORKSPACES_PP,
        pageSize,
        currentPage,
        false);
  }

  private static class ResponseGeneratingUnrestrictedSessionRunner
      extends UnrestrictedSessionRunner {

    private Response response;

    public Response getResponse() {
      return response;
    }

    private final HttpServletRequest request;
    private final String pageProviderName;
    private final Integer pageSize;
    private final Integer currentPage;

    ResponseGeneratingUnrestrictedSessionRunner(
        CoreSession session, HttpServletRequest request, String pageProviderName, Integer pageSize,
        Integer currentPage) {
      super(session);
      this.request = request;
      this.pageProviderName = pageProviderName;
      this.pageSize = pageSize;
      this.currentPage = currentPage;

    }

    @Override
    public void run() {

      List<DocumentModel> results = PageProviderHelper.getPageProviderResults(session,
          pageProviderName,
          pageSize,
          currentPage);

      String etag = EtagHelper.computeEtag(results, EtagHelper.DC_MODIFIED_MAPPER);
      String ifNoneMatch = request.getHeader(HttpHeaders.IF_NONE_MATCH);

      if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
        this.response = Response.notModified().build();
        return;
      }

      List<Site> sites = results.stream().map(dm -> {
        String logoImageId;
        DocumentModel associatedDialect;
        DocumentModel associatedLanguageFamily;

        if (dm.isProxy()) {

          associatedDialect = session.getProxies(new IdRef((String) dm.getProperty(
              "fvancestry",
              "dialect")), null).get(0);
          associatedLanguageFamily = session.getProxies(new IdRef((String) dm.getProperty(
              "fvancestry",
              "family")), null).get(0);
          logoImageId = (String) dm.getProperty("fvproxy", "proxied_logo");
        } else {
          associatedDialect = session.getDocument(new IdRef((String) dm.getProperty(
              "fvancestry",
              "dialect")));
          associatedLanguageFamily = session.getDocument(new IdRef((String) dm.getProperty(
              "fvancestry",
              "family")));
          logoImageId = (String) dm.getProperty("fv-portal", "logo");
        }


        Set<String> roles = new HashSet<>();

        for (ACE ace : associatedDialect.getACP().getACL("local").getACEs()) {
          if (SecurityConstants.READ.equals(ace.getPermission()) && session
              .getPrincipal()
              .isMemberOf(ace.getUsername())) {
            roles.add("Member");
            break;
          }
        }

        return new Site(associatedDialect.getPathAsString(), associatedDialect.getId(), roles,
        (String) associatedDialect.getPropertyValue("dc:title"),
            (String) associatedLanguageFamily.getPropertyValue(
            "dc:title"), logoImageId
            );

      }).collect(Collectors.toList());
      SiteList mappedResults = new SiteList(sites);

      Response.ResponseBuilder responseBuilder = Response.ok().entity(mappedResults).cacheControl(
          CacheControl.valueOf("must-revalidate"));

      if (etag != null) {
        responseBuilder.header(HttpHeaders.ETAG, etag);
      }

      this.response = responseBuilder.build();
    }

  }

}
