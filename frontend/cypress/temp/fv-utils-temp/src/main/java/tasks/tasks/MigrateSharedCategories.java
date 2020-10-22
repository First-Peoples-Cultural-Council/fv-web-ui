package tasks.tasks;

import com.beust.jcommander.Parameter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.FileNotFoundException;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.objects.Documents;
import org.nuxeo.client.spi.NuxeoClientException;

import tasks.AbstractTask;
import tasks.interfaces.Task;
import tasks.utils.FolderUtils;
import tasks.utils.RepositoryUtils;

import java.io.IOException;
import java.io.PrintStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Collection;

public class MigrateSharedCategories extends AbstractTask implements Task {

    // Name and description
    final private static String programName = "migrate-shared-categories";

    @Parameter(names = { "-runOnSections"}, description = "Flag for whether to run on sections")
    private static Boolean runOnSections = false;

    @Parameter(names = { "-dialectId"}, description = "The UID for the dialect", required = true)
    private static String dialectId = "";

    @Parameter(names = { "-log-dir" }, description = "Where to save the CSV log file to", required = true)
    private static String logDir = "";

    private MigrateSharedCategories() {
        super();
    }

    public static String getDescription() {
        return "This task will migrate categories from Shared Categories to a dialect's own Categories.";
    }

    private static String categoriesField;
    private static String path;
    private static String sharedCategoriesDirectoryId;
    private static Document dialectCategoriesDirectory;
    private static Map<String, Map<String,Document>> cache = null;
    private static String instanceCacheKey;

    public static void execute(String[] argv) throws FileNotFoundException {

        MigrateSharedCategories migrateSharedCategories = new MigrateSharedCategories();

        // Setup command line
        migrateSharedCategories.setupCommandLine(programName, argv);

        // Connect to server
        migrateSharedCategories.connect();

        // Describe connection
        migrateSharedCategories.describeConnection();

        // Disable DC Listener
        RepositoryUtils.disableDCListener(client);

        // If run on sections, update properties accordingly
        categoriesField = (runOnSections) ? "fvproxy:proxied_categories" : "fv-word:categories";
        path = (runOnSections) ? "/FV/sections/" : "/FV/Workspaces/";
        sharedCategoriesDirectoryId = (runOnSections) ? client.repository().fetchDocumentByPath("/FV/sections/SharedData/Shared Categories").getUid() : client.repository().fetchDocumentByPath("/FV/Workspaces/SharedData/Shared Categories").getUid();

        //Set cache key for dialect
        instanceCacheKey = "cache-categories-" + dialectId;

        // Save original out stream.
        PrintStream originalOut = System.out;
        // Save original err stream.
        PrintStream originalErr = System.err;

        // Create a new file output stream.
        PrintStream fileOut = new PrintStream(logDir + "/category-migration-of-" + dialectId + "-output.txt");
        // Create a new file error stream.
        PrintStream fileErr = new PrintStream(logDir + "/category-migration-of-" + dialectId + "-errors.txt");

        // Redirect standard out to file.
        System.setOut(fileOut);
        // Redirect standard err to file.
        System.setErr(fileErr);


        // Perform actions
        try {

            // Get Dialect Categories Directory
            dialectCategoriesDirectory = getDialectCategoriesDirectory();

            // Get UID for Dialect Categories Directory
            String dialectCategoriesDirectoryId = dialectCategoriesDirectory.getId();

            // Add existing categories from dialect to cache
            buildCache();

            // Get list of all Shared Categories
            List<Document> sharedCategoriesList = getSharedCategoriesList();

            // Get list of all Shared Parent Categories
            Documents sharedParentCategories = FolderUtils.getChildren(client, sharedCategoriesDirectoryId, 0, 1000, "", "*", false, false);


            for ( Document sharedCategory : sharedCategoriesList ) {

                String categoryTitle = sharedCategory.getTitle();

                System.out.println("***");
                System.out.println("Category: " + categoryTitle + " (" + sharedCategory.getId() + "):");

                //Find shared Parent Category Doc if it exists or else return the Dialect Categories directory doc
                Document parentDoc = sharedParentCategories.streamEntries()
                        .filter(sharedParentCategory -> sharedParentCategory.getId().equals(sharedCategory.getParentRef()))
                        .findFirst()
                        .orElse(dialectCategoriesDirectory);

                //Search for words in dictionary that reference the category
                Documents wordsInCategory = findCategoryReferences(path, categoriesField, sharedCategory);

                //If results not null...
                if (wordsInCategory.size() > 0) {

                    // Check if category exists in dialect
                    Document matchedCategory = getFromCache(categoryTitle);

                    // Check if parent category exists in dialect
                    Document matchedParentCategory = getFromCache(parentDoc.getTitle());

                    // Create category if it doesn't exist
                    Document dialectCategory;
                    if (matchedCategory != null) {
                        System.out.println("Category: " + categoryTitle + " exists in  " + dialectId + " Category Directory ");
                        dialectCategory = matchedCategory;
                    } else if (parentDoc.getId().equals(dialectCategoriesDirectoryId)) {
                        System.out.println("Creating category: "+ categoryTitle + " in " + dialectId + " Category Directory ");
                        dialectCategory = createCategory(sharedCategory, dialectCategoriesDirectoryId);
                    } else if (matchedParentCategory != null) {
                        System.out.println("Creating category: "+ categoryTitle + " in " + matchedParentCategory.getTitle() + " category");
                        dialectCategory = createCategory(sharedCategory, matchedParentCategory.getId());
                    } else {
                        System.out.println("Creating parent category: "+ parentDoc.getTitle() + " in  " + dialectId + " Category Directory ");
                        Document newDialectParentCategory = createCategory(parentDoc, dialectCategoriesDirectoryId);
                        System.out.println("Creating category: "+ categoryTitle + " in " + newDialectParentCategory.getTitle() + " category");
                        dialectCategory = createCategory(sharedCategory, newDialectParentCategory.getId());
                    }

                    // Update references on words to now reference the dialect category
                    wordsInCategory.streamEntries().forEach( word -> {
                        updateReferenceDoc(word, categoriesField, sharedCategory, dialectCategory);
                    });

                    System.out.println("***");
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

            System.out.flush();
            System.setOut(originalOut);
            System.setErr(originalErr);
        }
    }

    private static Document getFromCache(String title) {
        if (!cache.containsKey(instanceCacheKey)) {
            return null;
        }
        if (title != null && cache.get(instanceCacheKey).containsKey(title)) {
            return cache.get(instanceCacheKey).get(title);
        }
        return null;
    }

    private static void cacheDocument(Document doc) {
        cache.get(instanceCacheKey).put(doc.getTitle(), doc);
    }

    private static void buildCache() throws IOException {
        if (cache == null) {
            cache = new HashMap<String, Map<String,Document>>();
        }
        if (!cache.containsKey(instanceCacheKey)) {
            cache.put(instanceCacheKey, new HashMap<String, Document>());;
        }
        loadCache(getCacheQuery());
    }

    private static void loadCache(String query) {

        System.out.println("Loading cache...");
        Documents docs = RepositoryUtils.getDocumentsFromQuery(client, 0, 1000, query, "");
        for (int i = 0; i < docs.size(); i++) {
            cacheDocument(docs.getDocument(i));
        }
        System.out.println("Caching Complete.");
    }

    private static String getCacheQuery() {
        // Include all categories from Dialect
        return "SELECT * FROM FVCategory WHERE ecm:ancestorId = '" + dialectCategoriesDirectory.getId() + "'AND ecm:isTrashed = 0 AND ecm:isVersion = 0";
    }

    private static Document getDialectCategoriesDirectory() {
        String query = "SELECT * FROM FVCategories " +
                "WHERE fva:dialect = '" + dialectId + "' " +
                "AND ecm:path STARTSWITH '" + path + "' " +
                "AND dc:title = 'Categories' " +
                "AND ecm:isTrashed = 0 " +
                "AND ecm:isVersion = 0";
        Documents categories = RepositoryUtils.getDocumentsFromQuery(client, 0, 1000, query, "");
        List<Document> documentsList = categories.streamEntries().collect(Collectors.toList());
        return documentsList.get(0);
    }

    private static List<Document> getSharedCategoriesList() {
        String query = "SELECT * FROM FVCategory " +
                "WHERE ecm:ancestorId = '" + sharedCategoriesDirectoryId + "'"+
                "AND ecm:isTrashed = 0 " +
                "AND ecm:isVersion = 0";
        Documents documentsFromQuery = RepositoryUtils.getDocumentsFromQuery(client, 0, 1000, query, "");
        return documentsFromQuery.streamEntries().collect(Collectors.toList());
    }

    private static void updateReferenceDoc(Document word, String field, Document sharedCategory, Document dialectCategory) {
        System.out.println("For reference document " + word.getPath() + " | Title " + word.getTitle() + " | ID " + word.getId());

        Collection<String> fv_word_categories = word.getPropertyValue(field);

        System.out.println("fv-word:categories were " + fv_word_categories);

        //Remove any duplicate category references
        List<String> fv_word_categories_reduced = fv_word_categories.stream()
                .distinct()
                .collect(Collectors.toList());

        if (fv_word_categories_reduced.indexOf(sharedCategory.getId()) != -1) {

            // Check for unpublished changes on the word
            ObjectMapper objectMapper = new ObjectMapper();
            ObjectNode unpublishedChangesExist = null;
            try {
                unpublishedChangesExist = objectMapper.readValue(client.operation("Document.CheckUnpublishedChanges").input(word.getId()).execute().toString(), ObjectNode.class);
            } catch (IOException e) {
                e.printStackTrace();
            }

            // Update word
            fv_word_categories_reduced.set(fv_word_categories_reduced.indexOf(sharedCategory.getId()), dialectCategory.getId());
            word.setPropertyValue(field, fv_word_categories_reduced);
            System.out.println("Categories updated for '" + word.getTitle() + "' to " + fv_word_categories_reduced.toString());
            word.updateDocument();

            // If the check for unpublished changes operation returns a false value then republish the word.
            if (unpublishedChangesExist != null && unpublishedChangesExist.get("value").toString().equals("false")) {
                if (word.getState().equals("Published")) {
                    System.out.println("Republish " + word.getTitle());
                    client.operation("Document.FollowLifecycleTransition")
                        .input(word.getId())
                        .param("value", "Republish")
                        .execute();
                }
            }
        }
    }

    private static Documents findCategoryReferences(String path, String field, Document category ) {
        String query =  "SELECT * FROM FVWord " +
                "WHERE fva:dialect = '" + dialectId + "' " +
                "AND (" + field + "/* = '"+ category.getId() +"') " +
                "AND ecm:path STARTSWITH '" + path + "' " +
                "AND ecm:isVersion = 0";

        Documents wordsInCategory = RepositoryUtils.getDocumentsFromQuery(client, 0, 1000, query, "");
        System.out.println("'"+ category.getTitle() + "' referenced in " + wordsInCategory.getResultsCount() + " docs.");

        return wordsInCategory;
    }

    private static Document createCategory(Document categoryDoc, String directory) {
        Document newCategory = Document.createWithName(categoryDoc.getTitle(), categoryDoc.getType());
        newCategory.setProperties(categoryDoc.getProperties());
        newCategory = client.repository().createDocumentById(directory, newCategory);
        cacheDocument(newCategory);

        return newCategory;
    }

}
