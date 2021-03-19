package ca.firstvoices.rest.data;

import java.io.Serializable;

@SuppressWarnings("java:S1700")
public class Link implements Serializable {

  private final String id;
  private final String url;
  private final int sortOrder;

  public Link(final String id, final String url, final int sortOrder) {
    this.id = id;
    this.url = url;
    this.sortOrder = sortOrder;
  }

  public String getId() {
    return id;
  }

  public int getSortOrder() {
    return sortOrder;
  }

  public String getUrl() {
    return url;
  }
}

