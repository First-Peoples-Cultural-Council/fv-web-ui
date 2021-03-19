package ca.firstvoices.rest.data;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

@SuppressWarnings("java:S1700")
public class Character implements Serializable {

  private final String id;
  private final String title;

  private final List<Link> relatedLinks = new LinkedList<>();
  private final List<RelatedMedia> relatedAudio = new LinkedList<>();
  private final List<RelatedMedia> relatedPictures = new LinkedList<>();
  private final List<RelatedMedia> relatedVideo = new LinkedList<>();
  private final List<Word> relatedWords = new LinkedList<>();


  public List<Link> getRelatedLinks() {
    return relatedLinks;
  }

  public String getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public List<RelatedMedia> getRelatedAudio() {
    return relatedAudio;
  }

  public List<RelatedMedia> getRelatedPictures() {
    return relatedPictures;
  }

  public List<RelatedMedia> getRelatedVideo() {
    return relatedVideo;
  }

  public List<Word> getRelatedWords() {
    return relatedWords;
  }

  public Character(final String id, final String title) {
    this.id = id;
    this.title = title;
  }
}

