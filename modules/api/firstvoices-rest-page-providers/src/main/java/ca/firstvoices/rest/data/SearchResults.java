package ca.firstvoices.rest.data;

import java.io.Serializable;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class SearchResults implements Serializable {

  private String query;
  private SearchDomain domain;
  private DocumentTypes documentTypes;

  private final ResultStatistics statistics = new ResultStatistics();

  private final List<SearchResult> results = new LinkedList<>();

  public String getQuery() {
    return query;
  }

  public void setQuery(final String query) {
    this.query = query;
  }

  public SearchDomain getDomain() {
    return domain;
  }

  public void setDomain(final SearchDomain domain) {
    this.domain = domain;
  }

  public List<SearchResult> getResults() {
    return results;
  }

  public DocumentTypes getDocumentTypes() {
    return documentTypes;
  }

  public void setDocumentTypes(final DocumentTypes documentTypes) {
    this.documentTypes = documentTypes;
  }

  public ResultStatistics getStatistics() {
    return statistics;
  }


  public enum SearchDomain {
    BOTH("both"),
    ENGLISH("english"),
    LANGUAGE("language");

    SearchDomain(String value) {
      this.value = value;
    }

    private String value;
  }

  public enum DocumentTypes {
    WORD("word"),
    PHRASE("phrase"),
    BOOK("book"),
    WORDS_AND_PHRASES("words_and_phrases"),
    ALL("all");

    DocumentTypes(String value) {
      this.value = value;
    }

    private String value;
  }

  public class ResultStatistics implements Serializable {
    private long resultCount;

    public long getResultCount() {
      return resultCount;
    }

    public void setResultCount(final long resultCount) {
      this.resultCount = resultCount;
    }

    private final Map<String, Long> countsByType = new HashMap<>();

    public Map<String, Long> getCountsByType() {
      return countsByType;
    }
  }

}

