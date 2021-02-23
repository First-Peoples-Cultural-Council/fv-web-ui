package ca.firstvoices.rest.data;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

public class SearchResults implements Serializable {

  private int resultCount;
  private String query;
  private SearchDomain domain;

  private final List<SearchResult> results = new LinkedList<>();

  public int getResultCount() {
    return resultCount;
  }

  public void setResultCount(final int resultCount) {
    this.resultCount = resultCount;
  }

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

  public enum SearchDomain {
    BOTH("both"),
    ENGLISH("english"),
    LANGUAGE("language");

    SearchDomain(String value) {
      this.value = value;
    }

    private String value;
  }

}

