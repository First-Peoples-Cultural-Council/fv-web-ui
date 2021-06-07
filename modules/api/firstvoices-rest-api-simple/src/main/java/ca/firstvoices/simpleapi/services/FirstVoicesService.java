package ca.firstvoices.simpleapi.services;


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
import java.util.List;


public interface FirstVoicesService {

  Metadata<List<SiteOverview>> getSites(QueryBean queryParameters);

  Metadata<SiteDetailPublic> getSiteDetail(String siteID);

  Metadata<List<Word>> getWordsInSite(String siteID, QueryBean queryParameters);

  Metadata<List<Phrase>> getPhrasesInSite(String siteID, QueryBean queryParameters);

  Metadata<List<Story>> getStoriesInSite(String siteID, QueryBean queryParameters);

  Metadata<List<Song>> getSongsInSite(String siteID, QueryBean queryParameters);

  Metadata<List<Vocabulary>> getVocabularies(QueryBean queryParameters);

  Metadata<List<String>> getSharedCategories(QueryBean queryParameters);

  Metadata<List<Link>> getSharedLinks(QueryBean queryParameters);

  Metadata<List<Asset>> getSharedMedia(QueryBean queryParameters);

  Metadata<Asset> getSharedMediaDetail(String id);

  Metadata<List<SearchResult<HasID>>> doSearch(String q, QueryBean queryParameters);

  Metadata<Story> getStoryDetail(String id);

  Metadata<Song> getSongDetail(String id);

  Metadata<Phrase> getPhraseDetail(String id);

  Metadata<Word> getWordDetail(String id);

}
