package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_AUDIO;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_BOOK;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PICTURE;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_VIDEO;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;

import ca.firstvoices.core.io.utils.DialectUtils;
import ca.firstvoices.core.io.utils.StateUtils;
import ca.firstvoices.rest.data.Statistics;
import ca.firstvoices.rest.helpers.EtagHelper;
import java.io.Serializable;
import java.math.BigDecimal;
import java.nio.ByteBuffer;
import java.security.Principal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.IterableQueryResult;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.ecm.webengine.model.impl.DefaultObject;

/*
 Generates statistics about a particular dialect for all document types and
 several temporal ranges

 Uses aggregate queries for performance and sets caching headers on the response
 */
@WebObject(type = "statistics")
@Produces({MediaType.APPLICATION_JSON})
public class StatisticsObject extends DefaultObject {

  protected static final String BASE_DOCS_QUERY =
      "SELECT COUNT(ecm:uuid) FROM %s WHERE ecm:ancestorId = '%s' AND "
          + "ecm:isTrashed = 0 AND ecm:isVersion = 0";

  private final List<String> allDocTypes = Arrays.asList("words",
      "phrases",
      "songs",
      "stories",
      "pictures",
      "audio",
      "videos");

  @GET
  @Path("generate")
  public Response generateStatistics(
      @Context HttpServletRequest request, @QueryParam(value = "siteId") String siteId) {

    CoreSession session = getContext().getCoreSession();

    // Get current user
    Principal principal = session.getPrincipal();

    // compute an ETag from current user, requested dialect, and the system time truncated to the
    // last hour

    long lastHour = System.currentTimeMillis() / (3600 * 1000);
    String etag = EtagHelper.computeEtag(ByteBuffer.wrap(("" + principal.getName() + siteId
        + lastHour).getBytes()));

    String ifNoneMatch = request.getHeader(HttpHeaders.IF_NONE_MATCH);
    if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
      return Response.notModified().build();
    }

    // Build response
    Response.ResponseBuilder responseBuilder = Response.noContent();

    // Get site id
    IdRef siteIdRef = new IdRef(siteId);

    if (session.exists(siteIdRef)) {
      DocumentModel site = session.getDocument(siteIdRef);
      if (DialectUtils.isDialect(site)) {
        Statistics s = new Statistics(principal.getName(), siteId);
        for (String docType : allDocTypes) {
          // Perform some validation on provided parameters
          if (allDocTypes.contains(docType)) {
            generateDocumentStatsJson(session, s, siteId, docType);
          }
        }

        responseBuilder = Response.ok(s);
      }
    }

    responseBuilder.header(HttpHeaders.ETAG, etag);
    responseBuilder.cacheControl(CacheControl.valueOf("must-revalidate"));

    return responseBuilder.build();
  }

  private void generateDocumentStatsJson(
      CoreSession session, Statistics statistics, String siteId, String docType) {

    Map<String, BigDecimal> aggregate = new HashMap<>();
    Map<Statistics.TemporalRange, Map<String, BigDecimal>> temporal = new HashMap<>();
    statistics.getAggregate().put(docType, aggregate);
    statistics.getTemporal().put(docType, temporal);

    // Build query for the specified document type
    String query = constructQuery(siteId, docType);

    if (query != null) {

      // Total docs
      queryToResult(session, query).ifPresent(count -> aggregate.put("total", count));

      // By lifecycle
      final String[] lifeCycleStates = {"New", "Enabled", "Disabled", "Published"};
      for (String lcs : lifeCycleStates) {
        queryToResult(session,
            query + " AND ecm:currentLifeCycleState='" + lcs
                + "'").ifPresent(count -> aggregate.put(lcs.toLowerCase() + " ("
            + StateUtils.stateToVisibility(lcs) + ")", count));
      }

      // Children's archive
      queryToResult(session,
          query + " AND fv:available_in_childrens_archive=1")
          .ifPresent(count -> aggregate.put("available_in_childrens_archive",
          count));


      // there are some preset ranges, but you can trivially add others by creating new
      // instances of TemporalRange
      for (Statistics.TemporalRange t : Statistics.RANGE_PRESETS) {
        temporal.put(t, new HashMap<>());

        String createdQuery =
            query + " AND dc:created > DATE '" + localDateToNXQLDate(t.getStart()) + "'";

        Optional<BigDecimal> createdQueryResult = queryToResult(session, createdQuery);
        createdQueryResult.ifPresent(count -> temporal.get(t).put("created", count));

        String modifiedQuery =
            query + " AND dc:modified > DATE '" + localDateToNXQLDate(t.getStart()) + "'";

        Optional<BigDecimal> modifiedQueryResult = queryToResult(session, modifiedQuery);
        modifiedQueryResult.ifPresent(count -> temporal.get(t).put("modified", count));
      }
    }
  }

  // Build the query for a specified document type
  private String constructQuery(String siteId, String docType) {

    String query = null;

    if (docType.equalsIgnoreCase("words")) {
      query = String.format(BASE_DOCS_QUERY, FV_WORD, siteId);
    } else if (docType.equalsIgnoreCase("phrases")) {
      query = String.format(BASE_DOCS_QUERY, FV_PHRASE, siteId);
    } else if (docType.equalsIgnoreCase("songs")) {
      query = String.format(BASE_DOCS_QUERY, FV_BOOK, siteId)
          + " AND fvbook:type = 'song'";
    } else if (docType.equalsIgnoreCase("stories")) {
      query = String.format(BASE_DOCS_QUERY, FV_BOOK, siteId)
          + " AND fvbook:type = 'story'";
    } else if (docType.equalsIgnoreCase("audio")) {
      query = String.format(BASE_DOCS_QUERY, FV_AUDIO, siteId);
    } else if (docType.equalsIgnoreCase("pictures")) {
      query = String.format(BASE_DOCS_QUERY, FV_PICTURE, siteId);
    } else if (docType.equalsIgnoreCase("videos")) {
      query = String.format(BASE_DOCS_QUERY, FV_VIDEO, siteId);
    }

    return query;
  }

  private static final DateTimeFormatter nxqlDateFormatter = DateTimeFormatter.ofPattern(
      "yyyy-MM-dd");

  private String localDateToNXQLDate(LocalDate d) {
    return d.format(StatisticsObject.nxqlDateFormatter);
  }

  private Optional<BigDecimal> queryToResult(CoreSession session, String query, Object... params) {
    BigDecimal result = null;
    final String countKey = "COUNT(" + NXQL.ECM_UUID + ")";

    try (IterableQueryResult newDocs = session.queryAndFetch(query, "NXQL", params)) {
      // Extract count from ResultSet
      // Whether 1 or 2 results are returned may depend on DB/ES backend
      if (newDocs.size() == 2) {
        // If 2 col are returned get the higher one
        Map<String, Serializable> firstResult = newDocs.iterator().next();
        Map<String, Serializable> secondResult = newDocs.iterator().next();

        if (firstResult.containsKey(countKey) && secondResult.containsKey(countKey)) {
          BigDecimal firstResultCount = BigDecimal.valueOf((Long) firstResult.get(countKey));
          BigDecimal secondResultCount = BigDecimal.valueOf((Long) firstResult.get(countKey));

          result = secondResultCount;

          if (firstResultCount.compareTo(secondResultCount) > 0) {
            // First result is bigger
            result = firstResultCount;
          }
        }
      } else if (newDocs.size() == 1) {
        // If only 1 col is returned
        Map<String, Serializable> singleResult = newDocs.iterator().next();
        if (singleResult.containsKey(countKey)) {
          result = BigDecimal.valueOf((Long) singleResult.get(countKey));
        }
      }
    }
    return Optional.ofNullable(result);

  }

}
