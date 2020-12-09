package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import ca.firstvoices.rest.data.Site;
import ca.firstvoices.rest.data.SiteList;
import ca.firstvoices.rest.helpers.EtagHelper;
import ca.firstvoices.rest.helpers.PageProviderHelper;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
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
import org.nuxeo.ecm.automation.features.PrincipalHelper;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.UnrestrictedSessionRunner;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.PermissionProvider;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.ecm.webengine.model.impl.DefaultObject;
import org.nuxeo.runtime.api.Framework;

@WebObject(type = "site")
@Produces({MediaType.APPLICATION_JSON})
public class SitesObject extends DefaultObject {

  public static final String PORTALS_LIST_SECTIONS_PP = "PORTALS_LIST_SECTIONS_PP";
  public static final String PORTALS_LIST_WORKSPACES_PP = "PORTALS_LIST_WORKSPACES_PP";

  /**
   * Retrieve the PageProvider results for the given PageProvider.
   *
   * @param doPrivileged if the query should be run in an unrestricted session
   */
  private Response simplePageProviderResponse(
      HttpServletRequest request, List<String> pageProviderNames, Integer pageSize,
      Integer currentPage, boolean doPrivileged, ResultFilter rf) {

    ResponseGeneratingQueryRunner runner = new ResponseGeneratingQueryRunner(ctx.getCoreSession(),
        request,
        pageProviderNames,
        pageSize,
        currentPage,
        rf);

    if (doPrivileged) {
      runner.runUnrestricted();
    } else {
      runner.run();
    }

    return runner.getResponse();

  }


  @GET
  @Path("sections")
  public Response listSitesSections(
      @Context HttpServletRequest request, @QueryParam(value = "pageSize") Integer pageSize,
      @QueryParam(value = "currentPage") Integer currentPage) {

    ResultFilter rf = ((s, pageProviderName, d) -> {
      if (pageProviderName.equals(PORTALS_LIST_WORKSPACES_PP)) {
        DocumentRef parentRef = d.getParentRef();
        if (parentRef == null) {
          return false;
        }
        DocumentModel parent = s.getDocument(parentRef);
        if (parent == null) {
          return false;
        }
        String lcs = parent.getCurrentLifeCycleState();
        if (lcs == null) {
          return false;
        }
        return lcs.equalsIgnoreCase("enabled");
      }

      return true;
    });

    return simplePageProviderResponse(request,
        Arrays.asList(PORTALS_LIST_SECTIONS_PP, PORTALS_LIST_WORKSPACES_PP),
        pageSize,
        currentPage,
        true,
        rf);
  }

  @GET
  @Path("Workspaces")
  public Response listSitesWorkspaces(
      @Context HttpServletRequest request, @QueryParam(value = "pageSize") Integer pageSize,
      @QueryParam(value = "currentPage") Integer currentPage) {
    return simplePageProviderResponse(request,
        Collections.singletonList(PORTALS_LIST_WORKSPACES_PP),
        pageSize,
        currentPage,
        false,
        ACCEPT_ALL);
  }

  private static class ResponseGeneratingQueryRunner extends UnrestrictedSessionRunner {

    private Response response;

    public Response getResponse() {
      return response;
    }

    private final HttpServletRequest request;
    private final List<String> pageProviderNames;
    private final Integer pageSize;
    private final Integer currentPage;
    private final ResultFilter resultFilter;

    ResponseGeneratingQueryRunner(
        CoreSession session, HttpServletRequest request, List<String> pageProviderNames,
        Integer pageSize, Integer currentPage, ResultFilter rf) {
      super(session);

      this.request = request;
      this.pageProviderNames = pageProviderNames;
      this.pageSize = pageSize;
      this.currentPage = currentPage;
      this.resultFilter = rf;
    }

    /*
     * When finished, getResponse() can be used to retrieve the response object
     */
    @Override
    public void run() {
      List<DocumentModel> results = new LinkedList<>();

      for (String pageProviderName : pageProviderNames) {
        List<DocumentModel> localResults = PageProviderHelper.getPageProviderResults(session,
            pageProviderName,
            pageSize,
            currentPage);

        localResults
            .stream()
            .filter(dm -> resultFilter.accept(session, pageProviderName, dm))
            .forEach(results::add);
      }

      String etag = EtagHelper.computeEtag(results, EtagHelper.DC_MODIFIED_MAPPER);
      String ifNoneMatch = request.getHeader(HttpHeaders.IF_NONE_MATCH);

      if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
        this.response = Response.notModified().build();
        return;
      }

      List<Site> sites = results.stream().map(dm -> {
        if (!session.exists(dm.getParentRef())) {
          // If parent dialect does not exist, something is wrong with FVPortal, skip
          return null;
        }

        // Dialect is parent of Portal
        DocumentModel associatedDialect = session.getDocument(dm.getParentRef());

        if (associatedDialect == null) {
          // If for whatever reason we could not get the dialect, skip
          return null;
        }

        String logoImageId;

        if (dm.isProxy()) {
          logoImageId = (String) dm.getProperty("fvproxy", "proxied_logo");
        } else {
          // Do not fetch images for private dialects when displayed in the public view
          // Temporary solution until FW-2155 is resolved
          boolean isSectionsQuery = pageProviderNames.contains(PORTALS_LIST_SECTIONS_PP);
          logoImageId = (isSectionsQuery) ? null : (String) dm.getProperty("fv-portal", "logo");
        }

        Set<String> roles = new HashSet<>();

        if (associatedDialect.getACP() != null
            && associatedDialect.getACP().getACL("local") != null) {
          for (ACE ace : associatedDialect.getACP().getACL("local").getACEs()) {
            if (SecurityConstants.READ.equals(ace.getPermission())
                && session.getPrincipal() != null
                && session.getPrincipal().isMemberOf(ace.getUsername())) {
              roles.add("Member");
            }
          }
        }

        // Set groups so that response can be cached but we can still do
        // conditional presentation based on the user's groups.
        Set<String> groups = new HashSet<>();
        if (associatedDialect.getACP() != null
            && associatedDialect.getACP().getACL("local") != null) {

          UserManager userManager = Framework.getService(UserManager.class);

          PrincipalHelper principalHelper =
              new PrincipalHelper(userManager, Framework.getService(PermissionProvider.class));

          groups =
              principalHelper.getUserAndGroupIdsForPermission(
                  associatedDialect, SecurityConstants.READ, false, false, true)
                  .stream().filter(id -> id.startsWith("group:")).collect(Collectors.toSet());
        }

        return new Site(associatedDialect.getPathAsString(),
            associatedDialect.getId(),
            roles,
            groups,
            String.valueOf(associatedDialect.getPropertyValue("dc:title")),
            (String) associatedDialect.getPropertyValue("fvdialect:parent_language"),
            logoImageId);

      }).filter(Objects::nonNull).collect(Collectors.toList());
      SiteList mappedResults = new SiteList(sites);

      Response.ResponseBuilder responseBuilder = Response.ok().entity(mappedResults).cacheControl(
          CacheControl.valueOf("must-revalidate"));

      if (etag != null) {
        responseBuilder.header(HttpHeaders.ETAG, etag);
      }

      this.response = responseBuilder.build();
    }

  }

  private interface ResultFilter {

    boolean accept(final CoreSession session, final String pageProviderName, final DocumentModel d);
  }

  private static final ResultFilter ACCEPT_ALL = (s, ppName, dm) -> true;
}
