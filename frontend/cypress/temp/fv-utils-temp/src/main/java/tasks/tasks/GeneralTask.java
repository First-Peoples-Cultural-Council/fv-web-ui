package tasks.tasks;

import org.nuxeo.client.objects.Documents;
import org.nuxeo.client.objects.acl.ACL;
import org.nuxeo.client.objects.user.Group;
import org.nuxeo.client.spi.NuxeoClientException;
import tasks.AbstractTask;
import tasks.interfaces.Task;
import tasks.utils.CsvUtils;

public class GeneralTask extends AbstractTask implements Task {

    protected static CsvUtils csv = null;

    // Name and description
    final private static String programName = "general-task";

    private GeneralTask() {
        super();
    }

    public static String getDescription() {
        return "This is a general task to run other tasks.";
    }

    public static void execute(String[] argv) {

        GeneralTask generalTask = new GeneralTask();

        // Setup command line
        generalTask.setupCommandLine(programName, argv);

        // Connect to server
        generalTask.connect();

        // Describe connection
        generalTask.describeConnection();

        // Perform actions
        try {

            String query = "SELECT * FROM FVDialect WHERE " +
                " ecm:path STARTSWITH '/FV/Workspaces'" +
                " ORDER BY dc:created DESC";

            Documents docs = client
                    .schemas("fvcore", "fvdialect")
                    .operation("Repository.Query")
                    .param("currentPageIndex", 0)
                    .param("pageSize", 1000)
                    .param("query", query)
                    .execute();

            docs.getDocuments().stream().forEach(dialect -> {
                //System.out.print(dialect.getTitle() + ",");
                ACL test = dialect.fetchPermissions().getAcls().get(0);
                String test1 = test.getAces().get(0).getUsername();
                //System.out.print(test1 + ",");

                if (client.userManager().searchGroup(test1).getGroups().size() == 0) {
                    System.out.println("Group does not exist " + test1 + " for ");
                } else {
                    Group gp = client.userManager().fetchGroup(test1);
                    //System.out.println(gp.fetchMemberUsers().getUsers().size());
                    //System.out.println("");

                    if (gp.fetchMemberUsers().getUsers().size() == 0) {

                        System.out.println(
                            dialect.getTitle() + "," +
                            "\"https://www.firstvoices.com/explore" + dialect.getPath().replace(" ","%20")+"\"," +
                            dialect.getPropertyValue("fvdialect:region") + "," +
                            dialect.getPropertyValue("fvdialect:country")
                        );
                    }
                }


            });

            // Code to handle reverting to new after publishing

//            // tag documents
//
//            String query = "SELECT * FROM Document WHERE " +
//                " ecm:ancestorId = 'cea90fbe-6394-4be0-8560-4ee341a8a67a' AND ecm:currentLifeCycleState = 'New' AND ecm:isVersion = 0 AND ecm:isProxy = 0";
//
//            Documents docs = client
//                .operation("Repository.Query")
//                .param("currentPageIndex", 0)
//                .param("pageSize", 5000)
//                .param("query", query)
//                .execute();
//
//            docs.getDocuments().stream().forEach(doc -> {
//                System.out.println(doc.getType() + "|" + doc.getTitle() + "|" + doc.getId() + "|");
//
//                client.operation("Document.SetProperty")
//                    .input(doc)
//                    .param("xpath", "fvl:change_date")
//                    .param("save", true)
//                    .param("value", "ShouldBeNew")
//                    .execute();
//
//                client
//                    .operation("Services.TagDocument")
//                    .input(doc)
//                    .param("tags", "ShouldBeNew")
//                    .execute();
//
//            });
//
//
//            // Revert to New (after publishing)
//
//            String query1 = "SELECT * FROM Document WHERE fvl:change_date LIKE 'ShouldBeNew' AND ecm:isVersion = 0 AND ecm:isProxy = 0";
//
//            Documents docs1 = client
//                .operation("Repository.Query")
//                .param("currentPageIndex", 0)
//                .param("pageSize", 5000)
//                .param("query", query1)
//                .execute();
//
//            docs1.getDocuments().stream().forEach(doc -> {
//                System.out.println(doc.getType() + "|" + doc.getTitle() + "|" + doc.getId() + "|");
//
//                client.operation("Document.FollowLifecycleTransition")
//                    .input(doc)
//                    .param("value", "RevertToNew")
//                    .execute();
//
//                client.operation("Document.RemoveProperty")
//                    .input(doc)
//                    .param("xpath", "fvl:change_date")
//                    .param("save", true)
//                    .execute();
//
//                client.operation("Services.UntagDocument")
//                    .input(doc)
//                    .param("tags", "ShouldBeNew")
//                    .execute();
//            });
//
//            System.out.println("-> Found a total of of [" + docs1.getResultsCount() + "] In this iteration [" + docs1.size() + "] tasks.");

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
