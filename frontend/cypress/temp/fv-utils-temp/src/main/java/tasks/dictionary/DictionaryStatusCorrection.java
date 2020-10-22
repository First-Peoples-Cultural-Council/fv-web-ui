package tasks.dictionary;

import com.beust.jcommander.Parameter;
import okhttp3.Response;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.objects.audit.Audit;
import org.nuxeo.client.objects.audit.LogEntry;
import org.nuxeo.client.spi.NuxeoClientException;
import tasks.interfaces.Task;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class DictionaryStatusCorrection extends DictionaryTask implements Task {

    // Name and description
    final private static String programName = "dictionary-status-correction";

    // Parameters specific to this task

    @Parameter(names = { "-principal" }, description = "The principal whose transition changes you want to ignore", required = true)
    private String systemPrincipal;

    private Document dictionary = null;

    private int iterations = 1;

    private DictionaryStatusCorrection() {
        super();
    }

    public static String getDescription() {
        return "This is a very specific task for correcting unwanted workflow transitions that happened by a system account (systemPrincipal). The task will retrieve the correct status from the documents audit log, and revert to it. Handle with care!";
    }

    @Override
    protected Boolean runOperation(Object record) throws Exception {

        Audit audit = null;

        Map<String, String> record1 = (Map<String, String>) record;
        String uuid = record1.get("ecm:uuid");
        String docTitle = record1.get("dc:title");

        // This will only return 50 results, unfiltered; we need to get more.
        //Audit audit = doc.fetchAudit();

        // Run manual REST API query against Nuxeo - retrieving all lifecycle changes
        // For query params, see: https://nuxeo.github.io/nuxeo-js-client/latest/document.js.html#line442
        Response docAuditResponse = client.get(url + "/api/v1/id/" + uuid + "/@audit?pageSize=1000&eventId=lifecycle_transition_event");

        if (docAuditResponse.isSuccessful()) {
            audit = client.getConverterFactory().readJSON(docAuditResponse.body().string(), Audit.class);
        }

        if (audit != null) {

            // Get all the transition events performed by NON system admins
            List<LogEntry> stateTransitionsByNonSysAdmin = audit.streamEntries()
                    .filter(logEntry -> !systemPrincipal.equals(logEntry.getPrincipalName()))
                    .collect(Collectors.toList());

            // If no transitions were performed, latest state by non-admin would be NEW
            String latestStateByNonAdmin = "New";

            // Get last non admin state
            if (stateTransitionsByNonSysAdmin.size() > 0) {
                latestStateByNonAdmin = stateTransitionsByNonSysAdmin.get(0).getDocLifeCycle();
            }

            switch (latestStateByNonAdmin) {
                case "Disabled":
                case "New":
                    try {
                        System.out.println(docTitle + "," + uuid + ",Published," + latestStateByNonAdmin + "," + (latestStateByNonAdmin.equals("New") ? "RevertToNew" : "Disable" ));

                     client.operation("Document.FollowLifecycleTransition")
                    .input(uuid)
                    .param("value", (latestStateByNonAdmin.equals("New") ? "RevertToNew" : "Disable" ))
                    .execute();

                        //System.out.println("Executed '" + (latestStateByNonAdmin.equals("New") ? "RevertToNew" : "Disable" ) + "' Operation.");
                    } catch (Exception e) {
                        return false;
                    }

                break;
            }

            return true;
        } else {
            return false;
        }
    }

    public static void execute(String[] argv) {

        DictionaryStatusCorrection dictionaryFieldCorrection = new DictionaryStatusCorrection();

        // Setup command line
        dictionaryFieldCorrection.setupCommandLine(programName, argv);

        // Connect to server
        dictionaryFieldCorrection.connect();

        // Describe connection
        dictionaryFieldCorrection.describeConnection();

        // Perform actions
        try {
            // Get/Set dictionary object and size
            dictionaryFieldCorrection.setDictionaryData();

            System.out.println("WORD,ID,CURRENT_STATE,SHOULD_BE_STATE,TRANSITION");

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
            if (currentIteration != null) {
                System.out.println("Last operations was evaluated on " + currentIteration + ", total impacted: " + changedObjects);
            }

        }
    }
}
