package ca.firstvoices.simpleapi.services;

import ca.firstvoices.simpleapi.exceptions.NotFoundException;
import ca.firstvoices.simpleapi.exceptions.NotImplementedException;
import ca.firstvoices.simpleapi.model.AnnotationNuxeoMapper;
import ca.firstvoices.simpleapi.model.QueryBean;
import ca.firstvoices.simpleapi.representations.Asset;
import ca.firstvoices.simpleapi.representations.Link;
import ca.firstvoices.simpleapi.representations.Phrase;
import ca.firstvoices.simpleapi.representations.SiteDetailPublic;
import ca.firstvoices.simpleapi.representations.SiteOverview;
import ca.firstvoices.simpleapi.representations.Song;
import ca.firstvoices.simpleapi.representations.Story;
import ca.firstvoices.simpleapi.representations.Vocabulary;
import ca.firstvoices.simpleapi.representations.Word;
import ca.firstvoices.simpleapi.representations.containers.Metadata;
import ca.firstvoices.simpleapi.representations.containers.SearchResult;
import ca.firstvoices.simpleapi.representations.traits.HasID;
import com.google.inject.Singleton;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import javax.security.auth.login.LoginException;
import org.nuxeo.ecm.core.api.CloseableCoreSession;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.query.api.PageProvider;
import org.nuxeo.ecm.platform.query.api.PageProviderService;
import org.nuxeo.ecm.platform.query.nxql.CoreQueryDocumentPageProvider;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.transaction.TransactionHelper;

@Singleton
public class NuxeoFirstVoicesServiceImplementation implements FirstVoicesService {

  private static final Logger log = Logger.getLogger(
      NuxeoFirstVoicesServiceImplementation.class.getCanonicalName()
  );

  private static class ResponseHelper<X> {
    private Metadata<X> singleResponse;
    private Metadata<List<X>> listResponse;

    public ResponseHelper(
        Class<X> resultClass,
        String ppName,
        String detailType,
        QueryBean queryParams,
        Map<String, String> extraQueries,
        boolean isList,
        Object... params
    ) {
      try {
        Framework.login();
      } catch (LoginException e) {
        log.severe("Caught an exception logging in" + e);
      }
      TransactionHelper.startTransaction();

      try (CloseableCoreSession session = CoreInstance.openCoreSession(null)) {

        Map<String, Serializable> props = new HashMap<>();
        props.put(
            CoreQueryDocumentPageProvider.CORE_SESSION_PROPERTY,
            (Serializable) session
        );
        PageProviderService pageProviderService = Framework.getService(PageProviderService.class);

        PageProvider<DocumentModel> pageProvider = (PageProvider<DocumentModel>) pageProviderService
            .getPageProvider(ppName, null, null, null, props, params);

        if (isList) {
          pageProvider.setPageSize(queryParams.pageSize);
          pageProvider.setCurrentPage(queryParams.index);
        } else {
          pageProvider.setPageSize(PageProvider.DEFAULT_MAX_PAGE_SIZE);
        }

        List<DocumentModel> results = pageProvider.getCurrentPage();


        if (isList) {
          Metadata<List<X>> md = new Metadata<>();
          md.setCount(pageProvider.getResultsCount());
          md.setDetailType(detailType);
          md.setStatus(pageProvider.hasError() ? "error" : "success");
          md.setDetail(results.stream().map(
              dm -> AnnotationNuxeoMapper.mapFrom(resultClass, dm)).collect(Collectors.toList())
          );
          this.listResponse = md;
        } else {
          if (results.isEmpty()) {
            throw new NotFoundException();
          }
          Metadata<X> md = new Metadata<>();
          md.setCount(pageProvider.getResultsCount());
          md.setDetailType(detailType);
          md.setStatus(pageProvider.hasError() ? "error" : "success");

          Map<String, List<DocumentModel>> extraQueryResults = new HashMap<>();

          extraQueries.forEach((name, pp) -> {
                PageProvider<DocumentModel> subQueryPP;
                subQueryPP = (PageProvider<DocumentModel>) pageProviderService
                    .getPageProvider(pp, null, null, null, props, params);
                subQueryPP.setPageSize(pageProvider.getMaxPageSize());
                List<DocumentModel> subQueryResults = subQueryPP.getCurrentPage();
                extraQueryResults.put(name, new ArrayList<>(subQueryResults));
              }
          );

          results.stream().findFirst().ifPresent(dm ->
              md.setDetail(AnnotationNuxeoMapper.mapFrom(resultClass, dm, extraQueryResults))
          );

          this.singleResponse = md;
        }

        TransactionHelper.commitOrRollbackTransaction();
      }
    }

    public Metadata<List<X>> list() {
      return this.listResponse;

    }

    public Metadata<X> single() {
      return this.singleResponse;
    }

  }

  @Override
  public Metadata<List<SiteOverview>> getSites(QueryBean queryParameters) {

    return new ResponseHelper<>(
        SiteOverview.class,
        "LIST_SITES_PP",
        "site",
        queryParameters,
        Collections.emptyMap(),
        true
    ).list();

  }

  @Override
  public Metadata<SiteDetailPublic> getSiteDetail(String siteID) {
    Map<String, String> extraQueries = new HashMap<>();
    extraQueries.put("links", "LINKS_IN_SITE_PP");

    return new ResponseHelper<>(
        SiteDetailPublic.class,
        "GET_SITE_PP",
        "site",
        null,
        extraQueries,
        false,
        siteID
    ).single();
  }

  @Override
  public Metadata<List<Word>> getWordsInSite(
      String siteID,
      QueryBean queryParameters
  ) {
    return new ResponseHelper<>(Word.class,
        "WORDS_IN_SITE_PP",
        "word",
        queryParameters,
        Collections.emptyMap(),
        true,
        siteID
    ).list();
  }

  @Override
  public Metadata<List<Phrase>> getPhrasesInSite(String siteID, QueryBean queryParameters) {
    return new ResponseHelper<>(Phrase.class,
        "PHRASES_IN_SITE_PP",
        "phrase",
        queryParameters,
        Collections.emptyMap(),
        true,
        siteID).list();
  }

  @Override
  public Metadata<List<Story>> getStoriesInSite(String siteID, QueryBean queryParameters) {
    return new ResponseHelper<>(Story.class,
        "STORIES_IN_SITE_PP",
        "story",
        queryParameters,
        Collections.emptyMap(),
        true,
        siteID).list();

  }

  @Override
  public Metadata<List<Song>> getSongsInSite(String siteID, QueryBean queryParameters) {
    return new ResponseHelper<>(Song.class,
        "SONGS_IN_SITE_PP",
        "song",
        queryParameters,
        Collections.emptyMap(),
        true,
        siteID).list();
  }

  @Override
  public Metadata<List<Vocabulary>> getVocabularies(QueryBean queryParameters) {
    return new ResponseHelper<>(Vocabulary.class,
        "LIST_VOCABULARIES_PP",
        "vocabulary",
        queryParameters,
        Collections.emptyMap(),
        true).list();
  }


  @Override
  public Metadata<List<String>> getSharedCategories(QueryBean queryParameters) {
    return new ResponseHelper<>(String.class,
        "LIST_SHARED_CATEGORIES_PP",
        "string",
        queryParameters,
        Collections.emptyMap(),
        true).list();
  }

  @Override
  public Metadata<List<Link>> getSharedLinks(QueryBean queryParameters) {
    return new ResponseHelper<>(Link.class,
        "LIST_SHARED_LINKS_PP",
        "link",
        queryParameters,
        Collections.emptyMap(),
        true).list();
  }

  @Override
  public Metadata<List<Asset>> getSharedMedia(QueryBean queryParameters) {
    return new ResponseHelper<>(Asset.class,
        "LIST_SHARED_ASSETS_PP",
        "asset",
        queryParameters,
        Collections.emptyMap(),
        true).list();
  }

  @Override
  public Metadata<Asset> getSharedMediaDetail(String id) {
    return new ResponseHelper<>(Asset.class,
        "GET_SHARED_ASSET_PP",
        "asset",
        null,
        Collections.emptyMap(),
        false,
        id).single();
  }

  @Override
  public Metadata<List<SearchResult<HasID>>> doSearch(String q, QueryBean queryParameters) {
    throw new NotImplementedException();
  }

  @Override
  public Metadata<Story> getStoryDetail(String id) {
    return new ResponseHelper<>(Story.class,
        "GET_STORY_PP",
        "story",
        null,
        Collections.emptyMap(),
        false,
        id).single();
  }

  @Override
  public Metadata<Song> getSongDetail(String id) {
    return new ResponseHelper<>(Song.class,
        "GET_SONG_PP",
        "song",
        null,
        Collections.emptyMap(),
        false,
        id).single();
  }

  @Override
  public Metadata<Phrase> getPhraseDetail(String id) {
    return new ResponseHelper<>(Phrase.class,
        "GET_PHRASE_PP",
        "phrase",
        null,
        Collections.emptyMap(),
        false,
        id).single();
  }

  @Override
  public Metadata<Word> getWordDetail(String id) {
    return new ResponseHelper<>(Word.class,
        "GET_WORD_PP",
        "word",
        null,
        Collections.emptyMap(),
        false,
        id).single();
  }

}
