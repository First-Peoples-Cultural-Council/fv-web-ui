package ca.firstvoices.rest.data;

import java.io.Serializable;
import java.util.List;

public class CategoryList implements Serializable {

  private final List<Category> categories;

  public CategoryList(final List<Category> categories) {
    this.categories = categories;
  }

  public List<Category> getCategories() {
    return categories;
  }
}
