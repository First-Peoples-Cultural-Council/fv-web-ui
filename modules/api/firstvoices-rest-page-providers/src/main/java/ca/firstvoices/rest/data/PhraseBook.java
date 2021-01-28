package ca.firstvoices.rest.data;

import java.io.Serializable;

@SuppressWarnings("java:S1700")
public class PhraseBook implements Serializable {

  private final String id;
  private final String title;
  private final int entryCount;

  public PhraseBook(final String id, final String title, final int entryCount) {
    this.id = id;
    this.title = title;
    this.entryCount = entryCount;
  }

  public String getTitle() {
    return title;
  }

  public String getId() {
    return id;
  }

  public int getEntryCount() {
    return entryCount;
  }
}

