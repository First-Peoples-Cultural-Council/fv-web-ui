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

public class CreateLanguage extends  AbstractTask implements Task {
    
    // Name and description
    final private static String programName = "create-language";
    
    @Parameter(names = { "-language-name" }, description = "The name of the language you want to create.", required = true)
    private static String languageName;
    
    @Parameter(names = { "-language-directory" }, description = "The directory for the language to be created in, rooted at /FV/Wordspaces/Data/", required = true)
    private static String langDirectory;
    
    private CreateLanguage() { super(); }
    
    public static String getDescription() {
        return "This task will create a language and the users language_MEMBER, language_ADMIN, language_RECORDER, language_RECORDER_APPROVER.";
    }
    
    public static void execute(String[] argv) {
        
        CreateLanguage createLanguage = new CreateLanguage();
        
        // Setup command line
        createLanguage.setupCommandLine(programName, argv);
        
        // Connect to server
        createLanguage.connect();
        
        // Describe connection
        createLanguage.describeConnection();
        
        // Get environment variable that will create the passwords
        String password = System.getenv("CYPRESS_FV_PASSWORD");
        
        try {
            
            // Get repository manager
            Repository repository = client.repository();
            
            // Create new language
            String query = String.format("SELECT * FROM Document WHERE ecm:path = '/FV/Workspaces/Data/%s%s'", langDirectory, languageName);
            Documents language = repository.query(query);
            if (language.size() == 0){
                Document languageNew = Document.createWithName(languageName, "FVDialect");
                languageNew.setPropertyValue("dc:title", languageName);
                languageNew = repository.createDocumentByPath("/FV/Workspaces/Data/" + langDirectory, languageNew);
                languageNew = client.operation("FVEnableDocument").input(languageNew).execute();
            }
            
            // Create users and add them to the language if they dont already exist
            UserManager userManager = client.userManager();
            
            // Language member user
            if (userManager.searchUser(languageName.toUpperCase() + "_MEMBER").size() == 0) {
                User langMemberUser = new User();
                langMemberUser.setUserName(languageName.toUpperCase() + "_MEMBER");
                langMemberUser.setPassword(password);
                langMemberUser.setEmail("@.");
                langMemberUser = userManager.createUser(langMemberUser);
                userManager.addUserToGroup(languageName.toUpperCase() + "_MEMBER",  languageName.toLowerCase() + "_members");
            }
            
            // Language recorder user
            if (userManager.searchUser(languageName.toUpperCase() + "_RECORDER").size() == 0) {
                User langRecorderUser = new User();
                langRecorderUser.setUserName(languageName.toUpperCase() + "_RECORDER");
                langRecorderUser.setPassword(password);
                langRecorderUser.setEmail("@.");
                langRecorderUser = userManager.createUser(langRecorderUser);
                userManager.addUserToGroup(languageName.toUpperCase() + "_RECORDER", languageName.toLowerCase() + "_recorders");
            }
            
            // Language recorder with approval user
            if (userManager.searchUser(languageName.toUpperCase() + "_RECORDER_APPROVER").size() == 0) {
                User langRecorderApprovalUser = new User();
                langRecorderApprovalUser.setUserName(languageName.toUpperCase() + "_RECORDER_APPROVER");
                langRecorderApprovalUser.setPassword(password);
                langRecorderApprovalUser.setEmail("@.");
                langRecorderApprovalUser = userManager.createUser(langRecorderApprovalUser);
                userManager.addUserToGroup(languageName.toUpperCase() + "_RECORDER_APPROVER", languageName.toLowerCase() + "_recorders_with_approval");
            }
            
            // Language admin user
            if (userManager.searchUser(languageName.toUpperCase() + "_ADMIN").size() == 0) {
                User langAdminUser = new User();
                langAdminUser.setUserName(languageName.toUpperCase() + "_ADMIN");
                langAdminUser.setPassword(password);
                langAdminUser.setEmail("@.");
                langAdminUser = userManager.createUser(langAdminUser);
                userManager.addUserToGroup(languageName.toUpperCase() + "_ADMIN", languageName.toLowerCase() + "_language_administrators");
            }
            
            System.out.println("Created \"" + languageName + "\" language successfully.");
            System.exit(0);
            
        }
        catch (NuxeoClientException e) {
            System.out.println("Error with the Nuxeo server: " + e.getMessage());
            System.exit(1);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            System.exit(1);
        }
        
    }
}
