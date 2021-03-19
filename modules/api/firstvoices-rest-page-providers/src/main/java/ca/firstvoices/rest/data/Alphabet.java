package ca.firstvoices.rest.data;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

@SuppressWarnings("java:S1700")
public class Alphabet implements Serializable {

  public Alphabet(final String id) {
    this.id = id;
  }

  private final String id;
  private final List<Link> relatedLinks = new LinkedList<>();
  private final List<Character> characters = new LinkedList<>();

  public List<Link> getRelatedLinks() {
    return relatedLinks;
  }

  public List<Character> getCharacters() {
    return characters;
  }

  public String getId() {
    return id;
  }
}

