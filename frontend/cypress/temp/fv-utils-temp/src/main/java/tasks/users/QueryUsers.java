package tasks.users;

import com.opencsv.CSVReader;
import org.nuxeo.client.objects.directory.Directory;
import org.nuxeo.client.objects.directory.DirectoryEntries;
import org.nuxeo.client.objects.user.User;
import org.nuxeo.client.spi.NuxeoClientException;
import tasks.AbstractTask;
import tasks.interfaces.Task;

import java.util.List;

public class QueryUsers extends AbstractTask implements Task {

    protected static CSVReader csvReader = null;

    // Name and description
    final private static String programName = "users-query";

    private QueryUsers() {
        super();
    }

    public static String getDescription() {
        return "This task will import user registrations from a file (for reverting clean export registration).";
    }

    public static void execute(String[] argv) {

        QueryUsers queryUsers = new QueryUsers();

        // Setup command line
        queryUsers.setupCommandLine(programName, argv);

        // Connect to server
        queryUsers.connect();

        // Describe connection
        queryUsers.describeConnection();

        // Perform actions
        try {

            Directory dirUsers = client.directoryManager().directory("userDirectory");
            DirectoryEntries directoryEntries = dirUsers.fetchEntries();

            directoryEntries.streamEntries().forEach(d -> {
                    User expandedUser = client.userManager().fetchUser(d.getId());
                    String username = expandedUser.getUserName();

                    List<String> groups = expandedUser.getGroups();

                    // Output users that have no groups
                    if (groups.size() == 0) {
                        System.out.println(username + ",null");
                    }
                    // Output all groups per user
//                    else {
//                        System.out.print(username + ",");
//                        // This will output groups the user is assocaited with directly
//                        // Use getExpandedGroups to get groups they are part of by association
//                        expandedUser.getGroups().stream().forEach(group -> {
//                            System.out.print(group + ",");
//                        });
//                        System.out.println("");
//                    }


                }
            );

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
