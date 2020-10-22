package tasks.users;

import tasks.interfaces.Task;

import com.beust.jcommander.Parameter;
import models.CustomPreferencesObject;
import models.CustomUser;
import okhttp3.Response;
import org.nuxeo.client.Operations;
import org.nuxeo.client.objects.Document;
import tasks.AbstractTask;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class OverwritePreferences extends AbstractTask implements Task {

    // Name and description
    final private static String programName = "users-overwrite-preferences";

    // Parameters specific to this task

    @Parameter(names = { "-usernameToUpdate" }, description = "The user name to update", required = true)
    private String usernameToUpdate;

    @Parameter(names = { "-primaryDialectToSet" }, description = "The primary dialect GUID to set", required = true)
    private String primaryDialectToSet;

    private String userJson = "";

    private OverwritePreferences() {
        super();
    }

    public static String getDescription() {
        return "This task will overwrite a user preferences object (JSON string) based on the provided input. For now only setting the primary dialect (GUID of workspace ID).";
    }

    private CustomUser fetchUserPreferences() throws Exception {

        System.out.println("-> Fetching user " +  usernameToUpdate + " from remote");

        CustomUser userObject = null;

        // GET user object
        Response response = client.get(url + "/api/v1/user/" + usernameToUpdate);

        if (response.isSuccessful() && response.body() != null) {
            try {
                userJson = response.body().string();
            } catch (Exception e) {
                e.printStackTrace();
            }

            userObject = (CustomUser) client.getConverterFactory().readJSON(userJson, CustomUser.class);
        } else {
            throw new Exception("-> ABORTED: Username was not found, make sure you typed it correctly.");
        }

        return userObject;
    }

    private CustomUser updateUserPreferences(CustomUser existingUserObject) throws Exception {
        System.out.println("-> Overwriting preferences for user " + usernameToUpdate);

        CustomPreferencesObject userPreferencesObj = null;

        userPreferencesObj = new CustomPreferencesObject();

        // Validate dialect
        Document doc = client.operation(Operations.REPOSITORY_GET_DOCUMENT).param("value", primaryDialectToSet).execute();

        System.out.println("-> Settings primary dialect to " + doc.getTitle() + " | Path: " + doc.getPath());

        // Create general preferences
        Map<String, Object> generalPreferences = new HashMap<>();
        generalPreferences.put("primary_dialect", primaryDialectToSet);

        // Create navigation preferences
        Map<String, Object> navigationPreferences = new HashMap<>();
        navigationPreferences.put("start_page", "my_dialect");

        // Create theme preferences
        Map<String, Object> themePreferences = new HashMap<>();
        themePreferences.put("font_size", "default");

        // Set general, navigation and theme preferences
        userPreferencesObj.setGeneralPreferences(generalPreferences);
        userPreferencesObj.setNavigationPreferences(navigationPreferences);
        userPreferencesObj.setThemePreferences(themePreferences);

        String modifiedPreferencesString = client.getConverterFactory().writeJSON(userPreferencesObj);

        existingUserObject.setPreferences(modifiedPreferencesString);

        String json = client.getConverterFactory().writeJSON(existingUserObject);

        Response response = client.put(url + "/api/v1/user/" + usernameToUpdate, json);

        if (!response.isSuccessful() || response.body() == null) {
            throw new Exception("-> ABORTED: Update was not successful.");
        }

        return existingUserObject;
    }

    public static void execute(String[] argv) {

        OverwritePreferences updatePreferences = new OverwritePreferences();

        // Setup command line
        updatePreferences.setupCommandLine(programName, argv);

        // Connect to server
        updatePreferences.connect();

        // Describe connection
        updatePreferences.describeConnection();

        // Perform actions
        try {
            // Get existing user from remote (GET)
            CustomUser existingUser = updatePreferences.fetchUserPreferences();

            // Update user preferences (PUT)
            CustomUser localUpdatedUser = updatePreferences.updateUserPreferences(existingUser);

            // Get modified user from remote (GET)
            CustomUser remoteUpdatedUser = updatePreferences.fetchUserPreferences();

            // Validate that preferences have been updated
            assertEquals("Validation of operation failed. Preferences do not match.", localUpdatedUser.getPreferences(), remoteUpdatedUser.getPreferences());

            System.out.println("-> Operation and validation complete.");
        }
        catch (IOException e) {
            System.out.println("Error connecting to Nuxeo server. Is your dialect GUID correct?" + e.getMessage());
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
