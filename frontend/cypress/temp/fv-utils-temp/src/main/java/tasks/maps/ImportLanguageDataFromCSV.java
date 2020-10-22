package tasks.maps;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import models.maps.Language;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.logging.HttpLoggingInterceptor;
import tasks.interfaces.Task;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ImportLanguageDataFromCSV extends AbstractImportDataFromCSV implements Task {

    // Name and description
    final private static String programName = "maps-import-language-data";

    private static ArrayList<Language> languages = null;

    private ImportLanguageDataFromCSV() {
        super();
    }

    public static String getDescription() {
        return "This task will IMPORT AND OVERRIDE language data from a CSV file into the Language Map. Only recordings will not be overwritten.";
    }

    public static void execute(String[] argv) {

        ImportLanguageDataFromCSV importLanguageDataFromCSV = new ImportLanguageDataFromCSV();

        // Setup command line
        importLanguageDataFromCSV.setupCommandLine(programName, argv);

        // Setup CSV input
        importLanguageDataFromCSV.setupCSVInput();

        importLanguageDataFromCSV.setDefaultAuthJSONBody();

        // Authenticate with server
        try {
            HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
            loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

            OkHttpClient client = new OkHttpClient.Builder()
//                    .addInterceptor(loggingInterceptor)
                    .build();

            authKey = importLanguageDataFromCSV.authRequest(client);

            // Describe connection
            importLanguageDataFromCSV.describeConnection();

            // Perform actions
            if (csvReader != null && authKey != null) {

                ObjectMapper objectMapper = new ObjectMapper();

                // Get languages
                CollectionType listOfLanguages = objectMapper.getTypeFactory().constructCollectionType(List.class, Language.class);
                languages = objectMapper.readValue(importLanguageDataFromCSV.getLanguages(client), listOfLanguages);

                languages.forEach((language) -> {
                    String[] row = findInCSV(language.getName(), "language", false);
                    if (row != null) {

                        try {
                            // Update language properties
                            Language updatedLanguage = (Language) importLanguageDataFromCSV.updateLanguageProperties(language, row, client);

//                            // Create new recording for language name and link to language
//                            if (updatedLanguage.getLanguage_audio().isNull() && !row[headersLookup.get("language_filename")].isEmpty()) {
//                                RequestBody requestBodyLanguageName = createAudioFileBody("language", row);
//                                Recording recordingLanguageName = (Recording) objectMapper.readValue(importLanguageDataFromCSV.addRecording(requestBodyLanguageName, client), Recording.class);
//
//                                importLanguageDataFromCSV.linkObjectsViaPatch(
//                                        "language/" + language.getId() + "/add_language_audio",
//                                        "{ \"recording_id\": "+ recordingLanguageName.getId() + " }",
//                                        client);
//                            }
//
//                            // Create new greeting for language name and link to language
//                            if (updatedLanguage.getGreeting_audio().isNull() && !row[headersLookup.get("greeting_filename")].isEmpty()) {
//                                RequestBody requestBodyGreeting = createAudioFileBody("greeting", row);
//                                Recording recordingGreeting = (Recording) objectMapper.readValue(importLanguageDataFromCSV.addRecording(requestBodyGreeting, client), Recording.class);
//
//                                importLanguageDataFromCSV.linkObjectsViaPatch(
//                                        "language/" + language.getId() + "/add_greeting_audio",
//                                        "{ \"recording_id\": "+ recordingGreeting.getId() + " }",
//                                        client);
//                            }

                            // Call end-point of language to clear cache
                            if (importLanguageDataFromCSV.isValidUrl(url + "/api/language/" + language.getId() + "/", client)) {
                                System.out.println("Cache cleared for language id " + language.getId());
                            }

                        } catch (Exception e) {
                            System.out.println(e.getMessage());
                        }
                    } else {
                        System.out.println(language.getName() + " not found in CSV.");
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

    private Language updateLanguageProperties(Language language, String[] row, OkHttpClient client) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();

        System.out.println("** UPDATING " + language.getName() + " PROPERTIES FROM CSV (/api/language/" + language.getId() + "/) **");

        String fv_api_url = null;

        if (row[headersLookup.get("fv_url_segment")] != null && !row[headersLookup.get("fv_url_segment")].isEmpty()) {
            fv_api_url = "https://www.firstvoices.com/nuxeo/api/v1/path/FV/sections/Data/" + row[headersLookup.get("fv_url_segment")];
        }

        // Confirm FV Link is correct:
        if (isValidUrl(fv_api_url, client)) {
            RequestBody body = RequestBody.create(JSON,
            "{" +
                    "\"family_id\": \"" + row[headersLookup.get("family_ids")] +"\"," +
                    "\"other_names\": \"" + row[headersLookup.get("aliases (comma seperated)")] +"\"," +
                    "\"fv_archive_link\": \"" + row[headersLookup.get("fv_url")] +"\"," +
                    "\"fv_guid\": \"" + row[headersLookup.get("fv_guid")] +"\"," +
                    "\"total_schools\": \"" + row[headersLookup.get("total_schools")] +"\"," +
                    "\"avg_hrs_wk_languages_in_school\": \"" + row[headersLookup.get("avg_hrs_wk_languages_in_school")] +"\"," +
                    "\"ece_programs\": \"" + row[headersLookup.get("ece_programs")] +"\"," +
                    "\"avg_hrs_wk_languages_in_ece\": \"" + row[headersLookup.get("avg_hrs_wk_languages_in_ece")] +"\"," +
                    "\"language_nests\": \"" + row[headersLookup.get("language_nests")] +"\"," +
                    "\"avg_hrs_wk_languages_in_language_nests\": \"" + row[headersLookup.get("avg_hrs_wk_languages_in_language_nests")] +"\"," +
                    "\"community_adult_language_classes\": \"" + row[headersLookup.get("community_adult_language_classes")] +"\"" +
                    "\"fluent_speakers\": \"" + row[headersLookup.get("fluent_speakers")] +"\"," +
                    "\"some_speakers\": \"" + row[headersLookup.get("some_speakers")] +"\"," +
                    "\"learners\": \"" + row[headersLookup.get("learners")] +"\"," +
                    "\"pop_total_value\": \"" + row[headersLookup.get("pop_total_value")] +"\"" +
                    "}"
            );

            Request request = new Request.Builder()
                    .url(url + "/api/language/" + language.getId() + "/")
                    .header("Authorization", "Token " + authKey)
                    .patch(body)
                    .build();

            Response response = client.newCall(request).execute();

            if (!response.isSuccessful()) {
                throw new IOException(response.message());
            }

            return objectMapper.readValue(response.body().string(), Language.class);

        } else {
            throw new IOException("FirstVoices URL returned a 404. Please check URL.");
        }
    }
}