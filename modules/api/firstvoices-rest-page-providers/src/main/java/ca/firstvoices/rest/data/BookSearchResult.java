package ca.firstvoices.rest.data;

public class BookSearchResult extends SearchResult {

  private String titleTranslation;
  private String author;
  private String introduction;
  private String introductionTranslation;
  private int pageCount = 0;


  public String getTitleTranslation() {
    return titleTranslation;
  }

  public void setTitleTranslation(final String titleTranslation) {
    this.titleTranslation = titleTranslation;
  }

  public String getAuthor() {
    return author;
  }

  public void setAuthor(final String author) {
    this.author = author;
  }

  public String getIntroduction() {
    return introduction;
  }

  public void setIntroduction(final String introduction) {
    this.introduction = introduction;
  }

  public String getIntroductionTranslation() {
    return introductionTranslation;
  }

  public void setIntroductionTranslation(final String introductionTranslation) {
    this.introductionTranslation = introductionTranslation;
  }

  public boolean isEmpty() {
    return pageCount == 0;
  }

  public int getPageCount() {
    return pageCount;
  }

  public void setPageCount(final int pageCount) {
    this.pageCount = pageCount;
  }
}
