package ca.firstvoices.simpleapi.services;


import ca.firstvoices.simpleapi.model.QueryBean;
import ca.firstvoices.simpleapi.representations.ArchiveDetailPublic;
import ca.firstvoices.simpleapi.representations.ArchiveOverview;
import ca.firstvoices.simpleapi.representations.Asset;
import ca.firstvoices.simpleapi.representations.Link;
import ca.firstvoices.simpleapi.representations.Phrase;
import ca.firstvoices.simpleapi.representations.Song;
import ca.firstvoices.simpleapi.representations.Story;
import ca.firstvoices.simpleapi.representations.Vocabulary;
import ca.firstvoices.simpleapi.representations.Word;
import ca.firstvoices.simpleapi.representations.containers.Metadata;
import ca.firstvoices.simpleapi.representations.containers.SearchResult;
import ca.firstvoices.simpleapi.representations.traits.HasID;
import java.util.List;


public interface FirstVoicesService {

  Metadata<List<ArchiveOverview>> getArchives(QueryBean queryParameters);

  Metadata<ArchiveDetailPublic> getArchiveDetail(String archiveID);

  Metadata<List<Word>> getWordsInArchive(String archiveID, QueryBean queryParameters);

  Metadata<List<Phrase>> getPhrasesInArchive(String archiveID, QueryBean queryParameters);

  Metadata<List<Story>> getStoriesInArchive(String archiveID, QueryBean queryParameters);

  Metadata<List<Song>> getSongsInArchive(String archiveID, QueryBean queryParameters);

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
