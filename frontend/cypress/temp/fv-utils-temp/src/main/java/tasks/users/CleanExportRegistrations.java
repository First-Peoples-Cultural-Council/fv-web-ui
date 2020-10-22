package tasks.users;

import com.beust.jcommander.Parameter;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.objects.Documents;
import org.nuxeo.client.objects.RecordSet;
import org.nuxeo.client.objects.user.User;
import org.nuxeo.client.objects.user.Users;
import org.nuxeo.client.spi.NuxeoClientException;
import tasks.AbstractTask;
import tasks.interfaces.Task;
import tasks.utils.CsvUtils;
import tasks.utils.FolderUtils;

import java.util.*;

public class CleanExportRegistrations extends AbstractTask implements Task {

    protected static CsvUtils csv = null;

    // Name and description
    final private static String programName = "users-export-registrations";

    // Parameters specific to this task
    @Parameter(names = { "-dialect" }, description = "An optional dialect to set limit operations to")
    private String dialect = null;

    @Parameter(names = { "-export-dir" }, description = "Where to export the CSV file to")
    private String exportDir = "";

    private String userJson = "";

    private CleanExportRegistrations() {
        super();
    }

    public static String getDescription() {
        return "This task will remove processed or non-existent user registrations, and generate a CSV for follow up.";
    }

    protected void setupCSVOutput() {
        if (dialect != null && exportDir != null) {

            if (!exportDir.endsWith("/")) {
                exportDir += "/";
            }

            csv = new CsvUtils(exportDir + "output-" + new Date().getTime() + "-" + dialect + ".csv");

            // Write headers for CSV file
            String[] headers = new String[8];
            headers[0] = "USER_LOGIN";
            headers[1] = "DIALECT_GUID";
            headers[2] = "DIALECT_TITLE";
            headers[3] = "GROUPS";
            headers[4] = "FIRST_NAME";
            headers[5] = "LAST_NAME";
            headers[6] = "EMAIL";
            headers[7] = "FV_USER_INFO";

            csv.writeLine(headers);
        }
    }

    private void processUserRegistrationRequest(Map<String, String> record) {

        String currentUUID = record.get("ecm:uuid");

        // Setup parameters
        String where = (dialect != null) ? " AND docinfo:documentId = '" + dialect +"'" : "";

        Documents userRegistrationRequests = FolderUtils.getChildren(client, currentUUID, 0, 1000, where, null, false, false);

        if (userRegistrationRequests.size() > 0) {
            Iterator it = userRegistrationRequests.getDocuments().iterator();

            while (it.hasNext()) {
                Document doc = (Document) it.next();

                String userLogin = (String) doc.getPropertyValue("userinfo:login");
                String dialectToJoin = (String) doc.getPropertyValue("docinfo:documentId");
                String dialectTitle = (String) doc.getPropertyValue("docinfo:documentTitle");
                ArrayList groups = (ArrayList) doc.getPropertyValue("userinfo:groups");
                String firstName = (String) doc.getPropertyValue("userinfo:firstName");
                String lastName = (String) doc.getPropertyValue("userinfo:lastName");
                String email = (String) doc.getPropertyValue("userinfo:email");
                Map<String, Object> docProperties = (Map<String, Object>) doc.getProperties();

                Users users = client.userManager().searchUser(userLogin);

                if (users.size() == 1) {

                    User user = users.getEntry(0);

                    // If user is in correct group and exists as a user - clear registration request
                    if (groups.get(0).equals(user.getGroups().get(0))) {
                        client.repository().deleteDocument(doc.getId());
                        System.out.println("Exists as user: " + user.getUserName() + " - on dialect " + dialectToJoin + ". Registration Request cleared.");
                    }
                } else if (users.size() == 0 && csv != null) {

                    List<Object> outputString = new ArrayList<Object>();

                    outputString.add(userLogin);
                    outputString.add(dialectToJoin);
                    outputString.add(dialectTitle);
                    outputString.add(groups.toString());
                    outputString.add(firstName);
                    outputString.add(lastName);
                    outputString.add(email);
                    outputString.add(docProperties.toString());

                    csv.writeLine(outputString.toArray(new String[0]));
                    client.repository().deleteDocument(doc.getId());
                    System.out.println("User: " + userLogin + " does not exist, adding to export for follow up. Registration Request cleared.");
                }
            }
        }
    }

    public static void execute(String[] argv) {

        CleanExportRegistrations exportRegistrations = new CleanExportRegistrations();

        // Setup command line
        exportRegistrations.setupCommandLine(programName, argv);

        // Setup CSV
        exportRegistrations.setupCSVOutput();

        // Connect to server
        exportRegistrations.connect();

        // Describe connection
        exportRegistrations.describeConnection();

        // Perform actions
        try {

            // Get User Registration Containers
            String queryUserRegistrationContainers = "SELECT * FROM UserRegistrationContainer";

            RecordSet userRegistrationContainers = client
                    .operation("Repository.ResultSetQuery")
                    .param("currentPageIndex", 0)
                    .param("pageSize", 1000)
                    .param("query", queryUserRegistrationContainers)
                    .execute();

            System.out.println("-> Will operate on [" + userRegistrationContainers.getUuids() + "] containers.");


            for (Map<String, String> record : userRegistrationContainers.getUuids()) {
                exportRegistrations.processUserRegistrationRequest(record);
            }

            // Validate that preferences have been updated
            //assertEquals("Validation of operation failed. Preferences do not match.", exportRegistrations.getPreferences(), remoteUpdatedUser.getPreferences());

            System.out.println("-> Operation and validation complete.");
        }
        catch (NuxeoClientException e) {
            System.out.println("Error connecting to Nuxeo server. Is your dialect GUID correct?" + e.getMessage());
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
