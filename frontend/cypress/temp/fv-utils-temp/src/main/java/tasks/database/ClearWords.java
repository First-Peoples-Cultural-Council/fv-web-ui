package tasks.database;

import com.beust.jcommander.Parameter;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.objects.Repository;
import org.nuxeo.client.spi.NuxeoClientException;
import tasks.AbstractTask;
import tasks.interfaces.Task;

public class ClearWords extends AbstractTask implements Task {
  
  // Name and description
  final private static String programName = "clear-words";
  
  @Parameter(names = { "-language-name" }, description = "The name of the language whose words you want to clear.", required = true)
  private static String languageName;
  
  @Parameter(names = { "-language-directory" }, description = "The directory for the language, rooted at /FV/Wordspaces/Data/", required = true)
  private static String langDirectory;
  
  private ClearWords() { super(); }
  
  public static String getDescription() {
    return "This task will clear all the words contained within the language.";
  }
  
  public static void execute(String[] argv) {
    
    ClearWords clearWords = new ClearWords();
    
    // Setup command line
    clearWords.setupCommandLine(programName, argv);
    
    // Connect to server
    clearWords.connect();
    
    // Describe connection
    clearWords.describeConnection();
    
    try {
      
      // Get repository manager
      Repository repository = client.repository();
      
      // Delete words folder
      Document folder = repository.fetchDocumentByPath("/FV/Workspaces/Data/" + langDirectory + languageName + "/Dictionary");
      String UID = folder.getUid();
      repository.deleteDocument(UID);
      
      // Create fresh words folder
      Document newFolder = Document.createWithName("Dictionary", "FVDictionary");
      newFolder.setPropertyValue("dc:title", "Dictionary");
      newFolder = repository.createDocumentByPath("/FV/Workspaces/Data/" + langDirectory + languageName + "/", newFolder);
      
      
      System.out.println("Deleted words for \"" + languageName + "\" successfully.");
      System.exit(0);
      
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
  
}
