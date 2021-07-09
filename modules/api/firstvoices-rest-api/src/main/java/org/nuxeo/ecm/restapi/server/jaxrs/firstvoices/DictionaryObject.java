package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import ca.firstvoices.rest.data.SearchResults;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.MultiMatchQueryBuilder;
import org.elasticsearch.index.query.PrefixQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.WildcardQueryBuilder;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.ecm.webengine.model.WebObject;

@WebObject(type = "dictionary")
@Produces(MediaType.APPLICATION_JSON)
public class DictionaryObject extends AbstractSearchlikeObject {

  @GET
  @Path("{dialect}")
  public Response getDictionary(
      @PathParam(value = "dialect") String dialect, @QueryParam(value = "q") String query,
      @QueryParam(value = "docType") @DefaultValue("WORD_AND_PHRASE") String docType,
      @QueryParam(value = "alphabetCharacter") String alphabetCharacter,
      @QueryParam(value = "category") String category,
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

    List<String> categoryIds = new ArrayList<>();


    try {
      DocumentModel dialectDocument = getContext().getCoreSession().getDocument(new IdRef(dialect));
      if (!"FVDialect".equals(dialectDocument.getType())) {
        throw new IllegalArgumentException("Not a dialect");
      }
      if (category != null && category.length() > 0) {
        DocumentModel categoryDocument = getContext().getCoreSession().getDocument(new IdRef(
            category));
        if (!"FVCategory".equals(categoryDocument.getType())) {
          throw new IllegalArgumentException("Not a category");
        }
        categoryIds.add(category);
        // expand child categories
        DocumentModelList categoryDOMList = getContext().getCoreSession().query(
            "Select * from FVCategory where ecm:isVersion=0 and "
                + "ecm:isTrashed=0 and ecm:parentId = " + NXQL.escapeString(category));
        for (DocumentModel subCategory : categoryDOMList) {
          categoryIds.add(subCategory.getId());
        }

      }
    } catch (Exception e) {
      throw new IllegalArgumentException();
    }

    SearchResults.DocumentTypes documentTypes = resolveDocumentTypesFromQueryString(docType);

    final SortOptions sortOptions = resolveSortOptionsFromQueryString(sortBy, sortAscending);

    SearchResults searchResults = new SearchResults();
    searchResults.setQuery(query);
    searchResults.setDocumentTypes(documentTypes);

    BoolQueryBuilder basicConstraints;

    basicConstraints = QueryBuilders.boolQuery().must(QueryBuilders.matchQuery("ecm:isVersion",
        false));

    basicConstraints = basicConstraints.must(typesQuery(documentTypes));
    Optional<WildcardQueryBuilder> ancestryContraints = ancestryQuery(dialect);
    if (ancestryContraints.isPresent()) {
      basicConstraints = basicConstraints.must(ancestryContraints.get());
    }

    if (!categoryIds.isEmpty()) {
      BoolQueryBuilder categoriesQuery = QueryBuilders.boolQuery();
      categoriesQuery.minimumShouldMatch(1);

      for (String categoryId : categoryIds) {
        categoriesQuery.should(QueryBuilders.matchQuery("category_ids", categoryId));
      }

      basicConstraints = basicConstraints.must(categoriesQuery);
    }

    BoolQueryBuilder combinedQuery = new BoolQueryBuilder().must(basicConstraints);

    if (query != null) {

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


      BoolQueryBuilder combinedLanguageQuery = QueryBuilders.boolQuery();
      combinedLanguageQuery = combinedLanguageQuery.should(languageQuery);
      combinedLanguageQuery = combinedLanguageQuery.should(englishQuery);
      combinedLanguageQuery = combinedLanguageQuery.should(exactMatchQuery);
      combinedLanguageQuery.minimumShouldMatch(1);

      combinedQuery.must(combinedLanguageQuery);
    }

    if (alphabetCharacter != null && alphabetCharacter.length() > 0) {
      String substitutedCharacter = null;

      DocumentModelList characterSearchResults = getContext().getCoreSession().query(

          "SELECT * " + "from FVCharacter where ecm:ancestorId = " + NXQL.escapeString(dialect)
              + " and " + "dc:title = " + NXQL.escapeString(alphabetCharacter) + " and "
              + "ecm:isVersion=0 and ecm:isTrashed=0 and ecm:isProxy=0");

      if (characterSearchResults.size() == 1) {
        DocumentModel fvchar = characterSearchResults.get(0);
        substitutedCharacter = (String) fvchar.getPropertyValue("fv:custom_order");

        if (substitutedCharacter != null) {
          PrefixQueryBuilder alphabetByCustomOrderQuery =
              QueryBuilders.prefixQuery("fv:custom_order", substitutedCharacter);
          combinedQuery.must(alphabetByCustomOrderQuery);
        }
      }

      if (substitutedCharacter == null) {
        PrefixQueryBuilder alphabetQuery =
            QueryBuilders.prefixQuery("dc:title", alphabetCharacter);
        combinedQuery.must(alphabetQuery);
      }
    }

    combinedQuery.must(audienceQuery(kidsOnly, gamesOnly));

    runSearch(searchResults,
        combinedQuery,
        perPage,
        offset,
        sortOptions,
        d -> query != null ? query.equals(d.getTitle()) : false);

    return Response.ok(searchResults).build();

  }

}
