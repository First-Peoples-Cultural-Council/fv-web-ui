package tasks.dictionary.fromCSV;

import com.beust.jcommander.Parameter;
import java.util.ArrayList;
import java.util.List;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.objects.Documents;
import org.nuxeo.client.spi.NuxeoClientException;
import tasks.AbstractImportTask;
import tasks.interfaces.Task;

public class DictionaryRelatedAssetsAssignment extends AbstractImportTask implements Task {

    // Name and description
    final private static String programName = "dictionary-import-operation";

    // Parameters specific to this task

    @Parameter(names = { "-dictionaryId" }, description = "The ID of the dictionary you want to do work in", required = true)
    private static String dictionaryId;

    private DictionaryRelatedAssetsAssignment() {
        super();
    }

    public static String getDescription() {
        return "Assigns related assets based on a CSV file.";
    }

    private static void linkWordsOperation(Document primaryWord, String linkedAssetId) {
        client
            .operation("DocumentMultivaluedProperty.addItem")
            .input(primaryWord)
            .param("value", linkedAssetId)
            .param("xpath", "fv:related_assets")
            .param("checkExists", true)
            .param("save", true)
            .execute();
    }

    /**
     * Handles linking one word to one word, based on legacy IDs
     * @param primaryId
     * @param assetId
     * @throws Exception
     */
    private static void linkWords(String primaryId, String assetId) throws Exception {
        assetId = assetId.trim();
        primaryId = primaryId.trim();

        System.out.println("---------------------------");
        System.out.println("Evaluating linking ID " + primaryId + " to " + assetId);
        Document primaryWord = getDocumentByLegacyId(primaryId);
        Document linkedAsset = getDocumentByLegacyId(assetId);

        // Link words

        ArrayList<String> primaryWordsLinkedAssets = primaryWord.getPropertyValue("fv:related_assets");

        if (primaryWordsLinkedAssets == null || !primaryWordsLinkedAssets.contains(linkedAsset.getId())) {
            System.out.println("Linking Word " + primaryWord.getTitle() + " to " + linkedAsset.getTitle());
            linkWordsOperation(primaryWord, linkedAsset.getId());
            System.out.println("Word with GUID " + primaryWord.getId() + " linked.");
        }
    }

    /**
     * Handles linking one word to many words, based on legacy Ids
     * @param primaryId
     * @param assetIds
     * @throws Exception
     */
    private static void linkWords(String primaryId, String[] assetIds) throws Exception {
        primaryId = primaryId.trim();
        Document primaryWord = getDocumentByLegacyId(primaryId);

        ArrayList<String> primaryWordsLinkedAssets = primaryWord.getPropertyValue("fv:related_assets");

        for (String relatedAssetId : assetIds) {
            try {
                String assetId = relatedAssetId.trim();
                System.out.println("---------------------------");
                System.out.println("Evaluating linking ID " + primaryId + " to " + assetId);

                Document linkedAsset = getDocumentByLegacyId(assetId);

                if (primaryWordsLinkedAssets.contains(linkedAsset.getId())) {
                    //System.out.println(primaryWord.getTitle() + " already linked to " + linkedAsset.getTitle());
                    continue;
                }

                primaryWordsLinkedAssets.add(relatedAssetId);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        linkWordsOperation(primaryWord, primaryWordsLinkedAssets.toString());
        System.out.println("Word with GUID " + primaryWord.getId() + " linked to multiple entries: " + primaryWordsLinkedAssets.toString());
    }

    private static Document getDocumentByLegacyId(String legacyId) throws Exception {
        Documents docs = client.schemas("fvcore").repository().query("SELECT * FROM FVWord WHERE fvl:import_id-v2 = '" + legacyId + "' AND ecm:parentId = '" + dictionaryId + "' AND ecm:isTrashed = 0 AND ecm:isProxy = 0 AND ecm:isVersion = 0");
        if (docs.size() == 0) {
            throw new Exception("Word with legacy ID " + legacyId + " not found in DB");
        }
        return docs.getDocument(0);
    }

    public static void execute(String[] argv) {

        DictionaryRelatedAssetsAssignment dictionaryRelatedItemsAssignment = new DictionaryRelatedAssetsAssignment();

        // Setup command line
        dictionaryRelatedItemsAssignment.setupCommandLine(programName, argv);

        // Setup CSV input
        dictionaryRelatedItemsAssignment.setupCSVInput();

        // Connect to server
        dictionaryRelatedItemsAssignment.connect();

        // Describe connection
        dictionaryRelatedItemsAssignment.describeConnection();

        // Perform actions
        try {
            if (csvReader != null) {

                List<String[]> records = csvReader.readAll();
                for (String[] record : records) {

                    String primaryId = record[0];
                    String relatedAssetsList = record[1];

                    if (!relatedAssetsList.contains(";")) {
                        // If we are dealing with a single related assets
                        linkWords(primaryId, relatedAssetsList);
                    }
                    else {
                        // If we are dealing with a list of related assets
                        linkWords(primaryId, relatedAssetsList.split(";"));
                    }
                }

                System.out.println("-> Operation and validation complete.");
            } else {
                System.out.println("-> CSV file null; no operation run.");
            }
        }
        catch (NuxeoClientException e) {
            System.out.println("## ERROR! Connecting to Nuxeo server. Is your dialect GUID correct? " + e.getMessage() + " ##");
            e.printStackTrace();
        }
        catch (Exception e) {
            System.out.println("## ERROR! " + e.getMessage() + " ##");
            e.printStackTrace();
        }
    }
}
