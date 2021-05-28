package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import ca.firstvoices.rest.data.SearchResults;
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
import org.nuxeo.ecm.webengine.model.WebObject;

@WebObject(type = "dictionary")
@Produces(MediaType.APPLICATION_JSON)
public class DictionaryObject extends AbstractSearchlikeObject {

  @GET
  @Path("{dialect}")
  public Response getDictionary(
      @QueryParam(value = "q") String query, @QueryParam(value = "ancestorId") String ancestorId,
      @QueryParam(value = "alphabetCharacter") String alphabetCharacter,
      @QueryParam(value = "kidsOnly") @DefaultValue("false") boolean kidsOnly,
      @QueryParam(value = "gamesOnly") @DefaultValue("false") boolean gamesOnly,
      @QueryParam(value = "sortAscending") @DefaultValue("false") boolean sortAscending,
      @QueryParam(value = "sortBy") @DefaultValue("entry") String sortBy,
      @QueryParam(value = "perPage") @DefaultValue("25") Integer perPage,
      @QueryParam(value = "page") @DefaultValue("1") Integer from) {

    if (perPage > 100) {
      perPage = 100;
    }
    final int offset = (from - 1) * perPage;

    SearchResults.DocumentTypes documentTypes = SearchResults.DocumentTypes.WORD;
    //documentTypesFromQueryString(docType);

    final SortOptions sortOptions = resolveSortOptionsFromQueryString(sortBy, sortAscending);

    SearchResults searchResults = new SearchResults();
    searchResults.setQuery(query);
    searchResults.setDocumentTypes(documentTypes);

    BoolQueryBuilder basicConstraints;

    basicConstraints = QueryBuilders.boolQuery().must(QueryBuilders.matchQuery("ecm:isVersion",
        false));

    basicConstraints.must(typesQuery(documentTypes));
    ancestryQuery(ancestorId).ifPresent(q -> basicConstraints.must(q));

    QueryBuilder exactMatchQuery = QueryBuilders.multiMatchQuery(query,
        "ecm:fulltext_dictionary_all_field",
        "dc:title").analyzer("keyword").type(MultiMatchQueryBuilder.Type.PHRASE);

    QueryBuilder englishQuery = QueryBuilders
        .fuzzyQuery("exact_matches_translations", query)
        .fuzziness(Fuzziness.fromEdits(1))
        .transpositions(true);

    QueryBuilder languageQuery = QueryBuilders
        .fuzzyQuery("exact_matches_language", query)
        .fuzziness(Fuzziness.fromEdits(1))
        .transpositions(true);

    QueryBuilder combinedLanguageQuery = QueryBuilders.boolQuery().should(languageQuery).should(
        englishQuery).should(exactMatchQuery).minimumShouldMatch(1);

    QueryBuilder composedQuery = basicConstraints.must(combinedLanguageQuery);

    runSearch(searchResults, composedQuery, perPage, offset, sortOptions,
        d -> query.equals(d.getTitle()));

    return Response.ok(searchResults).build();

  }

}
