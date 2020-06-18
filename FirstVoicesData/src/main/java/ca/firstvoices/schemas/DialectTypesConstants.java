package ca.firstvoices.schemas;

/**
 * @author david
 */
public class DialectTypesConstants {

  // Dictionary Container, and sub-types
  public static final String FV_DICTIONARY = "FVDictionary";
  public static final String FV_WORD = "FVWord";
  public static final String FV_PHRASE = "FVPhrase";
  // Alphabet Container, and sub-types
  public static final String FV_ALPHABET = "FVAlphabet";
  public static final String FV_CHARACTER = "FVCharacter";
  // Categories Container, and sub-types
  public static final String FV_CATEGORIES = "FVCategories";
  public static final String FV_CATEGORY = "FVCategory";
  // Books, and sub-types
  public static final String FV_BOOK = "FVBook";
  public static final String FV_BOOKS = "FVBooks";
  //  Media Types
  public static final String FV_GALLERY = "FVGallery";
  public static final String FV_BOOK_ENTRY = "FVBookEntry";
  public static final String FV_AUDIO = "FVAudio";
  public static final String FV_PICTURE = "FVPicture";
  public static final String FV_VIDEO = "FVVideo";
  // Contributors
  public static final String FV_CONTRIBUTOR = "FVContributor";
  // Portal & Similar Types
  public static final String FV_LABEL = "FVLabel";
  public static final String FV_CONTRIBUTORS = "FVContributors";
  public static final String FV_LINK = "FVLink";
  public static final String FV_PORTAL = "FVPortal";
  public static final String FV_RESOURCES = "FVResources";
  public static final String FV_LINKS = "FVLinks";

  private DialectTypesConstants() {
    throw new IllegalStateException("Utility class");
  }
}
