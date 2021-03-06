package ca.firstvoices.rest.data;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;
import javax.annotation.Nullable;


public class SearchResult implements Serializable {

  private List<String> audio = new LinkedList<>();
  private List<String> photos = new LinkedList<>();
  private List<String> videos = new LinkedList<>();

  private String type;

  private List<String> translations = new LinkedList<>();

  private String title;
  private String id;

  private float score;
  private String path;

  private String visibility;
  private Boolean availableInChildrensArchive;
  private Boolean availableInGames;

  private boolean exactMatch = false;

  private ParentDialect parentDialect = null;

  public float getScore() {
    return score;
  }

  public void setScore(final float score) {
    this.score = score;
  }

  public String getPath() {
    return path;
  }

  public void setPath(final String path) {
    this.path = path;
  }

  public String getType() {
    return type;
  }

  public void setType(final String type) {
    this.type = type;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(final String title) {
    this.title = title;
  }

  public String getId() {
    return id;
  }

  public void setId(final String id) {
    this.id = id;
  }

  public List<String> getTranslations() {
    return translations;
  }

  public List<String> getAudio() {
    return audio;
  }

  public List<String> getVideos() {
    return videos;
  }

  public List<String> getPhotos() {
    return photos;
  }

  @Nullable
  public ParentDialect getParentDialect() {
    return parentDialect;
  }

  public boolean isExactMatch() {
    return exactMatch;
  }

  public void setExactMatch(final boolean exactMatch) {
    this.exactMatch = exactMatch;
  }

  public String getVisibility() {
    return visibility;
  }

  public void setVisibility(String visibility) {
    this.visibility = visibility;
  }

  public Boolean isAvailableInChildrensArchive() {
    return availableInChildrensArchive;
  }

  public Boolean isAvailableInGames() {
    return availableInGames;
  }

  public void setAvailableInChildrensArchive(final @Nullable Boolean availableInChildrensArchive) {
    this.availableInChildrensArchive = availableInChildrensArchive;
  }

  public void setAvailableInGames(final @Nullable Boolean availableInGames) {
    this.availableInGames = availableInGames;
  }

  public void setParentDialect(String id, String name, String shortUrl) {
    this.parentDialect = new ParentDialect(id, name, shortUrl);
  }

  public class ParentDialect implements Serializable {

    private final String name;
    private final String id;
    private final String shortUrl;

    public ParentDialect(String id, String name, String shortUrl) {
      this.id = id;
      this.name = name;
      this.shortUrl = shortUrl;
    }

    public String getName() {
      return name;
    }

    public String getId() {
      return id;
    }

    public String getShortUrl() {
      return shortUrl;
    }
  }

}


