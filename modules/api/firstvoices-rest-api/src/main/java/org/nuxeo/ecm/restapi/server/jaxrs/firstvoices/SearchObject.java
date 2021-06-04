package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import static ca.firstvoices.rest.data.SearchResults.SearchDomain;
import ca.firstvoices.rest.data.SearchResults;
import java.util.Optional;
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
import org.elasticsearch.index.query.WildcardQueryBuilder;
import org.nuxeo.ecm.webengine.model.WebObject;

@WebObject(type = "customSearch")
@Produces(MediaType.APPLICATION_JSON)
public class SearchObject extends AbstractSearchlikeObject {

  @GET
  @Path("")
  public Response doSearch(
      @QueryParam(value = "q") String query,
      @QueryParam(value = "ancestorId") String ancestorId,
      @QueryParam(value = "docType") @DefaultValue("all") String docType,
      @QueryParam(value = "domain") @DefaultValue("both") String domain,
      @QueryParam(value = "perPage") @DefaultValue("25") Integer perPage,
      @QueryParam(value = "page") @DefaultValue("1") Integer from) {

    if (perPage > 100) {
      perPage = 100;
    }
    final int offset = (from - 1) * perPage;


    SearchDomain searchDomain = resolveDomainFromQueryString(domain);
    SearchResults.DocumentTypes documentTypes = resolveDocumentTypesFromQueryString(docType);

    SearchResults searchResults = new SearchResults();
    searchResults.setQuery(query);
    searchResults.setDomain(searchDomain);
    searchResults.setDocumentTypes(documentTypes);

    BoolQueryBuilder basicConstraints;

    basicConstraints = QueryBuilders.boolQuery().must(QueryBuilders.matchQuery("ecm:isVersion",
        false));

    basicConstraints.must(typesQuery(documentTypes));
    Optional<WildcardQueryBuilder> ancestryContraints = ancestryQuery(ancestorId);
    if (ancestryContraints.isPresent()) {
      basicConstraints = basicConstraints.must(ancestryContraints.get());
    }

    QueryBuilder exactMatchQuery = QueryBuilders.multiMatchQuery(query,
        "ecm:fulltext_dictionary_all_field",
        "dc:title").analyzer("keyword").type(MultiMatchQueryBuilder.Type.PHRASE).boost(1.3f);

    QueryBuilder exactTitleMatch = QueryBuilders.matchQuery("ecm:title.lowercase",
        query.toLowerCase()).boost(1.2f);

    QueryBuilder phraseQuery = QueryBuilders.matchPhraseQuery("ecm:fulltext_dictionary_all_field",
        query).boost(1.5f);

    BoostFactors boostFactors = computeBoostFactors(searchDomain);

    QueryBuilder englishQuery = QueryBuilders
        .fuzzyQuery("exact_matches_translations", query)
        .fuzziness(Fuzziness.fromEdits(1))
        .transpositions(true)
        .boost(boostFactors.english);

    QueryBuilder languageQuery = QueryBuilders
        .fuzzyQuery("exact_matches_language", query)
        .fuzziness(Fuzziness.fromEdits(1))
        .transpositions(true)
        .boost(boostFactors.language);

    QueryBuilder combinedLanguageQuery = QueryBuilders
        .boolQuery()
        .should(languageQuery)
        .should(englishQuery)
        .should(exactMatchQuery)
        .should(exactTitleMatch)
        .should(phraseQuery)
        .minimumShouldMatch(1);


    QueryBuilder composedQuery = basicConstraints.must(combinedLanguageQuery);

    runSearch(searchResults, composedQuery, perPage, offset, null, d -> query.equals(d.getTitle()));

    return Response.ok(searchResults).build();
  }


}
