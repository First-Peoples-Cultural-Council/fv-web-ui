package ca.firstvoices.rest.data;

import java.io.Serializable;

public class LabelCategory implements Serializable {

  private final String id;
  private final String parent;
  private final String label;


  public LabelCategory(final String id, final String parent, final String label) {
    this.id = id;
    this.parent = parent;
    this.label = label;
  }

  public String getId() {
    return id;
  }

  public String getLabel() {
    return label;
  }

  public String getParent() {
    return parent;
  }
}
