package ca.firstvoices.rest.data;

import java.io.Serializable;
import java.util.List;

public class LabelList implements Serializable {

  private final List<Label> labels;

  public LabelList(final List<Label> labels) {
    this.labels = labels;
  }

  public List<Label> getLabels() {
    return labels;
  }

}
