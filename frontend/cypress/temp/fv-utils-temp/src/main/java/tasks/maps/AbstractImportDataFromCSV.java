package tasks.maps;

import com.beust.jcommander.Parameter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import models.maps.Community;
import models.maps.LanguageMapToken;
import okhttp3.*;
import org.apache.tika.Tika;
import tasks.AbstractTask;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;

public abstract class AbstractImportDataFromCSV extends AbstractTask {

    public static final MediaType JSON
            = MediaType.get("application/json; charset=utf-8");

    static List<String[]> csvRecords = null;

    static String authKey = null;

    private static String defaultAuthJSONBody;

    static HashMap<String, Integer> headersLookup = new HashMap<String, Integer>();

    @Parameter(names = { "-import-file" }, description = "File with language import information")
    private String importFile = "";

    static String importPath = null;

    protected static CSVReader csvReader = null;

    protected void setupCSVInput() {

        if (importFile != null) {

            if (!importFile.endsWith("/")) {
                importFile += "/";
            }

            try {
                Reader reader = Files.newBufferedReader(Paths.get(importFile));

                // Read CSV (skipping headers)
                csvReader = new CSVReaderBuilder(reader).build();
                csvRecords = csvReader.readAll();
            } catch (IOException e) {
                e.printStackTrace();
            }

        }

        // Extract and store headers
        headersLookup = extractHeaders(csvRecords.get(0));

        // Setup path variable
        importPath = Paths.get(importFile).getParent().toString();
    }

    void setDefaultAuthJSONBody() {
        AbstractImportDataFromCSV.defaultAuthJSONBody = "{\"username\": \"" + username +"\", \"password\": \"" + password +"\"}";
    }

    String authRequest(OkHttpClient client) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();

        RequestBody body = RequestBody.create(JSON, defaultAuthJSONBody);
        Request request = new Request.Builder()
                .url(url + "/api-token-auth/")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            return objectMapper.readValue(response.body().string(), LanguageMapToken.class).getToken();
        }
    }

    private static HashMap<String, Integer> extractHeaders(String[] headers) {

        HashMap<String, Integer> headerValues = new HashMap<String, Integer>();

        int i = 0;
        for (String header : headers) {
            headerValues.put(header, i);
            ++i;
        }

        return headerValues;
    }

    boolean isValidUrl(String url, OkHttpClient client) throws IOException {
        Response response = null;

        if (url == null || url.isEmpty()) {
            return true;
        }

        try {
            Request request = new Request.Builder()
                    .url(url)
                    .get()
                    .build();

            response = client.newCall(request).execute();

            return response.isSuccessful();
        } finally {
            if (response !=null) {
                response.body().close();
            }

        }


    }

    static String[] findInCSV(String search, String column, Boolean partialMatch) {

        if (search == null || column == null) {
            return null;
        }

        int i = 0;

        for (String[] record : csvRecords) {
            // Skip header row
            if (i == 0){
                ++i;
                continue;
            }

            try {
                if (record[headersLookup.get(column)].equals(search)) {
                    return record;
                } else if (partialMatch) {
                     String partialSearchString = generatePartialMatchString(search);
                     if (record[headersLookup.get(column)].replace("’", "'").contains(partialSearchString)) {
                         return record;
                     }
                }
            } catch (NullPointerException exception) {
                System.out.println("Headers do not contain that column (" + column + ") to search within.");
            }

            ++i;
        }

        return null;
    }

    static String[] findInCSV(String search, String column, String search2, String column2, Boolean partialMatch) {

        if (search == null || column == null) {
            return null;
        }

        int i = 0;

        for (String[] record : csvRecords) {
            // Skip header row
            if (i == 0){
                ++i;
                continue;
            }

            try {
                if (record[headersLookup.get(column)].equals(search) && record[headersLookup.get(column2)].equals(search2)) {
                    return record;
                } else if (partialMatch) {
                    String partialSearchString = generatePartialMatchString(search);
                    String partialSearchString2 = generatePartialMatchString(search2);

                    if (record[headersLookup.get(column)].replace("’", "'").contains(partialSearchString) &&
                            record[headersLookup.get(column2)].replace("’", "'").contains(partialSearchString2)) {
                        return record;
                    }
                }
            } catch (NullPointerException exception) {
                System.out.println("Headers do not contain that column (" + column + ") to search within.");
            }

            ++i;
        }

        return null;
    }

    String addRecording(RequestBody requestBody, OkHttpClient client) throws IOException {
        Request request = new Request.Builder()
                .header("Authorization", "Token " + authKey)
                .url(url + "/api/recording/")
                .post(requestBody)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
            System.out.println("Uploaded audio file.");
            return response.body().string();
        }
    }

    void linkObjectsViaPatch(String pathToMainEntity, String JSONDataToLink, OkHttpClient client) throws IOException {

        RequestBody body = RequestBody.create(JSON, JSONDataToLink);

        Request request = new Request.Builder()
                .header("Authorization", "Token " + authKey)
                .url(url + "/api/" + pathToMainEntity + "/")
                .patch(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Linking objects failed for end-point " + pathToMainEntity + " linking data " + JSONDataToLink);
            System.out.println("Data linked! pathToMainEntity ---> " + JSONDataToLink);
        }
    }

    static RequestBody createAudioFileBody(String prefix, String[] row) throws FileNotFoundException, IOException {
        RequestBody requestBody = null;
        File file = new File(importPath + "/" + row[headersLookup.get(prefix + "_filename")]);

        // Files.probeContentType broken on MacOSX, use Tika library instead
        // https://stackoverflow.com/questions/12407479/why-does-files-probecontenttype-return-null
        Tika tika = new Tika();
        String mimeType = tika.detect(file);

        if (file.exists()) {
            requestBody = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("speaker", row[headersLookup.get(prefix + "_speaker")])
                    .addFormDataPart("date_recorded", row[headersLookup.get(prefix + "_date")])
                    .addFormDataPart("recorder", row[headersLookup.get(prefix + "_recorder")])
                    .addFormDataPart("audio_file", file.getName(),
                            RequestBody.create(MediaType.parse(mimeType), file))
                    .build();
        } else {
            throw new FileNotFoundException("Recording " + file.getName() + " not found on disk.");
        }

        return requestBody;
    }

    protected String getLanguages(OkHttpClient client) {

        Request request = new Request.Builder()
                .cacheControl(new CacheControl.Builder().noCache().build())
                .url(url + "/api/language/")
                .build();

        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }

        return null;
    }

    protected static Community getCommunity(OkHttpClient client, String communityId) {

        ObjectMapper objectMapper = new ObjectMapper();

        Request request = new Request.Builder()
                .cacheControl(new CacheControl.Builder().noCache().build())
                .url(url + "/api/community/" + communityId)
                .build();

        try (Response response = client.newCall(request).execute()) {
            return objectMapper.readValue(response.body().string(), Community.class);
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }

        return null;
    }

    protected String getCommunities(OkHttpClient client) {

        Request request = new Request.Builder()
                .cacheControl(new CacheControl.Builder().noCache().build())
                .url(url + "/api/community/")
                .build();

        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }

        return null;
    }

    private static String generatePartialMatchString(String search) {
        return search
                .replace("Nation", "")
                .replace("First", "")
                .replace("Band", "")
                .replace("’", "'")
                .replace("Council", "").trim();
    }
}
