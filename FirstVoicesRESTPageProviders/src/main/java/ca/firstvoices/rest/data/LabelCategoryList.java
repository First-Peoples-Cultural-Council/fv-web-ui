package ca.firstvoices.rest.data;

import java.io.Serializable;
import java.util.List;

public class LabelCategoryList implements Serializable {

  private final List<LabelCategory> categories;

  public LabelCategoryList(final List<LabelCategory> categories) {
    this.categories = categories;
  }

  public List<LabelCategory> getCategories() {
    return categories;
  }
}
