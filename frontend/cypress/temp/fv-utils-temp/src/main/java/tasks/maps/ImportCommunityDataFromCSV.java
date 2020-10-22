package tasks.maps;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import models.maps.Community;
import models.maps.Language;
import models.maps.Recording;
import okhttp3.*;
import okhttp3.logging.HttpLoggingInterceptor;
import tasks.interfaces.Task;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;

public class ImportCommunityDataFromCSV extends AbstractImportDataFromCSV implements Task {

    // Name and description
    final private static String programName = "maps-import-community-data";

    private static ArrayList<Community> communities = null;

    private ImportCommunityDataFromCSV() {
        super();
    }

    public static String getDescription() {
        return "This task will IMPORT AND OVERRIDE community data from a CSV file into the Language Map. Only recordings will not be overwritten.";
    }

    public static void execute(String[] argv) {

        ImportCommunityDataFromCSV importCommunityDataFromCSV = new ImportCommunityDataFromCSV();

        // Setup command line
        importCommunityDataFromCSV.setupCommandLine(programName, argv);

        // Setup CSV input
        importCommunityDataFromCSV.setupCSVInput();

        importCommunityDataFromCSV.setDefaultAuthJSONBody();

        // Authenticate with server
        try {
            HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
            loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

            OkHttpClient client = new OkHttpClient.Builder()
//            .addInterceptor(loggingInterceptor)
            .build();

            authKey = importCommunityDataFromCSV.authRequest(client);

            // Describe connection
            importCommunityDataFromCSV.describeConnection();

            // Perform actions
            if (csvReader != null && authKey != null) {

                ObjectMapper objectMapper = new ObjectMapper();

                // Get communities
                CollectionType listOfCommunities = objectMapper.getTypeFactory().constructCollectionType(List.class, Community.class);
                communities = objectMapper.readValue(importCommunityDataFromCSV.getCommunities(client), listOfCommunities);

                System.out.println("Found " + communities.size() + " communities.");

                // Enable this to make sure that all records in CSV file are present in DB
                // testCommunities(csvRecords);

                communities.subList(0, communities.size()).forEach((community) -> {

                    String[] row = findInCSV(community.getName(), "community (from pdf)", true);
                    if (row != null) {
                        try {
                            // Get full community object (some necessary fields aren't in the lightweight list
                            community = importCommunityDataFromCSV.getCommunity(client, community.getId());

                            String notes = community.getNotes().trim();

                            String newLines = "\n";

                            // Switch newlines based on content
                            if (notes.contains("\r\n\r\n")) {
                                newLines = "\r\n\r\n";
                            }

                            // Preserve only unique notes
                            if (!notes.equals("")) {
                                List<String> noteList = Arrays.asList(notes.split(newLines));

                                if (noteList.size() > 1) {
                                    noteList.forEach((note) -> {
                                        note = note.trim();
                                    });

                                    LinkedHashSet<String> uniqueNotes = new LinkedHashSet<>(noteList);
                                    community.setNotes(String.join("\\r\\n\\r\\n", uniqueNotes));
                                }
                            }

                            // Update community properties
                            Community updatedCommunity = (Community) importCommunityDataFromCSV.updateCommunityProperties(community, row, client);

                            // Create new recording for community name and link to community
                            if (updatedCommunity.getAudio().isNull() && !row[headersLookup.get("community_filename")].isEmpty()) {
                                RequestBody requestBodyCommunityName = createAudioFileBody("community", row);
                                Recording recordingCommunityName = (Recording) objectMapper.readValue(importCommunityDataFromCSV.addRecording(requestBodyCommunityName, client), Recording.class);

                                importCommunityDataFromCSV.linkObjectsViaPatch(
                                        "community/" + community.getId() + "/add_audio",
                                        "{ \"recording_id\": "+ recordingCommunityName.getId() + " }",
                                        client);
                            }

                            // Call end-point of community to clear cache
                            if (importCommunityDataFromCSV.isValidUrl(url + "/api/community/" + community.getId() + "/", client)) {
//                                System.out.println("Cache cleared for community id " + community.getId());
                            }
                        } catch (Exception e) {
                            System.out.println("NAME:" + community.getName() + " | ID: " + community.getId() + " | " + e.getMessage());
                        }
                    } else {
                        System.out.println(community.getName() + " not found in CSV.");
                    }

                });

                System.out.println("-> Operation and validation complete.");
            } else {
                System.out.println("-> CSV file null; no operation run.");
            }

        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

    private Community updateCommunityProperties(Community community, String[] row, OkHttpClient client) throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();

        System.out.println("** UPDATING " + community.getName() + " PROPERTIES FROM CSV (/api/community/" + community.getId() + "/) **");

        String fv_api_url = null;

        if (row[headersLookup.get("fv_url_segment")] != null && !row[headersLookup.get("fv_url_segment")].isEmpty()) {
            fv_api_url = "https://www.firstvoices.com/nuxeo/api/v1/path/FV/sections/Data/" + row[headersLookup.get("fv_url_segment")];
        }

        // Confirm FV Link is correct:
        if (isValidUrl(fv_api_url, client)) {
            LinkedHashSet<String> other_names = new LinkedHashSet<String>();

            if (community.getOther_names() != null) {
                other_names.addAll( Arrays.asList( community.getOther_names().trim().replace(" ,", ",").split(",") ) );
            }

            if (!row[headersLookup.get("aliases (comma seperated)")].isEmpty()) {
                other_names.addAll( Arrays.asList( row[headersLookup.get("aliases (comma seperated)")].split(",") ) );
            }

            // Update community name
            String trimmedCommunityName = row[headersLookup.get("community (from pdf)")].trim();
            if (!community.getName().equals(trimmedCommunityName)) {
//                System.out.println("NAME CHANGE - will update " + community.getName() + " to " + trimmedCommunityName);
                other_names.add(community.getName().trim());
            }

            // Ensure languages are correct

            // Get languages from DB
            CollectionType listOfLanguages = objectMapper.getTypeFactory().constructCollectionType(List.class, Language.class);
            ArrayList<Language> languages = objectMapper.readValue(getLanguages(client), listOfLanguages);

            ArrayList<String> languageFromCSV = new ArrayList<>();
            if (!row[headersLookup.get("language_1")].equals("")) { languageFromCSV.add(row[headersLookup.get("language_1")]); }
            if (!row[headersLookup.get("language_2")].equals("")) { languageFromCSV.add(row[headersLookup.get("language_2")]); }
            if (!row[headersLookup.get("language_3")].equals("")) { languageFromCSV.add(row[headersLookup.get("language_3")]); }

            ArrayList<String> languageIds = new ArrayList<>();
            ArrayList<String> missingLanguageIds = new ArrayList<>();

            languageFromCSV.forEach((langFromCSV) -> {
                Language foundLanguage = (Language) languages.stream().filter(
                        langSearch -> langSearch.getName().equals(langFromCSV)
                ).findAny().orElse(null);

                if (foundLanguage != null) {
                    languageIds.add(foundLanguage.getId());
                } else {
                    missingLanguageIds.add(langFromCSV);
                }
            });

            if (missingLanguageIds.size() > 0) {
                throw new Exception("Language IDs are missing for " + missingLanguageIds.toString());
            }

            RequestBody body = RequestBody.create(JSON,
            "{" +
                    "\"language_ids\": " + languageIds +"," +
                    "\"name\": \"" + row[headersLookup.get("community (from pdf)")].trim() +"\"," +
                    "\"other_names\": \"" + String.join(",", other_names) +"\"," +
//                    "\"notes\": \"" + community.getNotes().replace("\"", "\\\"") +"\"," +
                    "\"fv_archive_link\": \"" + row[headersLookup.get("fv_url")] +"\"," +
                    "\"population\": \"" + (Integer.valueOf(row[headersLookup.get("population_on_reserve_2018")]) + Integer.valueOf(row[headersLookup.get("population_off_reserve_2018")])) +"\"," +
                    "\"population_on_reserve\": \"" + row[headersLookup.get("population_on_reserve_2018")] +"\"," +
                    "\"population_off_reserve\": \"" + row[headersLookup.get("population_off_reserve_2018")] +"\"," +
                    "\"fv_guid\": \"" + row[headersLookup.get("fv_guid")] +"\"" +
                    "}"
            );

            Request request = new Request.Builder()
                    .url(url + "/api/community/" + community.getId() + "/")
                    .header("Authorization", "Token " + authKey)
                    .patch(body)
                    .build();

            Response response = client.newCall(request).execute();

            if (!response.isSuccessful()) {
                throw new IOException(response.message());
            }

            return objectMapper.readValue(response.body().string(), Community.class);

        } else {
            throw new IOException("FirstVoices URL returned a 404. Please check URL.");
        }
    }

    /**
     * Will output any communities that are missing from the DB
     * @param csvRecords
     * @throws IOException
     */
    private static void testCommunities(List<String[]> csvRecords) throws IOException  {

        int i = 0;

        for (String[] record : csvRecords) {
            // Skip header row
            if (i == 0){
                ++i;
                continue;
            }

            Community com = communities.stream().filter(community -> community.getName().equals(record[1])).findAny().orElse(null);

            if (com == null) {
                System.out.println(record[1]);
            }

            ++i;
        }
    }
}