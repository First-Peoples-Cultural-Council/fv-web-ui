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

public class DictionarySimpleExport extends DictionaryTask implements Task {

    protected static CsvUtils csv = null;

    // Name and description
    final private static String programName = "dictionary-simple-export";

    @Parameter(names = { "-export-dir" }, description = "Where to export the CSV file to", required = true)
    protected String exportDir = "";

    @Parameter(names = { "-exportType" }, description = "Object type to export. By default - these are words.")
    protected static String exportType = "FVWord";

    private DictionarySimpleExport() {
        super();
    }

    public static String getDescription() {
        return "This task is purpose built at the moment to provide a simple export for words. "
            + "Specifically in this case to provide an id, words, definitions "
            + "for teams to work with offline.";
    }

    public static void execute(String[] argv) {

        DictionarySimpleExport dictionarySimpleExport = new DictionarySimpleExport();

        // Setup command line
        dictionarySimpleExport.setupCommandLine(programName, argv);

        // Connect to server
        dictionarySimpleExport.connect();

        // Describe connection
        dictionarySimpleExport.describeConnection();

        // Perform actions
        try {
            // Set WHERE clause to type of data (e.g. FVWord, FVPhrase)
            dictionarySimpleExport.setWhere("AND ecm:primaryType = '" + exportType + "' " + where);

            // Get/Set dictionary object and size
            dictionarySimpleExport.setDictionaryData();

            // Setup CSV
            dictionarySimpleExport.setupCSVOutput();

            // Operate on dictionary items
            dictionarySimpleExport.operateOnItemsAsDocuments();

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
        String[] headers = new String[9];
        headers[0] = "ID (DO NOT EDIT)";
        headers[1] = header;
        headers[2] = "DEFINITION_1";
        headers[3] = "DEFINITION_2";
        headers[4] = "DEFINITION_3";
        headers[5] = "DEFINITION_4";
        headers[6] = "DEFINITION_5";
        headers[7] = "HAS_AUDIO";
        headers[8] = "STATE";

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

        // HAS_AUDIO
        List<String> relatedAudio = docObj.getPropertyValue("fv:related_audio");
        boolean hasRelatedAudio = relatedAudio.size() != 0;
        outputRow.add(Boolean.toString(hasRelatedAudio));

        // STATE
        String state = docObj.getState();
        outputRow.add(state);

        csv.writeLine(outputRow.toArray(new String[0]));

        return true;
    }
}
