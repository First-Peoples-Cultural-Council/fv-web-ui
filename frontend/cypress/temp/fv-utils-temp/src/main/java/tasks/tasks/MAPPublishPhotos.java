package tasks.tasks;

import org.nuxeo.client.objects.Documents;
import org.nuxeo.client.spi.NuxeoClientException;
import tasks.AbstractTask;
import tasks.interfaces.Task;
import tasks.utils.CsvUtils;

public class MAPPublishPhotos extends AbstractTask implements Task {

    protected static CsvUtils csv = null;

    // Name and description
    final private static String programName = "mentor-apprentice-publish-photos-task";

    final private static String IDWorkspaceFolder = "bc1ef9b6-60ae-45cd-ad64-8d43f8f89328";
    final private static String IDSectionsFolder = "8bf0dc52-1cda-46f5-8537-dad1d0ee8f66";

    private MAPPublishPhotos() {
        super();
    }

    public static String getDescription() {
        return "This is a specific task to publish pictures for MAP photo project.";
    }

    public static void execute(String[] argv) {

        MAPPublishPhotos mapPublishPhotosTask = new MAPPublishPhotos();

        // Setup command line
        mapPublishPhotosTask.setupCommandLine(programName, argv);

        // Connect to server
        mapPublishPhotosTask.connect();

        // Describe connection
        mapPublishPhotosTask.describeConnection();

        // Perform actions
        try {

            String query = "SELECT * FROM FVPicture WHERE ecm:parentId = '" + IDWorkspaceFolder + "'";

            Documents docs = client
                    .schemas("fvcore", "fvdialect")
                    .operation("Repository.Query")
                    .param("currentPageIndex", 0)
                    .param("pageSize", 1000)
                    .param("query", query)
                    .execute();

            docs.getDocuments().stream().forEach(doc -> {
                if (!doc.getState().equals("Published")) {
                    client.operation("Document.FollowLifecycleTransition")
                        .input(doc)
                        .param("value", "Publish")
                        .execute();
                }
                client.operation("Document.PublishToSection")
                    .input(doc)
                    .param("target", IDSectionsFolder)
                    .param("override", true)
                    .execute();
            });

            System.out.println("-> Found a total of of [" + docs.getResultsCount() + "] In this iteration [" + docs.size() + "] tasks.");

        }
        catch (NuxeoClientException e) {
            System.out.println("Error connecting to Nuxeo server. Is your dialect GUID correct?" + e.getMessage());
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

}
