package tasks.maps;

import com.beust.jcommander.Parameter;
import com.fasterxml.jackson.databind.ObjectMapper;
import models.maps.Community;
import models.maps.Language;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.logging.HttpLoggingInterceptor;
import tasks.interfaces.Task;

import java.io.IOException;

public class UpdateMapData extends AbstractImportDataFromCSV implements Task {

    // Name and description
    final private static String programName = "maps-update-data";

    private static Community community = null;

    private static Language language = null;

    @Parameter(names = { "-id" }, description = "ID of the object", required = true)
    protected static String id;

    @Parameter(names = { "-type" }, description = "Community or language", required = true)
    protected static String type;

    @Parameter(names = { "-propertyKey" }, description = "Property key (field) to update", required = true, password = true)
    protected static String propertyKey;

    @Parameter(names = { "-propertyValue" }, description = "Value to update the field with", required = true, password = true)
    protected static String propertyValue;

    private UpdateMapData() {
        super();
    }

    public static String getDescription() {
        return "This task will IMPORT AND OVERRIDE community or language data based on the properties you supply.";
    }

    public static void execute(String[] argv) {

        UpdateMapData updateMapData = new UpdateMapData();

        // Setup command line
        updateMapData.setupCommandLine(programName, argv);

        updateMapData.setDefaultAuthJSONBody();

        // Authenticate with server
        try {
            HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
            loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

            OkHttpClient client = new OkHttpClient.Builder()
//            .addInterceptor(loggingInterceptor)
            .build();

            authKey = updateMapData.authRequest(client);

            // Describe connection
            updateMapData.describeConnection();

            // Perform actions
            if (authKey != null && (type.equals("community") || type.equals("language"))) {

                ObjectMapper objectMapper = new ObjectMapper();

                // Get full community object
                community = getCommunity(client, id);

                // Update community properties
                Community updatedCommunity = null;

                // Example, for POINT use a WKT EWKT format for propertyValue, escaping:
                // Remember LONG than LAT
                // propertyValue = "{\"type\":\"Point\",\"coordinates\":[-129.2917854,59.2953873]}";

                System.out.println("** UPDATING " + community.getName() + " PROPERTIES (/api/community/" + community.getId() + "/) **");
                System.out.println("** SETTING " + propertyKey + " to " + propertyValue + " **");

                RequestBody body = RequestBody.create(JSON,"{\"" + propertyKey + "\":" + propertyValue + "}");

                Request request = new Request.Builder()
                        .url(url + "/api/community/" + id + "/")
                        .header("Authorization", "Token " + authKey)
                        .patch(body)
                        .build();

                Response response = client.newCall(request).execute();

                if (!response.isSuccessful()) {
                    throw new IOException(response.message());
                }

                updatedCommunity = objectMapper.readValue(response.body().string(), Community.class);

                // Call end-point to clear cache
                if (updateMapData.isValidUrl(url + "/api/community/" + community.getId() + "/", client)) {
                    System.out.println("Cache cleared for " + type + " id " + community.getId());
                }
            }


        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }
}