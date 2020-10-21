package tasks.tasks;

import org.apache.commons.lang3.ArrayUtils;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.objects.Documents;
import org.nuxeo.client.spi.NuxeoClientException;
import tasks.AbstractTask;
import tasks.interfaces.Task;
import tasks.utils.CsvUtils;
import tasks.utils.RepositoryUtils;

import java.util.List;
import java.util.stream.Collectors;

public class MigrateAllSharedCategories extends AbstractTask implements Task {

    protected static CsvUtils csv = null;

    // Name and description
    final private static String programName = "general-task";

    private MigrateAllSharedCategories() {
        super();
    }

    public static String getDescription() {
        return "This is a specific task to run migrate-shared-categories on all dialects.";
    }

    public static void execute(String[] argv) {

        MigrateAllSharedCategories migrateAllSharedCategories = new MigrateAllSharedCategories();

        // Setup command line
        migrateAllSharedCategories.setupCommandLine(programName, argv);

        // Connect to server
        migrateAllSharedCategories.connect();

        // Describe connection
        migrateAllSharedCategories.describeConnection();

        // Perform actions
        try {
            // DY: Make index and size arguments that can be provided
            String dialectsQuery = "SELECT ecm:uuid FROM FVDialect WHERE ecm:path STARTSWITH '/FV/Workspaces'AND ecm:isTrashed = 0 AND ecm:isVersion = 0";
            Documents dialects = RepositoryUtils.getDocumentsFromQuery(client, 0, 1000, dialectsQuery, "");
            List<Document> dialectList = dialects.streamEntries().collect(Collectors.toList());

            for (Document dialect : dialectList) {

                String[] dialectId = new String[]{"-dialectId", dialect.getId()};
                String[] newArgs = ArrayUtils.addAll(argv, dialectId);
                MigrateSharedCategories.execute(newArgs);

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
