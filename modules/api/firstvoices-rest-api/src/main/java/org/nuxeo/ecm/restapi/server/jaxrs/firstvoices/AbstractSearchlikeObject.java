package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

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
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.WildcardQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.PropertyException;
import org.nuxeo.ecm.core.api.SortInfo;
import org.nuxeo.ecm.webengine.model.impl.DefaultObject;
import org.nuxeo.elasticsearch.api.ElasticSearchService;
import org.nuxeo.elasticsearch.api.EsResult;
import org.nuxeo.elasticsearch.fetcher.EsFetcher;
import org.nuxeo.elasticsearch.query.NxQueryBuilder;
import org.nuxeo.runtime.api.Framework;

public abstract class AbstractSearchlikeObject extends DefaultObject {

  protected static final String ECM_PRIMARY_TYPE = "ecm:primaryType";

  protected static String getFriendlyType(DocumentModel dm) {

    switch (dm.getType()) {
      case "FVBook":
        return Optional.ofNullable(dm.getPropertyValue("fvbook:type")).orElse("book").toString();
      case "FVPhrase":
        return "phrase";
      case "FVWord":
        return "word";
      default:
        return "unknown " + dm.getType();
    }
  }

  protected SearchResults.DocumentTypes resolveDocumentTypesFromQueryString(String docType) {
    try {
      return SearchResults.DocumentTypes.valueOf(docType);
    } catch (IllegalArgumentException e) {
      // just use the default
      return SearchResults.DocumentTypes.ALL;
    }
  }

  protected SearchResults.SearchDomain resolveDomainFromQueryString(String domain) {
    try {
      return SearchResults.SearchDomain.valueOf(domain);
    } catch (IllegalArgumentException e) {
      return SearchResults.SearchDomain.BOTH;
    }
  }


  protected SortOptions resolveSortOptionsFromQueryString(String ordering, boolean ascending) {
    SortOrdering sortOrdering = SortOrdering.ENTRY;

    try {
      sortOrdering = SortOrdering.valueOf(ordering);
    } catch (Exception e) {
      // just use default
    }

    SortOptions options = new SortOptions();
    options.ordering = sortOrdering;
    options.ascending = ascending;


    return options;
  }

  protected enum SortOrdering {
    ENTRY("entry", "fv:custom_order"), TRANSLATION("translation", "fv:definitions[0]/translation");

    private final String value;
    private final String column;

    SortOrdering(String value, String column) {
      this.value = value;
      this.column = column;
    }

    public String getValue() {
      return value;
    }

    public String getColumn() {
      return column;
    }
  }

  protected static class SortOptions {

    boolean ascending = true;
    SortOrdering ordering = SortOrdering.ENTRY;

  }

  protected BoolQueryBuilder typesQuery(SearchResults.DocumentTypes documentTypes) {

    BoolQueryBuilder typesQuery = QueryBuilders.boolQuery();
    typesQuery.minimumShouldMatch(1);

    switch (documentTypes) {

      case PHRASE:
        typesQuery.should(QueryBuilders.matchQuery(ECM_PRIMARY_TYPE, "FVPhrase"));
        break;
      case WORD:
        typesQuery.should(QueryBuilders.matchQuery(ECM_PRIMARY_TYPE, "FVWord"));
        break;
      case WORD_AND_PHRASE:
        typesQuery.should(QueryBuilders.matchQuery(ECM_PRIMARY_TYPE, "FVWord"));
        typesQuery.should(QueryBuilders.matchQuery(ECM_PRIMARY_TYPE, "FVPhrase"));
        break;
      case BOOK:
      case SONG_AND_STORY:
        typesQuery.must(QueryBuilders.matchQuery(ECM_PRIMARY_TYPE, "FVBook"));
        break;
      case SONG:
        typesQuery.must(QueryBuilders.matchQuery(ECM_PRIMARY_TYPE, "FVBook"));
        typesQuery.must(QueryBuilders.termQuery("fvbook:type", "song"));
        break;
      case STORY:
        typesQuery.must(QueryBuilders.matchQuery(ECM_PRIMARY_TYPE, "FVBook"));
        typesQuery.must(QueryBuilders.termQuery("fvbook:type", "story"));
        break;
      case ALL:
      default:
        typesQuery.should(QueryBuilders.matchQuery(ECM_PRIMARY_TYPE, "FVBook"));
        typesQuery.should(QueryBuilders.matchQuery(ECM_PRIMARY_TYPE, "FVPhrase"));
        typesQuery.should(QueryBuilders.matchQuery(ECM_PRIMARY_TYPE, "FVWord"));
        break;
    }

    return typesQuery;
  }


  protected BoolQueryBuilder audienceQuery(boolean kidsOnly, boolean gamesArchive) {

    BoolQueryBuilder typesQuery = QueryBuilders.boolQuery();

    if (kidsOnly) {
      typesQuery.must(QueryBuilders.termQuery("fvaudience:children", true));
    }
    if (gamesArchive) {
      typesQuery.must(QueryBuilders.termQuery("fvaudience:games", true));
    }

    return typesQuery;
  }

  protected Optional<WildcardQueryBuilder> ancestryQuery(String ancestorId) {
    String parent = null;
    CoreSession session = getContext().getCoreSession();

    if (ancestorId != null && ancestorId.trim().length() > 0) {
      //can't use ecm:ancestorId in ES, but we do have path
      DocumentModel dm = session.getDocument(new IdRef(ancestorId));
      if (dm != null) {
        parent = dm.getPathAsString();
      }
    }

    if (parent != null && parent.trim().length() > 0) {
      return Optional.of(QueryBuilders.wildcardQuery("ecm:path", parent + "*"));
    }

    return Optional.empty();
  }

  protected BoostFactors computeBoostFactors(SearchResults.SearchDomain searchDomain) {

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

    BoostFactors boostFactors = new BoostFactors();
    boostFactors.english = englishBoost;
    boostFactors.language = languageBoost;
    return boostFactors;

  }

  protected static class BoostFactors {

    float english = 0.0f;
    float language = 0.0f;
  }

  protected void runSearch(
      SearchResults searchResults, QueryBuilder finalQuery, int perPage, int offset) {
    runSearch(searchResults, finalQuery, perPage, offset, null, null);
  }

  protected void runSearch(
      SearchResults searchResults, QueryBuilder finalQuery, int perPage, int offset,
      SortOptions sort, Predicate<DocumentModel> exactMatchPredicate) {

    final CoreSession session = getContext().getCoreSession();
    final ElasticSearchService ess = Framework.getService(ElasticSearchService.class);

    NxQueryBuilder nxQueryBuilder = new NxQueryBuilder(session).esQuery(finalQuery);
    nxQueryBuilder.fetchFromElasticsearch();

    if (sort == null) {
      nxQueryBuilder.addSort(new SortInfo("_score", false));
    } else {
      nxQueryBuilder.addSort(new SortInfo(sort.ordering.column, sort.ascending));
    }


    nxQueryBuilder.limit(perPage);
    nxQueryBuilder.offset(offset);


    ElasticSearchResultConsumer consumer = new ElasticSearchResultConsumer(session,
        exactMatchPredicate);
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
      sr.setType(AbstractSearchlikeObject.getFriendlyType(dbDoc));
      try {
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
      } catch (PropertyException e) {
        // no action needed
      }


      try {
        List<Map<String, String>> definitions = (List<Map<String, String>>) dbDoc.getPropertyValue(
            "fv:definitions");

        for (Map<String, String> definition : definitions) {
          if (definition.containsKey("translation")) {
            String translation = definition.get("translation");
            sr.getTranslations().add(translation);
          }
        }
      } catch (PropertyException e) {
        // no action needed
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

      if (dbDoc.hasSchema("fvaudience")) {
        sr.setAvailableInGames((Boolean) dbDoc.getPropertyValue("fvaudience:games"));
        sr.setAvailableInChildrensArchive((Boolean) dbDoc.getPropertyValue("fvaudience:children"));
      }

      rez.add(sr);
    }

    public List<SearchResult> getResults() {
      return rez;
    }
  }


}
