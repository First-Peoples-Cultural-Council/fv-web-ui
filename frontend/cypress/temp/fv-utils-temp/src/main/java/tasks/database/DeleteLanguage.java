package tasks.database;

import com.beust.jcommander.Parameter;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.objects.Documents;
import org.nuxeo.client.objects.Repository;
import org.nuxeo.client.objects.user.*;
import org.nuxeo.client.spi.NuxeoClientException;
import org.nuxeo.client.spi.NuxeoClientRemoteException;
import tasks.AbstractTask;
import tasks.interfaces.Task;

import java.util.List;
import java.util.stream.Collectors;

public class DeleteLanguage extends AbstractTask implements Task {
    
    // Name and description
    final private static String programName = "delete-language";
    
    @Parameter(names = { "-language-name" }, description = "The name of the language you want to delete.", required = true)
    private static String languageName;
    
    @Parameter(names = { "-language-directory" }, description = "The directory for the language to be deleted, rooted at /FV/Wordspaces/Data/", required = true)
    private static String langDirectory;
    
    private  DeleteLanguage() { super(); }
    
    public static String getDescription() {
        return "This task will delete a language and the users language_MEMBER, language_ADMIN, language_RECORDER, language_RECORDER_APPROVER.";
    }
    
    public static void execute(String[] argv) {
        
        DeleteLanguage deleteLanguage = new DeleteLanguage();
        
        // Setup command line
        deleteLanguage.setupCommandLine(programName, argv);
        
        // Connect to server
        deleteLanguage.connect();
        
        // Describe connection
        deleteLanguage.describeConnection();
        
        try {
            
            // Get user manager
            UserManager userManager = client.userManager();
    
            // Get repository manager
            Repository repository = client.repository();

            // Delete users
            deleteUser(languageName.toUpperCase() + "_MEMBER");
            deleteGroup(languageName.toLowerCase() + "_members");
            deleteUser(languageName.toUpperCase() + "_RECORDER");
            deleteGroup(languageName.toLowerCase() + "_recorders");
            deleteUser(languageName.toUpperCase() + "_RECORDER_APPROVER");
            deleteGroup(languageName.toLowerCase() + "_recorders_with_approval");
            deleteUser(languageName.toUpperCase() + "_ADMIN");
            deleteGroup(languageName.toLowerCase() + "_language_administrators");
            
            //Delete language
            String query = String.format("SELECT * FROM Document WHERE ecm:path = '/FV/Workspaces/Data/%s%s'", langDirectory, languageName);
            Documents language = repository.query(query);
            if (language.size() > 0) {
                Document folder = repository.fetchDocumentByPath("/FV/Workspaces/Data/" + langDirectory + languageName);
                String UID = folder.getUid();
                repository.deleteDocument(UID);
            }
    
            //Delete sections language
            String queryTwo = String.format("SELECT * FROM Document WHERE ecm:path = '/FV/sections/Data/%s%s'", langDirectory, languageName);
            Documents languageSections = repository.query(queryTwo);
            if (languageSections.size() > 0) {
                Document folder = repository.fetchDocumentByPath("/FV/sections/Data/" + langDirectory + languageName);
                String UID = folder.getUid();
                repository.deleteDocument(UID);
            }
    
            System.out.println("Deleted \"" + languageName + "\" language successfully.");
            System.exit(0);
            
        }
        catch (NuxeoClientRemoteException e) {
            System.out.println("Error connecting to Nuxeo server: The language \"" + languageName + "\" or it's users could not be found.");
            System.exit(1);
        }
        catch (NuxeoClientException e) {
            System.out.println("Error connecting to Nuxeo server. Is your dialect GUID correct?" + e.getMessage());
            System.exit(1);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            System.exit(1);
        }
        
    }
    
    // Helper method to delete users
    private static void deleteUser(String inputUser) {
        UserManager userManager = client.userManager();
        Users foundUsers = userManager.searchUser(inputUser);
        if (foundUsers.size() > 0) {
            for (User user : foundUsers.getUsers()) {
                userManager.deleteUser(user.getUserName());
            }
        }
    }
    
    // Helper method to delete groups
    private static void deleteGroup(String inputGroup) {
        UserManager userManager = client.userManager();
        Groups foundGroups = userManager.searchGroup(inputGroup, 0, 32);
        List<String> groupList = foundGroups.streamEntries().map(Group::getGroupName).collect(Collectors.toList());
        if (foundGroups.size() > 0) {
            for (String group : groupList) {
                userManager.deleteGroup(group);
            }
        }
    }
    
}
