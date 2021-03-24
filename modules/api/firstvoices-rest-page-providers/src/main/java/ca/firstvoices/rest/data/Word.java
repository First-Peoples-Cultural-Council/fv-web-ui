package ca.firstvoices.rest.data;

import java.io.Serializable;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@SuppressWarnings("java:S1700")
public class Word implements Serializable {

  private final String id;
  private final String partOfSpeech;
  private final String title;
  private final Map<String,String> translations = new HashMap<>();
  private final List<RelatedMedia> relatedAudio = new LinkedList<>();


  public Word(final String id, final String partOfSpeech, final String title) {
    this.id = id;
    this.partOfSpeech = partOfSpeech;
    this.title = title;
  }

  public String getId() {
    return id;
  }

  public String getPartOfSpeech() {
    return partOfSpeech;
  }

  public String getTitle() {
    return title;
  }

  public Map<String, String> getTranslations() {
    return translations;
  }

  public List<RelatedMedia> getRelatedAudio() {
    return relatedAudio;
  }
}

