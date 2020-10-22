package tasks.maps;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import models.maps.Community;
import models.maps.Language;
import okhttp3.*;
import okhttp3.logging.HttpLoggingInterceptor;
import tasks.interfaces.Task;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ImportStatsDataFromCSV extends AbstractImportDataFromCSV implements Task {

    // Name and description
    final private static String programName = "maps-import-stats-data";

    private static ArrayList<Community> communities = null;
    private static ArrayList<Language> languages = null;

    private ImportStatsDataFromCSV() {
        super();
    }

    public static String getDescription() {
        return "This task will IMPORT AND OVERRIDE community stats from a CSV file into the Language Map.";
    }

    public static void execute(String[] argv) {

        ImportStatsDataFromCSV importStatsDataFromCSV = new ImportStatsDataFromCSV();

        // Setup command line
        importStatsDataFromCSV.setupCommandLine(programName, argv);

        // Setup CSV input
        importStatsDataFromCSV.setupCSVInput();

        importStatsDataFromCSV.setDefaultAuthJSONBody();

        // Authenticate with server
        try {
            HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
            loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

            OkHttpClient client = new OkHttpClient.Builder()
//            .addInterceptor(loggingInterceptor)
            .build();

            authKey = importStatsDataFromCSV.authRequest(client);

            // Describe connection
            importStatsDataFromCSV.describeConnection();

            // Perform actions
            if (csvReader != null && authKey != null) {

                ObjectMapper objectMapper = new ObjectMapper();

                // Get communities
                CollectionType listOfCommunities = objectMapper.getTypeFactory().constructCollectionType(List.class, Community.class);
                communities = objectMapper.readValue(importStatsDataFromCSV.getCommunities(client), listOfCommunities);

                System.out.println("Found " + communities.size() + " communities.");

                communities.subList(0, communities.size()).forEach((community) -> {

                    // Get full community object (some necessary fields aren't in the lightweight list
                    community = ImportStatsDataFromCSV.getCommunity(client, community.getId());

                    languages = community.getLanguages();

                    for (Language language : languages) {
                        String[] row = findInCSV(community.getName(), "community", language.getName(), "language", true);
                        if (row != null) {
                            try {

                                // Update community stats
                                importStatsDataFromCSV.updateCommunityStats(community, language, row, client);

                                // Call end-point of community to clear cache
                                if (importStatsDataFromCSV.isValidUrl(url + "/api/community/" + community.getId() + "/", client)) {
//                                System.out.println("Cache cleared for community id " + community.getId());
                                }

                            } catch (Exception e) {
                                System.out.println("NAME:" + community.getName() + " | ID: " + community.getId() + " | " + e.getMessage());
                            }
                        }
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

    private void updateCommunityStats(Community community, Language language, String[] row, OkHttpClient client) throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();

        System.out.println("** UPDATING language stats for " + community.getName() + " and language " + language.getName());

        RequestBody body = RequestBody.create(JSON,
                "{" +
                        "\"language\": " + language.getId() +"," +
                        "\"community\": \"" + community.getId() +"\"," +
                        "\"fluent_speakers\": \"" + row[headersLookup.get("language_combined_fluent_speakers_2018")] +"\"," +
                        "\"semi_speakers\": \"" + row[headersLookup.get("language_combined_semi_speakers_2018")] +"\"," +
                        "\"active_learners\": \"" + row[headersLookup.get("language_combined_active_learners_2018")] +"\"" +
                        "}"
        );

        Request request = new Request.Builder()
                .url(url + "/api/stats/")
                .header("Authorization", "Token " + authKey)
                .post(body)
                .build();

        Response response = client.newCall(request).execute();

        if (!response.isSuccessful()) {
            throw new IOException(response.message());
        }
    }
}