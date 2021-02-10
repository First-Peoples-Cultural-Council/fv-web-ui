package ca.firstvoices.rest.data;

import java.io.Serializable;

@SuppressWarnings("java:S1700")
public class Category implements Serializable {

  private final String id;
  private final String title;
  private int entryCount;
  private final String parentId;

  public Category(
      final String id, final String parentId, final String title, final int entryCount) {
    this.id = id;
    this.title = title;
    this.entryCount = entryCount;
    this.parentId = parentId;
  }

  public String getParentId() {
    return parentId;
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

  public void incrementEntryCount(final int toAdd) {
    this.entryCount += toAdd;
  }
}

