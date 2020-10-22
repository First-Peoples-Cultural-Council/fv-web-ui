package tasks.dictionary;

import com.beust.jcommander.Parameter;
import models.AppCompatiblePhrase;
import models.AppCompatibleWord;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.objects.user.User;
import org.nuxeo.client.spi.NuxeoClientException;
import tasks.interfaces.Task;
import tasks.utils.CsvUtils;

import java.util.*;

public class DictionaryExport extends DictionaryTask implements Task {

  protected static CsvUtils csv = null;

  // Name and description
  final private static String programName = "dictionary-export";

  @Parameter(names = { "-export-dir" }, description = "Where to export the CSV file to", required = true)
  protected String exportDir = "";

  @Parameter(names = { "-exportType" }, description = "Object type to export. By default - these are words.")
  protected static String exportType = "FVWord";

  private DictionaryExport() {
    super();
  }

  public static String getDescription() {
    return "This task is purpose built at the moment to provide an export for words or phrases. "
        + "Including most document properties.";
  }

  public static void execute(String[] argv) {

    DictionaryExport dictionaryExport = new DictionaryExport();

    // Setup command line
    dictionaryExport.setupCommandLine(programName, argv);

    // Connect to server
    dictionaryExport.connect();

    // Describe connection
    dictionaryExport.describeConnection();

    // Perform actions
    try {
      // Set WHERE clause to type of data (e.g. FVWord, FVPhrase)
      dictionaryExport.setWhere("AND ecm:primaryType = '" + exportType + "' " + where);

      // Get/Set dictionary object and size
      dictionaryExport.setDictionaryData();

      // Setup CSV
      dictionaryExport.setupCSVOutput();

      // Operate on dictionary items
      dictionaryExport.operateOnItemsAsDocuments();

      System.out.println("-> Operation and validation complete.");
    } catch (NuxeoClientException e) {
      System.out.println("Error connecting to Nuxeo server. Is your dialect GUID correct? " + e.getMessage());
      e.printStackTrace();
    } catch (Exception e) {
      System.out.println(e.getMessage());
    } finally {
      System.out.println("Last operations was evaluated on " + currentIteration + ", total impacted: " + changedObjects);
      csv.close();
    }
  }

  protected void setupCSVOutput() {
    if (!exportDir.endsWith("/")) {
      exportDir += "/";
    }

    String header = "WORD";
    String label = "WORDS";

    if (exportType.equals("FVPhrase")) {
      header = "PHRASE";
      label = "PHRASES";
    }

    // If you need the date/time included in the file name add " + new Date().getTime() + "
    csv = new CsvUtils(exportDir + label + "-" + dictionaryId + ".csv");

    // Write headers for CSV file
    String[] headers = new String[18];
    headers[0] = "ID (DO NOT EDIT)";
    headers[1] = header;
    headers[2] = "DEFINITION_1";
    headers[3] = "DEFINITION_2";
    headers[4] = "DEFINITION_3";
    headers[5] = "DEFINITION_4";
    headers[6] = "DEFINITION_5";
    headers[7] = "LITERAL_TRANSLATION";
    headers[8] = "LITERAL_TRANSLATION_2";
    headers[9] = "PRONUNCIATION";
    headers[10] = "CULTURAL_NOTE";
    headers[11] = "CREATOR";
    headers[12] = "REFERENCE";
    headers[13] = "ACKNOWLEDGEMENT";
    headers[14] = "HAS_AUDIO";
    headers[15] = "HAS_IMAGE";
    headers[16] = "HAS_VIDEO";
    headers[17] = "STATE";

    csv.writeLine(headers);
  }

  protected Boolean runOperation(Object doc) throws Exception {
    Document docObj = (Document) doc;
    List<Object> outputRow = new ArrayList<Object>();

    String type = "fv-word";
    if (exportType.equals("FVPhrase")) {
      type = "fv-phrase";
    }

    // UID
    String uid = docObj.getId();
    outputRow.add(uid);

    // TITLE
    String title = docObj.getPropertyValue("dc:title");
    outputRow.add(title);

    // DEFINITIONS
    List<Map<String, String>> definitions = docObj.getPropertyValue("fv:definitions");
    for (int i = 0; i < 5; ++i) {
      if (i < definitions.size() && definitions.get(i) != null) {
        outputRow.add(definitions.get(i).get("translation"));
      } else {
        outputRow.add("");
      }
    }

    // LITERAL_TRANSLATION
    List<Map<String, String>> literalTranslations = docObj.getPropertyValue("fv:literal_translation");
    for (int i = 0; i < 2; ++i) {
      if (i < literalTranslations.size() && literalTranslations.get(i) != null) {
        outputRow.add(literalTranslations.get(i).get("translation"));
      } else {
        outputRow.add("");
      }
    }

    // PRONUNCIATION
    if (exportType.equals("FVWord")) {
      String pronunciation = docObj.getPropertyValue("dc:pronunciation");
      outputRow.add(pronunciation);
    } else {
      outputRow.add("");
    }

    // CULTURAL_NOTE
    List<Map<String, String>> culturalNote = docObj.getPropertyValue("fv:cultural_note");
    for (int i = 0; i < 1; ++i) {
      if (i < culturalNote.size() && culturalNote.get(i) != null) {
        outputRow.add(culturalNote.get(i));
      } else {
        outputRow.add("");
      }
    }

    // CREATOR
    if (docObj.getPropertyValue("dc:creator") instanceof String) {
      outputRow.add(docObj.getPropertyValue("dc:creator"));
    } else if (docObj.getPropertyValue("dc:creator") instanceof User) {
      User creator = docObj.getPropertyValue("dc:creator");
      String creatorId = creator.getId();
      outputRow.add(creatorId);
    } else { outputRow.add(""); }


    // REFERENCE
    String reference = docObj.getPropertyValue("dc:reference");
    outputRow.add(reference);

    // ACKNOWLEDGEMENT
    String acknowledgement = docObj.getPropertyValue(type + ":acknowledgement");
    outputRow.add(acknowledgement);

    // HAS_AUDIO
    List<String> relatedAudio = docObj.getPropertyValue("fv:related_audio");
    boolean hasRelatedAudio = relatedAudio.size() != 0;
    outputRow.add(Boolean.toString(hasRelatedAudio));

    // HAS_IMAGE
    List<String> relatedImage = docObj.getPropertyValue("fv:related_pictures");
    boolean hasRelatedImage = relatedImage.size() != 0;
    outputRow.add(Boolean.toString(hasRelatedImage));

    // HAS_VIDEO
    List<String> relatedVideo = docObj.getPropertyValue("fv:related_videos");
    boolean hasRelatedVideo = relatedVideo.size() != 0;
    outputRow.add(Boolean.toString(hasRelatedVideo));

    // STATE
    String state = docObj.getState();
    outputRow.add(state);

    csv.writeLine(outputRow.toArray(new String[0]));

    return true;
  }
}
