package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import static ca.firstvoices.rest.data.SearchResults.SearchDomain;
import ca.firstvoices.core.io.utils.StateUtils;
import ca.firstvoices.rest.data.SearchResult;
import ca.firstvoices.rest.data.SearchResults;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.MultiMatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.SortInfo;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.ecm.webengine.model.impl.DefaultObject;
import org.nuxeo.elasticsearch.api.ElasticSearchService;
import org.nuxeo.elasticsearch.api.EsResult;
import org.nuxeo.elasticsearch.fetcher.EsFetcher;
import org.nuxeo.elasticsearch.query.NxQueryBuilder;
import org.nuxeo.runtime.api.Framework;

@WebObject(type = "customSearch")
@Produces(MediaType.APPLICATION_JSON)
public class SearchObject extends DefaultObject {

  private static final String ECM_PRIMARY_TYPE = "ecm:primaryType";

  @GET
  @Path("")
  public Response doSearch(
      @QueryParam(value = "q") String query, @QueryParam(value = "parentPath") String parent,
      @QueryParam(value = "ancestorId") String ancestorId,
      @QueryParam(value = "docType") @DefaultValue("all") String docType,
      @QueryParam(value = "domain") @DefaultValue("both") String domain,
      @QueryParam(value = "perPage") @DefaultValue("25") Integer perPage,
      @QueryParam(value = "page") @DefaultValue("1") Integer from) {

    if (perPage > 100) {
      perPage = 100;
    }

    SearchDomain searchDomain = SearchDomain.BOTH;

    try {
      searchDomain = SearchDomain.valueOf(domain);
    } catch (IllegalArgumentException e) {
      // just use the default
    }

    SearchResults.DocumentTypes documentTypes = SearchResults.DocumentTypes.ALL;

    try {
      documentTypes = SearchResults.DocumentTypes.valueOf(docType);
    } catch (IllegalArgumentException e) {
      // just use the default
    }

    SearchResults searchResults = new SearchResults();

    searchResults.setQuery(query);
    searchResults.setDomain(searchDomain);
    searchResults.setDocumentTypes(documentTypes);

    final CoreSession session = getContext().getCoreSession();
    final ElasticSearchService ess = Framework.getService(ElasticSearchService.class);

    BoolQueryBuilder typesQuery = QueryBuilders.boolQuery();

    switch (documentTypes) {

      case BOOK:
        typesQuery.should(QueryBuilders.matchQuery(ECM_PRIMARY_TYPE, "FVBook"));
        break;
      case PHRASE:
        typesQuery.should(QueryBuilders.matchQuery(ECM_PRIMARY_TYPE, "FVPhrase"));
        break;
      case WORD:
        typesQuery.should(QueryBuilders.matchQuery(ECM_PRIMARY_TYPE, "FVWord"));
        break;
      case ALL:
      default:
        typesQuery.should(QueryBuilders.matchQuery(ECM_PRIMARY_TYPE, "FVBook"));
        typesQuery.should(QueryBuilders.matchQuery(ECM_PRIMARY_TYPE, "FVPhrase"));
        typesQuery.should(QueryBuilders.matchQuery(ECM_PRIMARY_TYPE, "FVWord"));
        break;
    }

    float englishBoost = 1.0f;
    float languageBoost = 1.0f;

    switch (searchDomain) {
      case ENGLISH:
        englishBoost = 1.1f;
        languageBoost = 0.4f;
        break;
      case LANGUAGE:
        englishBoost = 0.4f;
        languageBoost = 1.1f;
        break;
      case BOTH:
      default:
        break;
    }

    typesQuery.minimumShouldMatch(1);

    BoolQueryBuilder basicConstraints;

    basicConstraints = QueryBuilders.boolQuery().must(QueryBuilders.matchQuery("ecm:isVersion",
        false)).must(typesQuery);

    if (ancestorId != null && ancestorId.trim().length() > 0) {
      //can't use ecm:ancestorId in ES, but we do have path
      DocumentModel dm = session.getDocument(new IdRef(ancestorId));
      if (dm != null) {
        parent = dm.getPathAsString();
      }
    }

    if (parent != null && parent.trim().length() > 0) {
      basicConstraints.must(QueryBuilders.wildcardQuery("ecm:path", parent + "*"));
    }

    QueryBuilder exactMatchQuery = QueryBuilders.multiMatchQuery(query,
        "ecm:fulltext_dictionary_all_field",
        "dc:title").analyzer("keyword").type(MultiMatchQueryBuilder.Type.PHRASE).boost(1.3f);

    QueryBuilder exactTitleMatch =
        QueryBuilders.matchQuery("ecm:title.lowercase", query.toLowerCase()).boost(1.2f);

    QueryBuilder phraseQuery = QueryBuilders.matchPhraseQuery("ecm:fulltext_dictionary_all_field",
        query).boost(1.5f);

    QueryBuilder englishQuery = QueryBuilders
        .fuzzyQuery("exact_matches_translations", query)
        .fuzziness(Fuzziness.fromEdits(1))
        .transpositions(true)
        .boost(englishBoost);

    QueryBuilder languageQuery = QueryBuilders
        .fuzzyQuery("exact_matches_language", query)
        .fuzziness(Fuzziness.fromEdits(1))
        .transpositions(true)
        .boost(languageBoost);

    QueryBuilder combinedLanguageQuery = QueryBuilders
        .boolQuery()
        .should(languageQuery)
        .should(englishQuery)
        .should(exactMatchQuery)
        .should(exactTitleMatch)
        .should(phraseQuery)
        .minimumShouldMatch(1);

    int offset = (from - 1) * perPage;

    QueryBuilder composedQuery = basicConstraints.must(combinedLanguageQuery);

    NxQueryBuilder nxQueryBuilder = new NxQueryBuilder(session).esQuery(composedQuery);
    nxQueryBuilder.fetchFromElasticsearch();
    nxQueryBuilder.addSort(new SortInfo("_score", false));
    nxQueryBuilder.limit(perPage);
    nxQueryBuilder.offset(offset);


    ElasticSearchResultConsumer consumer = new ElasticSearchResultConsumer(session,
        d -> query.equals(d.getTitle()));
    nxQueryBuilder.hitDocConsumer(consumer);

    EsResult result = ess.queryAndAggregate(nxQueryBuilder);

    searchResults.getResults().addAll(consumer.getResults());

    searchResults.getStatistics().setResultCount(result
        .getElasticsearchResponse()
        .getHits().totalHits);

    searchResults.getStatistics().getCountsByType().putAll(consumer
        .getResults()
        .stream()
        .collect(Collectors.groupingBy(SearchResult::getType, Collectors.counting())));

    return Response.ok(searchResults).build();
  }

  public static class ElasticSearchResultConsumer implements EsFetcher.HitDocConsumer {

    private CoreSession session;
    private Predicate<DocumentModel> exactMatchP;

    public ElasticSearchResultConsumer(CoreSession session, Predicate<DocumentModel> exactMatchP) {
      this.session = session;
      this.exactMatchP = exactMatchP;
    }

    private List<SearchResult> rez = new LinkedList<>();

    @Override
    public void accept(
        final SearchHit fields, final DocumentModel d) {

      if (d.isTrashed()) {
        return;
      }

      SearchResult sr = new SearchResult();
      sr.setId(d.getId());
      sr.setTitle(d.getTitle());
      sr.setPath(d.getPathAsString());

      // find the parent dialect, if there is one
      List<DocumentModel> parents = session.getParentDocuments(d.getRef());

      Optional.ofNullable(parents).orElse(new ArrayList<>()).stream().filter(p -> p
          .getType()
          .equalsIgnoreCase("FVDialect")).findFirst().ifPresent(p -> sr.setParentDialect(p.getId(),
          p.getName(),
          (String) p.getPropertyValue("fvdialect:short_url")));

      // need to load it from the DB to get the required fields
      DocumentModel dbDoc = session.getDocument(d.getRef());
      sr.setType(getFriendlyType(dbDoc));

      Object audio = dbDoc.getPropertyValue("fv:related_audio");
      if (audio != null) {
        if (audio instanceof String) {
          sr.getAudio().add((String) audio);
        }
        if (audio instanceof List) {
          for (Object s : (List) audio) {
            if (s != null) {
              if (s instanceof String) {
                sr.getAudio().add((String) s);
              } else {
                sr.getAudio().add(s.toString());
              }
            }
          }
        }
        if (audio instanceof Object[]) {
          for (Object s : (Object[]) audio) {
            if (s != null) {
              if (s instanceof String) {
                sr.getAudio().add((String) s);
              } else {
                sr.getAudio().add(s.toString());
              }
            }
          }
        }
      }

      List<Map<String, String>> definitions = (List<Map<String, String>>) dbDoc.getPropertyValue(
          "fv:definitions");

      for (Map<String, String> definition : definitions) {
        if (definition.containsKey("translation")) {
          String translation = definition.get("translation");
          sr.getTranslations().add(translation);
        }
      }
      if (this.exactMatchP != null) {
        sr.setExactMatch(this.exactMatchP.test(dbDoc));
      }

      if (fields != null) {
        sr.setScore(fields.getScore());
      }

      if (this.exactMatchP != null) {
        sr.setExactMatch(this.exactMatchP.test(dbDoc));
      }

      sr.setVisibility(StateUtils.stateToVisibility(dbDoc.getCurrentLifeCycleState()));

      rez.add(sr);
    }

    public List<SearchResult> getResults() {
      return rez;
    }
  }

  private static String getFriendlyType(DocumentModel dm) {

    switch (dm.getType()) {
      case "FVBook":
        return Optional.ofNullable(dm.getPropertyValue("fvbook:type")).orElse("book").toString();
      case "FVPhrase":
        return "phrase";
      case "FVWord":
        return "word";
      default:
        return "unknown";
    }

  }

}
