package ca.firstvoices.rest.data;

import java.io.Serializable;

@SuppressWarnings("java:S1700")
public class Category implements Serializable {

  private final String id;
  private final String title;
  private final int entryCount;

  public Category(final String id, final String title, final int entryCount) {
    this.id = id;
    this.title = title;
    this.entryCount = entryCount;
  }

  public String getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public int getEntryCount() {
    return entryCount;
  }
}

