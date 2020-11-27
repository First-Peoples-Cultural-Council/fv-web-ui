package ca.firstvoices.rest.data;

import java.io.Serializable;
import java.util.Set;

public class Site implements Serializable {

  private final String path;
  private final String uid;
  private final Set<String> roles;
  private final String title;
  private final String parentLanguageTitle;
  private final String logoId;

  public Site(
      final String path, final String uid, final Set<String> roles, final String title,
      final String parentLanguageTitle, final String logoId) {
    this.path = path;
    this.uid = uid;
    this.roles = roles;
    this.title = title;
    this.parentLanguageTitle = parentLanguageTitle;
    this.logoId = logoId;
  }

  public String getPath() {
    return path;
  }

  public String getUid() {
    return uid;
  }

  public Set<String> getRoles() {
    return roles;
  }

  public String getTitle() {
    return title;
  }

  public String getParentLanguageTitle() {
    return parentLanguageTitle;
  }

  public String getLogoId() {
    return logoId;
  }
}
