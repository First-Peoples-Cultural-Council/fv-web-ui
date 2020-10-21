package tasks.dictionary;

import com.beust.jcommander.Parameter;
import com.fasterxml.jackson.databind.ObjectMapper;
import models.AppCompatibleEntity;
import models.AppCompatiblePhrase;
import models.AppCompatibleWord;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.objects.Documents;
import org.nuxeo.client.objects.blob.StreamBlob;
import org.nuxeo.client.spi.NuxeoClientException;
import tasks.interfaces.Task;
import tasks.utils.CsvUtils;
import tasks.utils.RepositoryUtils;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class DictionaryAppCompatibleExport extends DictionaryTask implements Task {

    protected static CsvUtils csv = null;

    // Name and description
    final private static String programName = "dictionary-app-compatible-export";

    @Parameter(names = { "-export-dir" }, description = "Where to export the JSON file and folders to", required = true)
    protected String exportDir = "";

    @Parameter(names = { "-downloadBlobs" }, description = "Whether or not blobs (audio/images) should be downloaded")
    protected Boolean downloadBlobs = false;

    @Parameter(names = { "-slugifyBlobs" }, description = "Whether or not blobs (audio/images) should use GUIDs vs. real file names")
    protected Boolean slugifyGUIDs = false;

    @Parameter(names = { "-generateCSV" }, description = "Whether or not to generate a CSV file in addition to a JSON export")
    protected static Boolean generateCSV = false;

    @Parameter(names = { "-exportType" }, description = "Object type to export. By default - these are words.")
    protected static String exportType = "FVWord";

    @Parameter(names = { "-remotePath" }, description = "Optionally set a remote path (e.g. to an S3 bucket)")
    protected static String remotePath = null;

    private ArrayList<AppCompatibleEntity> results = new ArrayList<>();

    private static Documents sharedCategories = null;

    private static List<Document> audioCache = new ArrayList<>();

    private DictionaryAppCompatibleExport() {
        super();
    }

    public static String getDescription() {
        return "Provides an Android/iOS app compatible export, that can include downloading blobs. Run on 'sections' recommended.";
    }

    public static void execute(String[] argv) {

        DictionaryAppCompatibleExport dictionaryAppCompatibleExport = new DictionaryAppCompatibleExport();

        // Setup command line
        dictionaryAppCompatibleExport.setupCommandLine(programName, argv);

        // Connect to server
        dictionaryAppCompatibleExport.connect();

        // Describe connection
        dictionaryAppCompatibleExport.describeConnection();

        // Perform actions
        try {
            // Set WHERE clause to type of data (e.g. FVWord, FVPhrase)
            dictionaryAppCompatibleExport.setWhere("AND ecm:primaryType = '"+ exportType +"' " + where);

            // Get/Set dictionary object and size
            dictionaryAppCompatibleExport.setDictionaryData();

            // Setup Export Dir
            dictionaryAppCompatibleExport.setupExportDir();

            // Setup CSV Export
            if (generateCSV) {
                dictionaryAppCompatibleExport.setupCSVOutput();
            }

            // Get list of categories from FV
            sharedCategories = RepositoryUtils.getDocumentsFromQuery(client, 0, 1000, "SELECT * FROM FVCategory WHERE fva:dialect IS NULL AND ecm:isTrashed = 0 AND ecm:isVersion = 0", "");

            // Get list of audio files (for speaker info)
            cacheAudio();

            // Operate on dictionary items
            dictionaryAppCompatibleExport.operateOnItemsAsDocuments();

            // Write results to file
            dictionaryAppCompatibleExport.writeResults();

            System.out.println("-> Operation and validation complete.");
        }
        catch (NuxeoClientException e) {
            System.out.println("Error connecting to Nuxeo server. Is your dialect GUID correct? " + e.getMessage());
            e.printStackTrace();
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }
        finally {
            System.out.println("Last operations was evaluated on " + currentIteration + ", total impacted: " + changedObjects);
            client.disconnect();
        }
    }

    private static void cacheAudio() {
        // Get first 1000 audio records
        Documents audioResults = RepositoryUtils.getDocumentsFromQuery(client, 0, 1000, "SELECT * FROM FVAudio WHERE ecm:path STARTSWITH \""+ dictionary.getPath().replace("Dictionary", "Resources") + "\" AND ecm:isTrashed = 0 AND ecm:isVersion = 0", "", "media");

        // Add results to cache
        audioCache = Stream.concat(audioCache.stream(), audioResults.getDocuments().stream())
                .collect(Collectors.toList());

        // Iterate over next audio results to fill cache
        int totalAudioResultCount = audioResults.getResultsCount();
        int iterations = (int) Math.ceil(totalAudioResultCount / 1000);

        for (int i = 0; i < iterations; ++i) {
            audioResults = RepositoryUtils.getDocumentsFromQuery(client, (i+1), 1000, "SELECT * FROM FVAudio WHERE ecm:path STARTSWITH \""+ dictionary.getPath().replace("Dictionary", "Resources") + "\" AND ecm:isTrashed = 0 AND ecm:isVersion = 0", "", "media");
//            System.out.println("-> Filling cache for audio; iteration #" + i + ", total: " + totalAudioResultCount);
            audioCache = Stream.concat(audioCache.stream(), audioResults.getDocuments().stream())
                    .collect(Collectors.toList());
        }

        System.out.println("-> Audio cache contains #" + audioCache.size() + " records.");
    }

    private Document getFromAudioCache(String uid) {
        return audioCache.stream().parallel()
        .filter(audioCacheDoc -> audioCacheDoc.getId().equals(uid)).findAny().orElse(null);
    }

    protected void setupExportDir() {
        if (!exportDir.endsWith("/")) {
            exportDir += "/";
        }
    }

    protected void setupCSVOutput() {
        csv = new CsvUtils(exportDir + exportType + ".csv");
    }

    protected void writeResults() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(new File(exportDir + exportType + ".json"), results);

        // Export Audio (since it's cached already)
        mapper.writeValue(new File(exportDir + "FVAudio.json"), audioCache);
    }

    protected Boolean runOperation(Object doc) throws Exception {
        Document docObj = (Document) doc;
        AppCompatibleEntity result = null;
        Map<String, Object> resultContextParameters = null;


        // Get word context parameters (includes expanded values for objects linked using related GUIDs)
        if (exportType.equals("FVWord")) {
            resultContextParameters = docObj.getContextParameter("word");
            result = new AppCompatibleWord(docObj);

            // Set categories
            result.setTheme(getCategories(resultContextParameters));

        } else if (exportType.equals("FVPhrase")) {
            resultContextParameters = docObj.getContextParameter("phrase");
            result = new AppCompatiblePhrase(docObj);

            // Set phrase books
            result.setTheme(getPhraseBooks(resultContextParameters));
        }

        if (result != null) {
            // Method #1: Use context parameters, however, currently, speaker info is not returned.
            // Set audio based on context parameters and download audio assets
            //result.setAudio(retrieveMedia(resultContextParameters, "related_audio"));

            // Method #2: Use Audio Cache to get audio records and extract speaker info.
            List<Map<String, String>> audioList = (List<Map<String, String>>) resultContextParameters.get("related_audio");
            ArrayList<HashMap<String, String>> audioResults = new ArrayList<>();

            if (audioList!=null)
            {
                audioList.forEach(audio -> {
                    // Account for strange situation where an empty object is present
                    if (audio == null || audio.isEmpty())
                        return;

                    Document audioDoc = getFromAudioCache(audio.get("uid"));

                    HashMap<String, String> audioObjHash = new HashMap<String, String>();
                    audioObjHash.put("filename", downloadBlobToDisk(audio, exportDir));
                    audioObjHash.put("mime-type", audio.get("mime-type"));
                    audioObjHash.put("title", audio.get("dc:title"));
                    audioObjHash.put("description", audio.get("dc:description"));

                    // Add speaker information from audio doc, if available.
                    if (audioDoc != null) {

                        Map<String, Object> audioDocContextParameter = (Map<String, Object>) audioDoc.getContextParameter("media");

                        // Set speakers (not available in context parameters)
                        List<Map<String, String>> speakers = (List<Map<String, String>>) audioDocContextParameter.get("sources");
                        if (speakers != null) {
                            ArrayList<String> speakerNames = speakers.stream().map(speaker -> speaker.get("dc:title")).collect(Collectors.toCollection(ArrayList::new));

                            if (speakerNames != null && speakerNames.size() > 0) {
                                audioObjHash.put("speaker", String.join("; ", speakerNames));
                            }
                        }
                    }

                    audioResults.add(audioObjHash);
                });

                result.setAudio(audioResults);
            }

            // Set image based on context parameters and download audio assets
            result.setImg(retrieveMedia(resultContextParameters, "related_pictures"));

            if (generateCSV) {
                writeResultToCSV(result);
            }

            results.add(result);

            return true;
        }

        return false;
    }

    private static void writeResultToCSV(AppCompatibleEntity result) {
        List<Object> outputRow = new ArrayList<Object>();
        outputRow.add(result.getEntryID());
        outputRow.add(result.getTitle());
        outputRow.add(result.getDefinition());

        ArrayList<HashMap<String, String>> audioToOutput = result.getAudio();
        ArrayList<HashMap<String, String>> imagesToOutput = result.getImg();


        if (audioToOutput != null)
            result.getAudio().forEach(audio -> { if (audio != null && audio.containsKey("filename")) { outputRow.add(audio.get("filename"));} });

        if (imagesToOutput != null)
            result.getImg().forEach(image -> { if (image != null && image.containsKey("filename")) { outputRow.add(image.get("filename"));} });

        csv.writeLine(outputRow.toArray(new String[0]));
    }

    private String downloadBlobToDisk(Map<String, String> blobObj, String dir) {
        String blobPathString = null;
        String fileNameSegment = blobObj.get("uid").substring(0, 2) + "/" + (slugifyGUIDs ? blobObj.get("uid") : blobObj.get("name"));
        String pathOnDisk = exportDir + fileNameSegment;
        Path blobPath = Paths.get(pathOnDisk);

        // Use remote URL if specified
        if (remotePath != null && !remotePath.isEmpty()) {
            pathOnDisk = pathOnDisk.replace(exportDir, remotePath);
        }

        try {
            // If instructed not to download blobs, just return path
            // Note: If returning FirstVoices URL in the future, use "?inline=true" to render inline rather than download
            if (!downloadBlobs) {
                return pathOnDisk;
            }

            // If downloading from server
            else {
                // Check if file exists on disk; if so, skip.
                if (Files.exists(blobPath)) {
                    // Check if file exists, but size 0 bytes; if so, delete.
                    if (Files.size(blobPath) == 0) {
                        System.out.println("Path exists, but size is 0 bytes: " + exportDir + fileNameSegment);
                        Files.delete(blobPath);
                    } else {
                        //System.out.println("Path exists, skipping: " + pathOnDisk);
                        return pathOnDisk;
                    }
                }

                // file does not exist locally: Get blob and save to disk; in folder based on UID hash
                StreamBlob blob = client.repository().streamBlobById(blobObj.get("uid"), "file:content");
                InputStream is = blob.getStream();
                Files.createDirectories(blobPath.getParent());
                Files.copy(is, blobPath, StandardCopyOption.REPLACE_EXISTING);

                blobPathString = blobPath.toString();

                // Use remote URL if specified
                if (remotePath != null && !remotePath.isEmpty()) {
                    blobPathString = blobPathString.replace(exportDir, remotePath);
                }
            }

        } catch (IOException e) {
            System.out.println("Could not write to disk: " + exportDir + fileNameSegment);
        }

        return blobPathString;
    }

    private ArrayList<HashMap<String, String>> retrieveMedia(Map<String, Object> wordContextParameters, String mediaField) {
        if (wordContextParameters.get(mediaField) != null) {
            List<Map<String, String>> media = (List<Map<String, String>>) wordContextParameters.get(mediaField);

            if (media != null) {
                ArrayList<HashMap<String, String>> mediaUrls = (ArrayList<HashMap<String, String>>) media.stream().map(
                        mediaObj -> {
                            if (mediaObj != null && mediaObj.size() > 0) {
                                try {
                                    HashMap<String, String> mediaObjHash = new HashMap<String, String>();
                                    mediaObjHash.put("filename", downloadBlobToDisk(mediaObj, exportDir));
                                    mediaObjHash.put("mime-type", mediaObj.get("mime-type"));
                                    mediaObjHash.put("title", mediaObj.get("dc:title"));
                                    mediaObjHash.put("description", mediaObj.get("dc:description"));
                                    return mediaObjHash;
                                } catch (Exception e) {
                                    e.printStackTrace();
                                    return null;
                                }
                            }
                            return null;
                        }
                ).collect(Collectors.toCollection(ArrayList::new));

                return mediaUrls;
            }
        }

        return null;
    }

    private ArrayList<HashMap<String, String>> getCategories(Map<String, Object> wordContextParameters) {
        // Set theme objects based on context parameters
        List<Map<String, String>> categories = (List<Map<String, String>>) wordContextParameters.get("categories");

        return categories.stream().map(
                categoryObj -> {
                    HashMap<String, String> category = new HashMap<>();

                    Document matchedParentCategory =
                            sharedCategories.streamEntries().filter(
                                    sharedCategory -> sharedCategory.getPath().equals(categoryObj.get("path").substring(0, categoryObj.get("path").lastIndexOf("/"))))
                                    .findFirst().orElse(null);

                    if (matchedParentCategory == null) {
                        category.put("parent_category", categoryObj.get("dc:title"));
                        category.put("category", null);
                    } else {
                        category.put("parent_category", matchedParentCategory.getTitle());
                        category.put("category", categoryObj.get("dc:title"));
                    }

                    return category;
                }
        ).collect(Collectors.toCollection(ArrayList::new));
    }

    private ArrayList<HashMap<String, String>> getPhraseBooks(Map<String, Object> resultContentParameters) {
        // Set theme objects based on context parameters
        List<Map<String, String>> phrase_books = (List<Map<String, String>>) resultContentParameters.get("phrase_books");

        return phrase_books.stream().map(
                phraseBookObj -> {
                    HashMap<String, String> phraseBook = new HashMap<>();

                    phraseBook.put("parent_category", phraseBookObj.get("dc:title"));
                    phraseBook.put("category", null);

                    return phraseBook;
                }
        ).collect(Collectors.toCollection(ArrayList::new));
    }
}
