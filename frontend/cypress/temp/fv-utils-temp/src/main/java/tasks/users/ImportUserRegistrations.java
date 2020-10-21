package tasks.users;

import java.util.List;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.objects.user.User;
import org.nuxeo.client.objects.user.Users;
import org.nuxeo.client.spi.NuxeoClientException;
import tasks.AbstractImportTask;
import tasks.interfaces.Task;

public class ImportUserRegistrations extends AbstractImportTask implements Task {

    // Name and description
    final private static String programName = "users-import-registrations";

    private ImportUserRegistrations() {
        super();
    }

    public static String getDescription() {
        return "This task will import user registrations from a file (for reverting clean export registration).";
    }

    public static void execute(String[] argv) {

        ImportUserRegistrations importRegistrations = new ImportUserRegistrations();

        // Setup command line
        importRegistrations.setupCommandLine(programName, argv);

        // Setup CSV input
        importRegistrations.setupCSVInput();

        // Connect to server
        importRegistrations.connect();

        // Describe connection
        importRegistrations.describeConnection();

        // Perform actions
        try {

            if (csvReader != null) {

                List<String[]> records = csvReader.readAll();
                for (String[] record : records) {

                    Users users = client.userManager().searchUser(record[0]);

                    if (users.size() == 1) {
                        User user = users.getEntry(0);

                        System.out.println("---------------------------");
                        System.out.println("Name : " + record[0]);
                        System.out.println("Email : " + record[1]);
                        System.out.println("---------------------------");

                        Document newUserRegRequest = Document.createWithName(user.getEmail(), "FVUserRegistration");

                        newUserRegRequest.setPropertyValue("dc:created", user.getProperties().get("created"));
                        newUserRegRequest.setPropertyValue("docinfo:documentId", record[1]);
                        newUserRegRequest.setPropertyValue("fvuserinfo:requestedSpace", record[1]);
                        newUserRegRequest.setPropertyValue("fvuserinfo:role", user.getProperties().get("role"));
                        newUserRegRequest.setPropertyValue("fvuserinfo:language_team_member", true);
                        newUserRegRequest.setPropertyValue("fvuserinfo:comment", user.getProperties().get("comments"));
                        newUserRegRequest.setPropertyValue("userinfo:firstName", user.getFirstName());
                        newUserRegRequest.setPropertyValue("userinfo:lastName", user.getLastName());
                        newUserRegRequest.setPropertyValue("userinfo:email", user.getEmail());
                        newUserRegRequest.setPropertyValue("userinfo:login", user.getUserName());

                        client.repository().createDocumentByPath("/management/FVRegistrationRequests", newUserRegRequest);

                        System.out.println("Created new registration request for " + record[0]);
                    } else {
                        System.out.println("No user found. Not processing row for " + record[0]);
                    }
                }

                System.out.println("-> Operation and validation complete.");
            } else {
                System.out.println("-> CSV file null; no operation run.");
            }
        }
        catch (NuxeoClientException e) {
            System.out.println("Error connecting to Nuxeo server. Is your dialect GUID correct?" + e.getMessage());
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
