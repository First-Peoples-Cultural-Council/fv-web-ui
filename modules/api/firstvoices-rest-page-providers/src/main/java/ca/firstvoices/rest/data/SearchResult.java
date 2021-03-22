package ca.firstvoices.rest.data;

import java.io.Serializable;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.annotation.Nullable;


public class SearchResult implements Serializable {

  private List<String> audio = new LinkedList<>();
  private List<String> pictures = new LinkedList<>();

  private String type;

  private Map<String, String> translations = new HashMap<>();

  private String title;
  private String id;

  private float score;
  private String path;

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

  public Map<String, String> getTranslations() {
    return translations;
  }

  public List<String> getAudio() {
    return audio;
  }

  public List<String> getPictures() {
    return pictures;
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

  public void setParentDialect(String id, String name) {
    this.parentDialect = new ParentDialect(id, name);
  }

  public class ParentDialect implements Serializable {
    private final String name;
    private final String id;

    public ParentDialect(String id, String name) {
      this.id = id;
      this.name = name;
    }

    public String getName() {
      return name;
    }

    public String getId() {
      return id;
    }

  }

}

