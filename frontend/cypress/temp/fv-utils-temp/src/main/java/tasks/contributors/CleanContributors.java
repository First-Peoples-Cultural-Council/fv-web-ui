package tasks.contributors;

import com.beust.jcommander.Parameter;
import com.opencsv.CSVReader;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.objects.Documents;
import org.nuxeo.client.spi.NuxeoClientException;
import tasks.AbstractTask;
import tasks.interfaces.Task;
import tasks.utils.DocumentUtils;
import tasks.utils.FolderUtils;
import tasks.utils.RepositoryUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CleanContributors extends AbstractTask implements Task {

    protected static CSVReader csvReader = null;

    // Name and description
    final private static String programName = "contributors-clean-records";

    @Parameter(names = { "-runOnSections"}, description = "Flag for whether to run on sections")
    private static Boolean runOnSections = false;

    @Parameter(names = { "-contributorsDir"}, description = "The parent directory of the contributors", required = true)
    private static String contributorsDir = "";

    @Parameter(names = { "-dictionaryDir"}, description = "The UID for the dictionary", required = true)
    private static String dictionaryDir = "";

    @Parameter(names = { "-resourcesDir"}, description = "The UID for the resources directory", required = true)
    private static String resourcesDir = "";

    private CleanContributors() {
        super();
    }

    public static String getDescription() {
        return "This task will consolidate duplicates based on a list and update references; should be run on Workspaces and then Sections.";
    }

    public static void execute(String[] argv) {

        /**
         * TODO: Add some fuzzy search to comparison:
         * http://commons.apache.org/proper/commons-codec/apidocs/org/apache/commons/codec/language/Metaphone.html
         * http://commons.apache.org/proper/commons-codec/apidocs/org/apache/commons/codec/language/Soundex.html
         * http://commons.apache.org/proper/commons-lang/apidocs/org/apache/commons/lang3/StringUtils.html#getLevenshteinDistance%28java.lang.CharSequence,%20java.lang.CharSequence%29
         * https://gist.github.com/shathor/8ad04d8923d6c07fd2f4a06e9543bebf
         * https://github.com/xdrop/fuzzywuzzy
         */

        Map<String, Boolean> contributors = new HashMap<String, Boolean>();

        // Add list of contributors to keep here:

        contributors.put("ɬaʔəmɩn elders", true);
        contributors.put("Betty Wilson", false);
        contributors.put("Dave Dominick", false);
        contributors.put("Devin Pielle", false);
        contributors.put("Elsie Paul", false);
        contributors.put("Alex Point",true);
        contributors.put("Anne Dominick",true);
        contributors.put("B. Wilson",false);
        contributors.put("Brenda Pielle",false);
        contributors.put("Charlie Bob",true);
        contributors.put("Charlie Timothy",false);
        contributors.put("Connie Wilson",true);
        contributors.put("Dakota Gustafson",false);
        contributors.put("Dana Gustafson",false);
        contributors.put("Dave Dominick",true);
        contributors.put("Devin Pielle",false);
        contributors.put("Doreen Point",true);
        contributors.put("Drew Blaney",false);
        contributors.put("Elizabeth (Keekus) Harry",false);
        contributors.put("Elsie Paul",true);
        contributors.put("Emily August",true);
        contributors.put("Ernie Harry",true);
        contributors.put("Eugene Louie",true);
        contributors.put("Fred Louie",true);
        contributors.put("Gail Blaney",false);
        contributors.put("Gerry Francis",false);
        contributors.put("Gerry Galligos",false);
        contributors.put("James Timothy",false);
        contributors.put("Joe Wilson",true);
        contributors.put("John Harry",true);
        contributors.put("John Louie",true);
        contributors.put("Karen qwastanukt Galligos",false);
        contributors.put("Larry Louie",true);
        contributors.put("Leonard Harry",false);
        contributors.put("Les Adams",true);
        contributors.put("Mabel Harry",true);
        contributors.put("Maggie Wilson",true);
        contributors.put("Manue Luaifoa",false);
        contributors.put("Margaret Vivier",true);
        contributors.put("Marion Harry",true);
        contributors.put("Mary George",true);
        contributors.put("Mary Harry",true);
        contributors.put("Peggy Harry",true);
        contributors.put("Peter August",true);
        contributors.put("Phil Russell",  	false	);
        contributors.put("Randy Timothy Sr.",false);
        contributors.put("Robert Blaney",true);
        contributors.put("Rose Adams",false);
        contributors.put("Ryan Pielle",false);
        contributors.put("Sosan Blaney",false);
        contributors.put("Yvonne Galligos",false);

        CleanContributors cleanContributors = new CleanContributors();

        // Setup command line
        cleanContributors.setupCommandLine(programName, argv);

        // Connect to server
        cleanContributors.connect();

        // Describe connection
        cleanContributors.describeConnection();

        // Disable DC Listener
        RepositoryUtils.disableDCListener(client);

        // If run on sections, update properties accordingly

        final String sourceField = (runOnSections) ? "fvproxy:proxied_source" : "fv:source";
        final String recorderField = (runOnSections) ? "fvproxy:proxied_recorder" : "fvm:recorder";
        final String mediaSourceField = (runOnSections) ? "fvproxy:proxied_source" : "fvm:source";

        // Perform actions
        try {

            Documents existingContributorsDoc = FolderUtils.getChildren(client, contributorsDir, 0, 1000, "", "*", false, false);

            for (Map.Entry<String, Boolean> contributor : contributors.entrySet()) {
                System.out.println(contributor.getKey() + ":");

                List<Document> existingContributorsDocDups = existingContributorsDoc.streamEntries().filter(possibleDup ->
                        possibleDup.getTitle().toLowerCase().trim().equals(contributor.getKey().toLowerCase().trim()))
                        .collect(Collectors.toList());

                if (existingContributorsDocDups.size() > 1) {

                    int i = 0;

                    System.out.println("Found " + existingContributorsDocDups.size() + " duplicate contributors.");


                    for (Document contributorDup : existingContributorsDocDups) {

                        // Store details of first contributor, and skip to next one.
                        if (i == 0) {
                            System.out.println("Will keep first contributor: "+ existingContributorsDocDups.get(0).getId() + "/ "+ existingContributorsDocDups.get(0).getTitle());
                            ++i;
                            continue;
                        }

                        String query =  "SELECT * FROM FVWord, FVPhrase, FVAudio, FVVideo, FVPicture " +
                                        "WHERE (ecm:parentId = '" + dictionaryDir + "' OR ecm:parentId = '" + resourcesDir + "') " +
                                        "AND (" +
                                            sourceField + "/* = '"+contributorDup.getId()+"' OR " +
                                            recorderField + "/* = '"+contributorDup.getId()+"' OR " +
                                            mediaSourceField + "/* = '"+contributorDup.getId()+"'" +
                                        ") " +
                                        "AND ecm:isVersion = 0";

                        Documents duplicateRecords = RepositoryUtils.getDocumentsFromQuery(client, 0, 1000, query, "");

                        System.out.println("***");
                        System.out.println("Duplicate contributor: "+ contributorDup.getId() + "/ "+ contributorDup.getTitle());
                        System.out.println("Referenced in " + duplicateRecords.getResultsCount() + " docs.");


                        duplicateRecords.streamEntries().forEach(dupReference -> {
                            System.out.println("For reference doc " + dupReference.getPath() + " | Title " + dupReference.getTitle() + " | ID " + dupReference.getId());

                            List<String> source = dupReference.getPropertyValue(sourceField);
                            List<String> recorder = dupReference.getPropertyValue(recorderField);
                            List<String> fvm_source = dupReference.getPropertyValue(mediaSourceField);

                            updateReferenceDoc(dupReference, source, sourceField, contributorDup, existingContributorsDocDups.get(0));
                            updateReferenceDoc(dupReference, recorder, recorderField, contributorDup, existingContributorsDocDups.get(0));
                            updateReferenceDoc(dupReference, fvm_source, mediaSourceField, contributorDup, existingContributorsDocDups.get(0));
                        });

                        if (contributorDup.isProxy()) {
                            client.repository().deleteDocument(contributorDup.getId());
                        } else {
                            DocumentUtils.softDeleteDocument(client, contributorDup.getId());
                        }

                        System.out.println("***");

                        ++i;
                    }
                }
            }
        }
        catch (NuxeoClientException e) {
            System.out.println("Error connecting to Nuxeo server. Is your dialect GUID correct?"+ e.getMessage());
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }
        finally {
            // Enable DC Listener
            RepositoryUtils.enableDCListener(client);
        }
    }

    private static void updateReferenceDoc(Document dupReference, List<String> source, String field, Document contributorDup, Document contributorToKeep) {
        if (source != null && source.indexOf(contributorDup.getId()) != -1) {
            source.set(source.indexOf(contributorDup.getId()), contributorToKeep.getId());
            dupReference.setPropertyValue(field, source);
            System.out.println("Source updated on " + field + " to " + source.toString());
            dupReference.updateDocument();
        }
    }
}
