package mappers;

import com.opencsv.CSVReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.nuxeo.client.NuxeoClient;
import org.nuxeo.client.cache.ResultCacheInMemory;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.objects.Documents;
import org.nuxeo.client.objects.Repository;

public class CsvValidator {

  protected static final ArrayList<String> TFVALUES = new ArrayList<String>() {
    {
      add("1");
      add("0");
      add("true");
      add("false");
    }
  };

  private static final String[] POS_VALUES = new String[]{"basic", "verb", "noun", "pronoun",
      "adjective", "adverb", "preposition", "conjunction",
      "interjection", "particle", "advanced", "pronoun_personal", "pronoun_reflexive",
      "pronoun_reciprocal",
      "pronoun_demonstrative", "pronoun_relative", "particle_postposition", "particle_quantifier",
      "particle_article_determiner", "particle_tense_aspect", "particle_modal",
      "particle_conjunction",
      "particle_auxiliary_verb", "particle_adjective", "particle_adverb", "entity_noun_like_word",
      "event_activity_verb_like_word", "event_activity_verb_like_word_transitive",
      "event_activity_verb_like_word_intransitive",
      "event_activity_verb_like_word_reflexive", "event_activity_verb_like_word_reciprocal",
      "question_word", "suffix_prefix",
      "affirmation", "transitive_verb", "intransitive_verb", "connective", "connective_irrealis",
      "demonstrative", "interrogative",
      "modifier_noun", "modifier_verb", "negation", "number", "plural_marker", "question_marker",
      "question_word", "tense_aspect"};
  private static final Set<String> POS = new HashSet<>(Arrays.asList(POS_VALUES));
  protected HashMap<String, ArrayList<String>> invalid = new HashMap<>();
  protected List<String> trueOrFalse = new ArrayList<>();
  protected InputStreamReader fileReader;
  protected CSVReader csvReader;
  protected NuxeoClient client;
  protected Documents categories = null;
  protected Documents sharedCategories;
  protected Documents words;


  public CsvValidator(String nuxeoUrl, String nuxeoUser, String nuxeoPassword, String csvFile,
      String dialectID, String languagePath) throws IOException {
    if (csvFile != null && !csvFile.isEmpty()) {
      fileReader = new InputStreamReader(new FileInputStream(csvFile), StandardCharsets.UTF_8);
      csvReader = new CSVReader(fileReader, ',', '"', '\0');
    }

    // Connect to Nuxeo instance
    client = new NuxeoClient.Builder()
        .cache(new ResultCacheInMemory())
        .url(nuxeoUrl)
        .authentication(nuxeoUser, nuxeoPassword)
        .connect();

    trueOrFalse.add("INCLUDE_IN_GAMES");
    trueOrFalse.add("CHILD_FRIENDLY");
    trueOrFalse.add("_SHARED_WITH_OTHER_DIALECTS");
    trueOrFalse.add("_CHILD_FOCUSED");

    // If path to language is given as a parameter then get the ID and set dialectID to that ID
    if (languagePath != null) {
      Repository repository = client.repository();
      Document folder = repository.fetchDocumentByPath("/FV/Workspaces/Data/" + languagePath);
      dialectID = folder.getUid();
    }

    getData(dialectID);
  }

  public HashMap<String, ArrayList<String>> validate(String path, int limit) throws IOException {
    String[] header = csvReader.readNext();
    LinkedList<String> headerList = new LinkedList<String>(Arrays.asList(header));

    headerList.removeIf(item -> item == null || "".equals(item));

    String[] fileTypes = {"AUDIO", "VIDEO", "IMG"};
    String[] nextLine;
    Map<String, Integer> filesRead = new HashMap<>();
    int lineNumber = 0;
    String columnHeader;

    Map<String, String[]> rowsProcessed = new TreeMap<String, String[]>();

    while ((nextLine = csvReader.readNext()) != null) {
      filesRead.clear();
      int columnCount = 0;
      lineNumber++;

      // Add to rows processed if not a duplicate --- Comment out line 96 and 98-102 if
      // duplicates wanted
      if (!rowsProcessed.containsKey(nextLine[0])) {
        rowsProcessed.put(nextLine[0], nextLine);

      // This is a duplicate within the CSV file - mark as such
      } else {
        addToInvalid("Duplicates",
            "Cannot upload duplicate words in CSV: line " + (lineNumber + 1) + ", " + nextLine[0]);
      }

      // Review column values for each row
      for (String column : nextLine) {

        // Check for a mismatch between HEADER columns and ROW COLUMNS
        if (columnCount >= headerList.size()) {
          addToInvalid("Header/Row Mismatch",
              "Found more data than expected on Line " + (lineNumber + 1) + " (expecting "
                  + headerList.size() + " values)");
          break;
        }

        columnHeader = header[columnCount];

        for (String type : fileTypes) {
          if (header[columnCount].startsWith(type)) {
            columnHeader = header[columnCount].substring(type.length());
          }
        }

        // Disable if duplicate words need to be added as well as WordMapper line 123 and below
        // This checks for duplicates against the remote DB, not within the CSV
        if (columnHeader.equals("WORD")) {
          checkWordDuplicate(column, lineNumber);
        }

        if (columnHeader.equals("CATEGORIES") && categories != null) {
          checkCategoryExists(column, lineNumber);
        }

        if (trueOrFalse.contains(columnHeader) && !column.equals("")) {
          if (!TFVALUES.contains(column)) {
            addToInvalid("Invalid Types",
                "Only true/false allowed, but found " + column + " in Column "
                    + header[columnCount]
                    + ", " + "Line " + (lineNumber + 1));
          }
        }

        if (header[columnCount].endsWith("_FILENAME") && !column.equals("")) {
          checkFileExists(path + column, header[columnCount], lineNumber, column);
          if (header[columnCount].matches(".*\\d+.*")) {
            Pattern r = Pattern.compile("(.*)(\\d+)(.*)");
            Matcher m = r.matcher(header[columnCount]);
            if (m.matches()) {
              String title = m.group(1);
              int num = Integer.parseInt(m.group(2));

              /* Check that the number of previously read files matches the number in the
              heading. Disable if Team is leaving out AUDIO_FILENAME intentionally */
              if (filesRead.get(title) != num - 1) {
                addToInvalid("File number Mismatch",
                    header[columnCount] + " is given without other number files: line " + (
                        lineNumber + 1) + ", " + column);
              } else {
                filesRead.put(title, num);
              }
            }
          } else {
            filesRead
                .put(header[columnCount].substring(0, header[columnCount].indexOf("FILENAME")), 1);
          }
        }

        if (columnHeader.equals("USERNAME")) {
          checkUserExists(column, lineNumber);
        }

        columnCount++;
      }

      // If limit is reached, skip the next iteration
      if (limit != 0 && lineNumber == limit) {
        break;
      }
    }
    return invalid;
  }

  private void checkFileExists(String path, String header, int line, String word) {
    File temp = new File(path.trim());
    File tempWithMp3 = new File(path.replace("wav", "mp3"));

    if (!temp.exists()) {
      if (tempWithMp3.exists()) {
        addToInvalid("Audio Issues",
            "Wrong extension for file " + word + " in Column " + header + ", " + "Line " + (line
                + 1));
      } else {
        addToInvalid("Audio Issues",
            "Missing file " + word + " in Column " + header + ", " + "Line " + (line + 1));
      }
    }
  }

  private void checkPartsOfSpeech(String pos, int line) throws IOException {
    String temppos = pos.toLowerCase();
    if (!temppos.equals(pos)) {
      addToInvalid("Parts of Speech",
          "Parts of speech must be written in lowercase: line " + (line + 1) + ", " + pos);
    }
    temppos = temppos.replaceAll("/ -(),", "_");
    if (!POS.contains(temppos)) {
      addToInvalid("Parts of Speech",
          "Only existing parts of speech are supported: line " + (line + 1) + ", " + pos);
    }
  }

  private void checkUserExists(String user, int line) throws IOException {
    if (user.equals("")) {
      addToInvalid("Missing required fields",
          "Username must be filled in: line " + (line + 1) + ", " + user);
    }

  }

  private void getData(String dialect) throws IOException {

    // Get the directory id for the dialect categories
    Documents dialectCategoriesDirectory = client.operation("Repository.Query")
        .param("query", "SELECT * FROM FVCategories "
            + "WHERE fva:dialect = '" + dialect + "' "
            + "AND ecm:path STARTSWITH '/FV/Workspaces/' "
            + "AND dc:title = 'Categories' "
            + "AND ecm:isTrashed = 0 "
            + "AND ecm:isVersion = 0")
        .execute();
    List<Document> documentsList = dialectCategoriesDirectory.streamEntries()
        .collect(Collectors.toList());

    if (documentsList.size() > 0) {
      Document categoriesDirectory = documentsList.get(0);
      String categoriesDirectoryId = categoriesDirectory.getId();
      categories = client.operation("Repository.Query").param("query",
          "SELECT * FROM FVCategory WHERE ecm:ancestorId = '" + categoriesDirectoryId
              + "'AND ecm:isTrashed = 0 "
              + "AND ecm:isVersion = 0 "
              + "AND ecm:isProxy = 0 "
              + "AND ecm:isProxy = 0")
          .execute();
    }

    words = client.operation("Repository.Query").param("query",
        "SELECT * FROM FVWord WHERE fva:dialect = '" + dialect
            + "' AND ecm:isTrashed = 0 AND ecm:isVersion = 0 AND ecm:isProxy = 0")
        .execute();

    sharedCategories = client.operation("Repository.Query").param("query",
        "SELECT * FROM FVCategory WHERE fva:dialect IS NULL AND ecm:isTrashed = 0 AND "
            + "ecm:isVersion = 0 AND ecm:isProxy = 0")
        .execute();


  }

  private void checkCategoryExists(String w, int line) {
    Boolean match = false;
    String[] temp;

    if (w.contains(",")) {
      temp = w.split(",");
      for (String word : temp) {

        // Fail on space between categories
        if (word.startsWith(" ")) {
          word = word.trim();
        }

        if (!word.isEmpty()) {
          for (Document d : categories.getDocuments()) {
            String title = d.getTitle();
            if (word.contentEquals(title)) {
              match = true;
              break;
            }
          }

          for (Document d : sharedCategories.getDocuments()) {
            String title = d.getTitle();
            if (word.contentEquals(title)) {
              match = true;
              break;
            }
          }

          if (!match) {
            addToInvalid("Missing Categories",
                "Only existing categories allowed: " + word + " in line " + (line + 1));
          }
        }
      }
    } else if (!w.isEmpty()) {
      for (Document d : categories.getDocuments()) {
        String title = d.getTitle();
        if (w.contentEquals(title)) {
          match = true;
          break;
        }
      }

      for (Document d : sharedCategories.getDocuments()) {
        String title = d.getTitle();
        if (w.contentEquals(title)) {
          match = true;
          break;
        }
      }

      if (!match) {
        addToInvalid("Missing Categories",
            "Only existing categories allowed. Check for spaces between categories: " + w
                + " in line " + (line + 1));
      }
    }
  }

  /**
   * This will check against the words that already exist in the FirstVoices database
   *
   * @param word
   * @param line
   */
  private void checkWordDuplicate(String word, int line) {
    for (Document d : words.getDocuments()) {
      if (d.getTitle().equals(word)) {
        addToInvalid("Duplicates",
            "Cannot upload duplicate words: line " + (line + 1) + ", " + d.getTitle());
      }
    }
  }

  public void close() throws IOException {
    csvReader.close();
    client.disconnect();
  }

  private void addToInvalid(String key, String errorValue) {
    if (!invalid.containsKey(key)) {
      invalid.put(key, new ArrayList<>());
    }

    ArrayList<String> currentValuesInKey = invalid.get(key);
    currentValuesInKey.add(errorValue);
    invalid.put(key, currentValuesInKey);
  }

  public void printInvalidEntries() {
    for (Map.Entry<String, ArrayList<String>> entry : invalid.entrySet()) {
      System.out.println(entry.getKey());
      for (String error : entry.getValue()) {
        System.out.println(" -> " + error);
      }
    }
  }

}
