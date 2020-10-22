package tasks.dictionary;

import com.beust.jcommander.Parameter;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.spi.NuxeoClientException;
import tasks.interfaces.Task;
import tasks.utils.CustomOperations;
import tasks.utils.RepositoryUtils;

import java.util.Map;

public class DictionaryFieldCorrection extends DictionaryTask implements Task {

    // Name and description
    final private static String programName = "dictionary-field-correction";

    // Parameters specific to this task

    @Parameter(names = { "-operation" }, description = "The operation you want to run on each of the results", required = true)
    private String operation;

    @Parameter(names = { "-field" }, description = "The field you want to operate on (if task supports field). E.g. dc:title")
    private String field = "";

    @Parameter(names = { "-fVal" }, description = "The values you want to set on the field (if task supports field). E.g. dc:title")
    private String fieldValue = "";

    private Document dictionary = null;

    private int iterations = 1;

    private DictionaryFieldCorrection() {
        super();
    }

    public static String getDescription() {
        return "This task will loop over all the items in a 'folder' (e.g. Dictionary) and perform an operation on them, while disabling dublin core listeners. Handle with care!";
    }

    @Override
    protected Boolean runOperation(Object record) throws Exception {
        Map<String, String> record1 = (Map<String, String>) record;
        switch (operation) {
            case "move-pronunciation-to-word":
                return CustomOperations.MovePronunciationToWord(client, record1.get("ecm:uuid"));
            case "recalculate-custom-order":
                return CustomOperations.RecalculateCustomOrderAndRepublish(client, record1.get("ecm:uuid"));
            case "assign-value-to-field": {

                if (field.isEmpty() || fieldValue.isEmpty()) {
                    throw new Exception("Need field and values to operate.");
                }

                return CustomOperations.AssignValueToFields(client, record1.get("ecm:uuid"), field, fieldValue);
            }
        }

        return false;
    }

    public static void execute(String[] argv) {

        DictionaryFieldCorrection dictionaryFieldCorrection = new DictionaryFieldCorrection();

        // Setup command line
        dictionaryFieldCorrection.setupCommandLine(programName, argv);

        // Connect to server
        dictionaryFieldCorrection.connect();

        // Describe connection
        dictionaryFieldCorrection.describeConnection();

        // Perform actions
        try {
            // Disable dublin core listener
            RepositoryUtils.disableDCListener(client);

            // Get/Set dictionary object and size
            dictionaryFieldCorrection.setDictionaryData();

            // Operate on dictionary items
            dictionaryFieldCorrection.operateOnItemsAsRecordSet();

            System.out.println("-> Operation and validation complete.");
        }
        catch (NuxeoClientException e) {
            System.out.println("## ERROR! Connecting to Nuxeo server. Is your dialect GUID correct? " + e.getMessage() + " ##");
            e.printStackTrace();
        }
        catch (Exception e) {
            System.out.println("## ERROR! " + e.getMessage() + " ##");
        }
        finally {
            // Enabled dublin core listener
            RepositoryUtils.enableDCListener(client);

            if (currentIteration != null) {
                System.out.println("Last operations was evaluated on " + currentIteration + ", total impacted: " + changedObjects);
            }

        }
    }
}
