package ca.firstvoices.rest.data;

import java.io.Serializable;

@SuppressWarnings("java:S1700")
public class RelatedMedia implements Serializable {


  private final String id;
  private final String title;
  private final String mimeType;
  private final String url;

  public RelatedMedia(
      final String id, final String title, final String mimeType, final String url) {
    this.id = id;
    this.title = title;
    this.mimeType = mimeType;
    this.url = url;
  }

  public String getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public String getMimeType() {
    return mimeType;
  }

  public String getUrl() {
    return url;
  }
}

