package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import ca.firstvoices.operations.FVRequestToJoinDialect;
import ca.firstvoices.rest.data.Site;
import ca.firstvoices.rest.data.SiteList;
import ca.firstvoices.rest.data.SiteMembershipRequest;
import ca.firstvoices.rest.data.SiteMembershipStatus;
import ca.firstvoices.rest.data.SiteMembershipUpdateRequest;
import ca.firstvoices.rest.helpers.DialectMembershipHelper;
import ca.firstvoices.rest.helpers.EtagHelper;
import ca.firstvoices.rest.helpers.PageProviderHelper;
import ca.firstvoices.utils.CustomSecurityConstants;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.apache.http.HttpHeaders;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.features.PrincipalHelper;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.UnrestrictedSessionRunner;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.api.security.PermissionProvider;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.ecm.webengine.model.impl.DefaultObject;
import org.nuxeo.runtime.api.Framework;

@WebObject(type = "site")
@Produces({MediaType.APPLICATION_JSON})
public class SitesObject extends DefaultObject {

  protected static final String PORTALS_LIST_SECTIONS_PP = "PORTALS_LIST_SECTIONS_PP";
  protected static final String PORTALS_LIST_WORKSPACES_PP = "PORTALS_LIST_WORKSPACES_PP";
  protected static final String DIALECTS_LIST_SECTIONS_PP = "DIALECTS_LIST_SECTIONS_PP";
  protected static final String DIALECTS_LIST_WORKSPACES_PP = "DIALECTS_LIST_WORKSPACES_PP";

  // they'll be tried in priority order, with the first one producing a result returning
  protected static final List<String> PORTALS_FIND_PPLIST = Arrays.asList(
      "PORTALS_FIND_PP_PRIORITY1",
      "PORTALS_FIND_PP_PRIORITY2",
      "PORTALS_FIND_PP_PRIORITY3",
      "PORTALS_FIND_PP_PRIORITY4");

  protected static final String PORTAL_FOR_DIALECT_PP = "PORTAL_FOR_DIALECT_PP";

  /**
   * Retrieve the PageProvider results for the given PageProvider.
   *
   * @param doPrivileged if the query should be run in an unrestricted session
   */
  @SuppressWarnings("java:S107")
  private Response simplePageProviderResponse(
      HttpServletRequest request, List<String> pageProviderNames,
      List<String> cacheCheckOnlyPageProviderNames, boolean singleResult, Integer pageSize,
      Integer currentPage, boolean doPrivileged, ResultFilter rf, Object... params) {

    ResponseGeneratingQueryRunner runner = new ResponseGeneratingQueryRunner(ctx.getCoreSession(),
        request,
        pageProviderNames,
        cacheCheckOnlyPageProviderNames,
        singleResult,
        pageSize,
        currentPage,
        rf,
        params);

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
        Arrays.asList(DIALECTS_LIST_SECTIONS_PP, DIALECTS_LIST_WORKSPACES_PP),
        false,
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
        Collections.singletonList(DIALECTS_LIST_WORKSPACES_PP),
        false,
        pageSize,
        currentPage,
        false,
        ACCEPT_ALL);
  }

  @GET
  @Path("{site}")
  public Response findSiteSections(
      @Context HttpServletRequest request, @PathParam("site") String site,
      @QueryParam(value = "currentPage") Integer currentPage) {

    return simplePageProviderResponse(request,
        PORTALS_FIND_PPLIST,
        Collections.emptyList(),
        true,
        null,
        null,
        true,
        ACCEPT_ALL,
        site);
  }


  @GET
  @Path("{site}/administration/joinRequests")
  public Response listJoinRequests(
      @Context HttpServletRequest request, @PathParam("site") String site) {
    Optional<String> dialectId = this.resolveDialectId(request, site);
    if (!ctx.getPrincipal().isAdministrator()
        && !callingUserHasLanguageAdministratorPermissions(dialectId.get())) {
      return Response.status(403).build();
    }
    return new SiteAdministrationDelegate(ctx.getCoreSession(), dialectId).listJoinRequests();
  }


  @GET
  @Path("{site}/administration/joinRequests/{requestId}")
  public Response getJoinRequest(
      @Context HttpServletRequest request, @PathParam("site") String site,
      @PathParam("requestId") String requestId) {
    Optional<String> dialectId = this.resolveDialectId(request, site);
    if (!ctx.getPrincipal().isAdministrator()
        && !callingUserHasLanguageAdministratorPermissions(dialectId.get())) {
      return Response.status(403).build();
    }
    return new SiteAdministrationDelegate(ctx.getCoreSession(),
        dialectId).getJoinRequest(requestId);
  }


  @POST
  @Path("{site}/administration/joinRequests/{requestId}")
  public Response updateJoinRequest(
      @Context HttpServletRequest request, @PathParam("site") String site,
      @PathParam("requestId") String requestId, SiteMembershipUpdateRequest updateRequest) {
    Optional<String> dialectId = this.resolveDialectId(request, site);
    if (!ctx.getPrincipal().isAdministrator()
        && !callingUserHasLanguageAdministratorPermissions(dialectId.get())) {
      return Response.status(403).build();
    }
    return new SiteAdministrationDelegate(ctx.getCoreSession(), dialectId)
        .updateJoinRequest(requestId, updateRequest);
  }

  // used for access control checks on administrative actions
  private boolean callingUserHasLanguageAdministratorPermissions(String dialectId) {
    final NuxeoPrincipal callingUser = ctx.getPrincipal();
    if (dialectId == null) {
      throw new IllegalArgumentException("no dialect specified");
    }

    DocumentModel dialectDocument = ctx.getCoreSession().getDocument(new IdRef(dialectId));
    if (dialectDocument == null) {
      return false; // if we can't read it with our current permissions, we're definitely not an
      // admin
    }

    String languageAdminGroupName = null;

    // resolve admin group name
    for (ACE ace : dialectDocument.getACP().getACL(ACL.LOCAL_ACL).getACEs()) {
      String acePrincipal = ace.getUsername();

      if (acePrincipal.contains(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP) && ace.isGranted()) {
        languageAdminGroupName = acePrincipal;
      }
    }

    return callingUser.isMemberOf(languageAdminGroupName);
  }


  @GET
  @Path("{site}/membership")
  public Response getSiteMembership(
      @Context HttpServletRequest request, @PathParam("site") String site) {

    final Optional<String> dialectId = resolveDialectId(request, site);
    if (!dialectId.isPresent()) {
      return Response.status(404).build();
    }

    DialectMembershipHelper.DialectMembershipStatus status =
        DialectMembershipHelper.getMembershipStatus(ctx.getCoreSession(),
            ctx.getPrincipal(),
            dialectId.get());

    SiteMembershipStatus membershipStatus = new SiteMembershipStatus(status.getStatus());

    return Response.ok(membershipStatus).build();
  }


  @POST
  @Path("{site}/membership")
  public Response requestSiteMembership(
      @Context HttpServletRequest request, @PathParam("site") String site,
      SiteMembershipRequest membershipRequest) {

    final Optional<String> dialectId = resolveDialectId(request, site);
    if (!dialectId.isPresent()) {
      return Response.status(404).build();
    }

    DialectMembershipHelper.DialectMembershipStatus status =
        DialectMembershipHelper.getMembershipStatus(ctx.getCoreSession(),
            ctx.getPrincipal(),
            dialectId.get());

    boolean canProceed = status.equals(DialectMembershipHelper.DialectMembershipStatus.AVAILABLE);

    if (!canProceed || ctx.getPrincipal().isAdministrator()) {
      return Response.status(400).entity(
          "Preconditions for joining this dialect have not been " + "satisfied").build();
    }

    final AutomationService automationService = Framework.getService(AutomationService.class);
    OperationContext operationContext = new OperationContext(ctx.getCoreSession());

    Map<String, Object> params = new HashMap<>();
    params.put("dialect", dialectId.get());
    params.put("interestReason", membershipRequest.getInterestReason());
    params.put("comment", membershipRequest.getComment());
    params.put("languageTeam", membershipRequest.isLanguageTeam());
    params.put("communityMember", membershipRequest.isCommunityMember());

    try {
      automationService.run(operationContext, FVRequestToJoinDialect.ID, params);
    } catch (OperationException e) {
      return Response.status(500).entity(
          "Failed to request joining this dialect " + membershipRequest.toString()).build();
    }

    return Response.status(200).entity("Your request to join this dialect is now pending").build();
  }


  private Optional<String> resolveDialectId(HttpServletRequest request, String site) {

    ResponseGeneratingQueryRunner queryRunner =
        new ResponseGeneratingQueryRunner(ctx.getCoreSession(),
            request,
            PORTALS_FIND_PPLIST,
            Collections.emptyList(),
            true,
            null,
            null,
            ACCEPT_ALL,
            site);

    queryRunner.run();

    if (queryRunner.getPortalId() == null || queryRunner.getDialectId() == null) {
      UnrestrictedSessionRunner checkIdDirectly =
          new UnrestrictedSessionRunner(ctx.getCoreSession()) {
            @Override
            public void run() {
              DocumentModel res = this.session.getDocument(new IdRef(site));
              if (!res.getType().equals("FVDialect")) {
                throw new IllegalArgumentException("ID is not for a dialect");
              }
            }
          };
      try {
        checkIdDirectly.runUnrestricted();
        return Optional.of(site);
      } catch (IllegalArgumentException e) {
        return Optional.of(null);
      }
    }

    return Optional.of(queryRunner.getDialectId());

  }

  private static class ResponseGeneratingQueryRunner extends UnrestrictedSessionRunner {

    private Response response;

    public Response getResponse() {
      return response;
    }

    public String getDialectId() {
      return dialectId;
    }

    public String getPortalId() {
      return portalId;
    }

    private final HttpServletRequest request;
    private final List<String> pageProviderNames;
    private final List<String> cacheCheckOnlyPageProviderNames;
    private final Integer pageSize;
    private final Integer currentPage;
    private final ResultFilter resultFilter;
    private final boolean singleResult;
    private final Object[] params;
    private String dialectId = null;
    private String portalId = null;

    @SuppressWarnings("java:S107")
    ResponseGeneratingQueryRunner(
        CoreSession session, HttpServletRequest request, List<String> pageProviderNames,
        List<String> cacheCheckOnlyPageProviderNames, boolean singleResult, Integer pageSize,
        Integer currentPage, ResultFilter rf, Object... params) {
      super(session);

      this.request = request;
      this.pageProviderNames = pageProviderNames;
      this.cacheCheckOnlyPageProviderNames = cacheCheckOnlyPageProviderNames;
      this.pageSize = pageSize;
      this.currentPage = currentPage;
      this.resultFilter = rf;
      this.singleResult = singleResult;
      this.params = params;
    }

    /*
     * When finished, getResponse() can be used to retrieve the response object
     */
    @Override
    public void run() {
      List<DocumentModel> results = new LinkedList<>();
      List<DocumentModel> cacheComputationResults = new LinkedList<>();

      for (String pageProviderName : pageProviderNames) {
        if (singleResult && !results.isEmpty()) {
          //we already found a match
          break;
        }

        List<DocumentModel> localResults = PageProviderHelper.getPageProviderResults(session,
            pageProviderName,
            pageSize,
            currentPage,
            params);

        localResults
            .stream()
            .filter(dm -> resultFilter.accept(session, pageProviderName, dm))
            .forEach(r -> {
              results.add(r);
              cacheComputationResults.add(r);
            });
      }

      for (String cacheCheckPageProviderName : cacheCheckOnlyPageProviderNames) {
        List<DocumentModel> localResults = PageProviderHelper.getPageProviderResults(session,
            cacheCheckPageProviderName,
            pageSize,
            currentPage,
            params);

        localResults.stream().filter(dm -> resultFilter.accept(session,
            cacheCheckPageProviderName,
            dm)).forEach(cacheComputationResults::add);
      }

      String etag = EtagHelper.computeEtag(cacheComputationResults,
          EtagHelper.DC_MODIFIED_AND_NAME_MAPPER);
      String ifNoneMatch = request.getHeader(HttpHeaders.IF_NONE_MATCH);

      if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
        this.response = Response.notModified().build();
        return;
      }

      List<Site> sites = results.stream().map(dm -> {

        DocumentModel associatedDialect = null;
        DocumentModel portal = null;

        if (dm.getType().equalsIgnoreCase("fvportal")) {
          // We have the portal, get the dialect

          if (!session.exists(dm.getParentRef())) {
            // If parent dialect does not exist, something is wrong with FVPortal, skip
            return null;
          }

          associatedDialect = session.getDocument(dm.getParentRef());
          portal = dm;

        } else {
          // We have the dialect, find the portal
          associatedDialect = dm;

          List<DocumentModel> foundPortals = PageProviderHelper.getPageProviderResults(session,
              PORTAL_FOR_DIALECT_PP,
              null,
              null,
              dm.getId());

          if (foundPortals.size() != 1) {
            return null; // We have an unexpected number of portals -- skip
          }
          portal = foundPortals.get(0);
        }

        if (associatedDialect == null || portal == null) {
          // If for whatever reason we could not resolve the portal or dialect, skip
          return null;
        }

        if (this.singleResult) {
          this.dialectId = associatedDialect.getId();
          this.portalId = portal.getId();
        }

        String logoImageId;

        if (portal.isProxy()) {
          logoImageId = (String) portal.getProperty("fvproxy", "proxied_logo");
        } else {
          // Do not fetch images for private dialects when displayed in the public view
          // Temporary solution until FW-2155 is resolved
          boolean isSectionsQuery = pageProviderNames.contains(PORTALS_LIST_SECTIONS_PP);
          logoImageId = (isSectionsQuery) ? null : (String) portal.getProperty("fv-portal", "logo");
        }

        Set<String> roles = new HashSet<>();

        if (associatedDialect.getACP() != null
            && associatedDialect.getACP().getACL("local") != null) {
          for (ACE ace : associatedDialect.getACP().getACL("local").getACEs()) {
            if (SecurityConstants.READ.equals(ace.getPermission()) && session.getPrincipal() != null
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

          PrincipalHelper principalHelper = new PrincipalHelper(userManager,
              Framework.getService(PermissionProvider.class));

          groups = principalHelper
              .getUserAndGroupIdsForPermission(associatedDialect,
                  SecurityConstants.READ,
                  false,
                  false,
                  true)
              .stream()
              .filter(id -> id.startsWith("group:"))
              .collect(Collectors.toSet());
        }

        String joinText = (String) associatedDialect.getPropertyValue("fvdialect:join_text");

        return new Site(associatedDialect.getPathAsString(),
            associatedDialect.getId(),
            roles,
            groups,
            String.valueOf(associatedDialect.getPropertyValue("dc:title")),
            (String) associatedDialect.getPropertyValue("fvdialect:parent_language"),
            logoImageId,
            joinText);

      }).filter(Objects::nonNull).collect(Collectors.toList());

      if (singleResult) {
        if (!sites.isEmpty()) {
          Response.ResponseBuilder responseBuilder = Response
              .ok()
              .entity(sites.get(0))
              .cacheControl(CacheControl.valueOf("must-revalidate"));
          if (etag != null) {
            responseBuilder.header(HttpHeaders.ETAG, etag);
          }

          this.response = responseBuilder.build();
        } else {
          this.response = Response.status(404).build();
        }

      } else {

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

  private interface ResultFilter {

    boolean accept(final CoreSession session, final String pageProviderName, final DocumentModel d);
  }

  private static final ResultFilter ACCEPT_ALL = (s, ppName, dm) -> true;
}
