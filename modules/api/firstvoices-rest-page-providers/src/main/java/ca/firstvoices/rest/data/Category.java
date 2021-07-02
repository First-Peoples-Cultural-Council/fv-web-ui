package ca.firstvoices.rest.data;

import java.io.Serializable;

@SuppressWarnings("java:S1700")
public class Category implements Serializable {

  private final String id;
  private final String title;
  private final String type;
  private final String parentId;

  public enum CategoryTypes {
    WORD("WORDS"), PHRASE("PHRASES"), ALL("WORDS_AND_PHRASES");

    private final String value;

    CategoryTypes(String value) {
      this.value = value;
    }

    public String getValue() {
      return value;
    }
  }

  public Category(final String id, final String parentId, final String title, final String type) {
    this.id = id;
    this.title = title;
    this.type = type;
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

  public String getType() {
    return type;
  }
}
