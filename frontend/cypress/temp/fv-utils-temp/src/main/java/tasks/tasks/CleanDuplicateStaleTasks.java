package tasks.tasks;

import com.beust.jcommander.Parameter;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.objects.Documents;
import org.nuxeo.client.spi.NuxeoClientException;
import tasks.AbstractTask;
import tasks.interfaces.Task;
import tasks.utils.CsvUtils;
import tasks.utils.DocumentUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

public class CleanDuplicateStaleTasks extends AbstractTask implements Task {

    protected static CsvUtils csv = null;

    // Name and description
    final private static String programName = "clean-duplicate-stale-tasks";

    // Parameters specific to this task
    @Parameter(names = { "-dry-run" }, description = "Potential run a dry run of operation without actually deleting values")
    private static Boolean dryRun = false;

    @Parameter(names = { "-remove-published" }, description = "Potential remove any tasks related to a published document")
    private static Boolean removePublished = false;

    @Parameter(names = { "-affected-group" }, description = "Approval group to get tasks for - syntax 'group:group_name'. For all groups, use 'group:administrators'", required = true)
    private static String affectedGroup;

    // Optionally, export all remaining tasks to a CSV file
    @Parameter(names = { "-export-dir" }, description = "Where to export the CSV file to (path + name.csv)")
    protected String exportDir = null;

    private String userJson = "";

    private static HashMap<String, Document> docCache = new HashMap<String, Document>();

    private CleanDuplicateStaleTasks() {
        super();
    }

    private static String WORKFLOW_ENABLE_ID = "Task2300";
    private static String WORKFLOW_DISABLE_ID = "Task297b";
    private static String WORKFLOW_PUBLISH_ID = "Task6b8";
    private static String WORKFLOW_UNPUBLISH_ID = "Task11b1";

    public static String getDescription() {
        return "This task will remove processed or non-existent user registrations, and generate a CSV for follow up.";
    }

    private static Document getDocument(String uuid) {
        if (docCache.containsKey(uuid)) {
            return docCache.get(uuid);
        } else {
            Document remoteDoc = DocumentUtils.getDocument(client, uuid);
            docCache.put(uuid, remoteDoc);
            return remoteDoc;
        }
    }

    public static void execute(String[] argv) {

        CleanDuplicateStaleTasks cleanDuplicateStaleTasks = new CleanDuplicateStaleTasks();

        // Setup command line
        cleanDuplicateStaleTasks.setupCommandLine(programName, argv);

        // Connect to server
        cleanDuplicateStaleTasks.connect();

        // Connect to server
        cleanDuplicateStaleTasks.setupCSVOutput();

        // Describe connection
        cleanDuplicateStaleTasks.describeConnection();

        // Describe dry run
        if (dryRun) {
            System.out.println("** Dry run mode! Will not actually delete anything **");
        }

        // Perform actions
        try {

            String query = "SELECT * FROM RoutingTask WHERE " +
                " ecm:isTrashed = 0 AND ecm:currentLifeCycleState <> 'ended'" +
                " AND nt:actors IN ('" + affectedGroup +"')" +
                " ORDER BY dc:created DESC";

            Documents tasks = client
                    .schemas("task")
                    .operation("Repository.Query")
                    .param("currentPageIndex", 0)
                    .param("pageSize", 1000)
                    .param("query", query)
                    .execute();

            System.out.println("-> Found a total of of [" + tasks.getResultsCount() + "] In this iteration [" + tasks.size() + "] tasks.");

            int duplicatesRemoved = 0;
            int staleRemoved = 0;
            int publishedRemoved = 0;

            // Step 1: Remove duplicates within list of tasks
            for (int i = 0; i < tasks.size(); i++) {
                Document task = tasks.getDocument(i);
                if (task != null) {
                    List<Document> duplicateTasks = tasks.streamEntries().filter(possibleDup ->
                            possibleDup.getPropertyValue("nt:type").equals(task.getPropertyValue("nt:type")) &&
                                    possibleDup.getPropertyValue("nt:targetDocumentsIds").equals(task.getPropertyValue("nt:targetDocumentsIds")) &&
                                    !possibleDup.getId().equals(task.getId()))
                            .collect(Collectors.toList());

                    for (Document task1 : duplicateTasks) {
                        tasks.removeDocument(task1);
                        if (!dryRun) {
                            client.repository().deleteDocument(task1.getId());
                        }
                        System.out.println("Duplicate task: " + task1.getId() + " removed.");
                        ++duplicatesRemoved;
                    }
                }
            }

            System.out.println("-> [" + duplicatesRemoved + "] Duplicates removed. Proceeding to remove stale tasks.");

            // Step 2: Remove tasks that are not relevant anymore due to state transition
            for (Document task : tasks.getDocuments()) {
                ArrayList<String> taskTargetDocs = (ArrayList<String>) task.getPropertyValue("nt:targetDocumentsIds");
                String taskActionType = task.getPropertyValue("nt:type");

                // Check for each target document, whether the transition makes sense still.
                for (String docUUID : taskTargetDocs) {
                    Document doc = getDocument(docUUID);

                    if ((taskActionType.equals(WORKFLOW_ENABLE_ID) || taskActionType.equals(WORKFLOW_UNPUBLISH_ID)) && doc.getState().equals("Enabled")) {
                        if (!dryRun) { client.repository().deleteDocument(task.getId()); }
                        System.out.println("Task " + task.getId() + " needs to be cleared. Unpublish or Enable -> Enabled.");
                        ++staleRemoved;
                    } else if ((taskActionType.equals(WORKFLOW_DISABLE_ID)) && doc.getState().equals("Disabled")) {
                        if (!dryRun) { client.repository().deleteDocument(task.getId()); }
                        System.out.println("Task " + task.getId() + " needs to be cleared. Disabled -> Disabled.");
                        ++staleRemoved;
                    } else if ((taskActionType.equals(WORKFLOW_PUBLISH_ID)) && doc.getState().equals("Published")) {
                        if (!dryRun) { client.repository().deleteDocument(task.getId()); }
                        System.out.println("Task " + task.getId() + " needs to be cleared. Published -> Published.");
                        ++staleRemoved;
                    }

                    if ( removePublished && doc.getState().equals("Published") ) {
                        if (!dryRun) { client.repository().deleteDocument(task.getId()); }
                        System.out.println("Task " + task.getId() + " needs to be cleared. " + doc.getTitle() + " is Published.");
                        ++publishedRemoved;
                    }
                }
            }

            System.out.println("-> [" + staleRemoved + "] Stale tasks removed. Operation and validation complete.");

            if (removePublished) {
                System.out.println("-> [" + publishedRemoved + "] Published tasks removed. Operation and validation complete.");
            }

            if (csv != null) {

                Documents remainingTasks = client
                        .schemas("task")
                        .operation("Repository.Query")
                        .param("currentPageIndex", 0)
                        .param("pageSize", 1000)
                        .param("query", query)
                        .execute();

                for (Document task : remainingTasks.getDocuments()) {

                    ArrayList<String> taskTargetDocs = (ArrayList<String>) task.getPropertyValue("nt:targetDocumentsIds");

                    // Should have a single target document
                    if (taskTargetDocs != null && taskTargetDocs.size() == 1) {
                        Document targetDoc = getDocument(taskTargetDocs.get(0));

                        List<Object> outputRow = new ArrayList<Object>();
                        outputRow.add(targetDoc.getTitle());
                        outputRow.add(targetDoc.getType());
                        outputRow.add(targetDoc.getState());
                        outputRow.add(HumanReadableTaskStatus(task.getPropertyValue("nt:type")));
                        outputRow.add(task.getPropertyValue("nt:dueDate"));
                        outputRow.add(task.getPropertyValue("nt:initiator"));
                        outputRow.add(task.getId());
                        outputRow.add(targetDoc.getId());

                        csv.writeLine(outputRow.toArray(new String[0]));
                    }


                }
            }
        }
        catch (NuxeoClientException e) {
            System.out.println("Error connecting to Nuxeo server. Is your dialect GUID correct?" + e.getMessage());
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    protected void setupCSVOutput() {
        if (exportDir != null) {
            if (!exportDir.endsWith("/")) {
                exportDir += "/";
            }

            csv = new CsvUtils(exportDir + "output-" + new Date().getTime() + "-tasks.csv");

            // Write headers for CSV file
            String[] headers = new String[8];
            headers[0] = "WORD/PHRASE";
            headers[1] = "TYPE";
            headers[2] = "CURRENT STATUS";
            headers[3] = "NEXT STATUS";
            headers[4] = "DATE";
            headers[5] = "REQUESTED BY";
            headers[6] = "TASK ID (DO NOT EDIT)";
            headers[7] = "WORD ID (DO NOT EDIT)";

            csv.writeLine(headers);
        }
    }

    private static String HumanReadableTaskStatus(String workflowType) {
        if (workflowType.equals(WORKFLOW_ENABLE_ID)) {
            return "Enabled";
        } else if (workflowType.equals(WORKFLOW_DISABLE_ID)) {
            return "Disabled";
        } else if (workflowType.equals(WORKFLOW_PUBLISH_ID)) {
            return "Published";
        } if (workflowType.equals(WORKFLOW_UNPUBLISH_ID)) {
            return "Unpublished";
        }
        return null;
    }
}
