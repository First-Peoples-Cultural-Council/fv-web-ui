package ca.firstvoices.data.schemas;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @author david
 */
public class DialectTypesConstants {

  // Dictionary Container, and sub-types
  public static final String FV_DICTIONARY = "FVDictionary";
  public static final String FV_DICTIONARY_NAME = "Dictionary";
  public static final String FV_WORD = "FVWord";
  public static final String FV_PHRASE = "FVPhrase";

  // Alphabet Container, and sub-types
  public static final String FV_ALPHABET = "FVAlphabet";
  public static final String FV_ALPHABET_NAME = "Alphabet";
  public static final String FV_CHARACTER = "FVCharacter";

  // Categories Container, and sub-types
  public static final String FV_CATEGORIES = "FVCategories";
  public static final String FV_CATEGORY = "FVCategory";

  // Books (Songs and Stories), and sub-types
  public static final String FV_BOOKS = "FVBooks";
  public static final String FV_BOOK = "FVBook";
  public static final String FV_BOOK_ENTRY = "FVBookEntry";

  // Links, and sub-types
  public static final String FV_LINKS = "FVLinks";
  public static final String FV_LINK = "FVLink";

  // Resources, and sub-types
  public static final String FV_RESOURCES = "FVResources";
  public static final String FV_AUDIO = "FVAudio";
  public static final String FV_PICTURE = "FVPicture";
  public static final String FV_VIDEO = "FVVideo";

  // Contributors
  public static final String FV_CONTRIBUTORS = "FVContributors";
  public static final String FV_CONTRIBUTOR = "FVContributor";

  // FVLabel (Translatable Document in immersion portal)
  public static final String FV_LABEL = "FVLabel";
  public static final String FV_LABEL_DICTIONARY = "FVLabelDictionary";

  // Portal & Gallery
  public static final String FV_PORTAL = "FVPortal";
  public static final String FV_PORTAL_NAME = "Portal";
  public static final String FV_GALLERY = "FVGallery";

  /**
   * Core types make up most of the language data created by communities
   * These are songs, story (FVBook), word or phrase
   * @return the core types in FirstVoices
   */
  public static List<String> getCoreTypes() {
    return new ArrayList<>(
        Arrays.asList(FV_WORD, FV_PHRASE, FV_BOOK));
  }

  private DialectTypesConstants() {
    throw new IllegalStateException("Utility class");
  }
}
