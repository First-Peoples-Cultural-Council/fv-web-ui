package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import static ca.firstvoices.rest.data.SearchResults.SearchDomain;
import ca.firstvoices.rest.data.SearchResult;
import ca.firstvoices.rest.data.SearchResults;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import javax.print.Doc;
import javax.swing.text.Document;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.BoolQueryBuilder;
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
      @QueryParam(value = "q") String query,
      @QueryParam(value = "parentPath") String parent,
      @QueryParam(value = "ancestorId") String ancestorId,
      @QueryParam(value = "docType") @DefaultValue("all") String docType,
      @QueryParam(value = "domain") @DefaultValue("both") String domain) {

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

    BoolQueryBuilder basicConstraints;

    BoolQueryBuilder typesQuery = QueryBuilders
        .boolQuery();

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

    typesQuery.minimumShouldMatch(1);

    basicConstraints = QueryBuilders.boolQuery().must(QueryBuilders.matchQuery("ecm:isVersion",
        false)).must(
            typesQuery
                    );

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

    QueryBuilder englishQuery = QueryBuilders
        .fuzzyQuery("exact_matches_translations", query)
        .fuzziness(Fuzziness.fromEdits(1))
        .transpositions(true);

    QueryBuilder languageQuery = QueryBuilders
        .fuzzyQuery("exact_matches_language", query)
        .fuzziness(Fuzziness.fromEdits(1))
        .transpositions(true);

    QueryBuilder combinedLanguageQuery = QueryBuilders.boolQuery().should(languageQuery).should(
        englishQuery).minimumShouldMatch(1);

    QueryBuilder scoredQuery = null;

    switch (searchDomain) {
      case ENGLISH:
        scoredQuery = QueryBuilders
            .boostingQuery(combinedLanguageQuery, languageQuery)
            .negativeBoost(0.25f);
        break;
      case LANGUAGE:
        scoredQuery = QueryBuilders
            .boostingQuery(combinedLanguageQuery, englishQuery)
            .negativeBoost(0.25f);
        break;
      case BOTH:
      default:
        scoredQuery = combinedLanguageQuery;
        break;
    }

    QueryBuilder composedQuery = basicConstraints.must(scoredQuery);

    NxQueryBuilder nxQueryBuilder = new NxQueryBuilder(session).esQuery(composedQuery);
    nxQueryBuilder.limit(100);
    nxQueryBuilder.fetchFromElasticsearch();
    nxQueryBuilder.addSort(new SortInfo("_score", false));
    ElasticSearchResultConsumer consumer = new ElasticSearchResultConsumer(session,
        d -> query.equals(d.getTitle()));
    nxQueryBuilder.hitDocConsumer(consumer);

    ess.query(nxQueryBuilder);

    searchResults.getResults().addAll(consumer.getResults());

    searchResults.getStatistics().setResultCount(searchResults.getResults().size());

    searchResults
        .getStatistics()
        .getCountsByType()
        .putAll(
        consumer
        .getResults()
        .stream()
        .collect(Collectors.groupingBy(SearchResult::getType, Collectors.counting()))
        );

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

      Optional
          .ofNullable(parents)
          .orElse(new ArrayList<>())
          .stream()
          .filter(p -> p.getType().equalsIgnoreCase("FVDialect"))
          .findFirst()
          .ifPresent(p -> sr.setParentDialect(p.getId(), p.getName(),
              (String)p.getPropertyValue("fvdialect:short_url")));

      // need to load it from the DB to get the required fields
      DocumentModel dbDoc = session.getDocument(d.getRef());
      sr.setType(getFriendlyType(dbDoc));

      Object pictures = dbDoc.getPropertyValue("fv:related_pictures");
      if (pictures != null) {
        if (pictures instanceof String) {
          sr.getPictures().add((String) pictures);
        }
        if (pictures instanceof List) {
          for (Object s : (List) pictures) {
            if (s != null) {
              if (s instanceof String) {
                sr.getPictures().add((String) s);
              } else {
                sr.getPictures().add(s.toString());
              }
            }
          }
        }
        if (pictures instanceof Object[]) {
          for (Object s : (Object[]) pictures) {
            if (s != null) {
              if (s instanceof String) {
                sr.getPictures().add((String) s);
              } else {
                sr.getPictures().add(s.toString());
              }
            }
          }
        }
      }

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
        if (definition.containsKey("language") && definition.containsKey("translation")) {
          String language = definition.get("language");
          String translation = definition.get("translation");
          sr.getTranslations().put(language, translation);
        }
      }
      if (this.exactMatchP != null) {
        sr.setExactMatch(this.exactMatchP.test(dbDoc));
      }

      if (fields != null) {
        sr.setScore(fields.getScore());
      }


      rez.add(sr);
    }

    public List<SearchResult> getResults() {
      return rez;
    }
  }

  private static String getFriendlyType(DocumentModel dm) {

    switch (dm.getType()) {
      case "FVBook":
        return Optional.ofNullable(dm.getPropertyValue("fvbook:type"))
                       .orElse("book").toString();
      case "FVPhrase":
        return "phrase";
      case "FVWord":
        return "word";
      default:
        return "unknown";
    }

  }

}
