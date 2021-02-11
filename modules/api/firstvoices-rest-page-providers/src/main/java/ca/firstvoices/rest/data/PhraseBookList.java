package ca.firstvoices.rest.data;

import java.io.Serializable;
import java.util.List;

public class PhraseBookList implements Serializable {

  private final List<PhraseBook> phraseBooks;

  public PhraseBookList(final List<PhraseBook> p) {
    this.phraseBooks = p;
  }

  public List<PhraseBook> getPhraseBooks() {
    return phraseBooks;
  }
}
