package ca.firstvoices.rest.data;

import java.io.Serializable;
import java.util.List;

public class SiteList implements Serializable {

  private final List<Site> sites;

  public SiteList(final List<Site> sites) {
    this.sites = sites;
  }

  public List<Site> getSites() {
    return sites;
  }

}
