package ca.firstvoices.rest.data;

import java.io.Serializable;

@SuppressWarnings("java:S1700")
public class Label implements Serializable {

  private final String id;

  private final String label;
  private final String type;
  private final String category;
  private final String templateStrings;

  public Label(
      final String id, final String label, final String type, final String category,
      final String templateStrings) {
    this.id = id;
    this.label = label;
    this.type = type;
    this.category = category;
    this.templateStrings = templateStrings;
  }

  public String getCategory() {
    return category;
  }

  public String getLabel() {
    return label;
  }

  public String getTemplateStrings() {
    return templateStrings;
  }

  public String getType() {
    return type;
  }

  public String getId() {
    return id;
  }
}

