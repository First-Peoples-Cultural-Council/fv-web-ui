/*
 *
 * Copyright 2020 First People's Cultural Council
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * /
 */

/*
 * Contributors:
 *     Kristof Subryan <vtr_monk@mac.com>
 */
package ca.firstvoices.utils;

import ca.firstvoices.models.CustomPreferencesObject;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;

import java.util.HashMap;
import java.util.Map;

public class FVUserPreferencesSetup {

    public String createDefaultUserPreferencesWithDialectID(String dialectID) {
        CustomPreferencesObject userPreferencesObj = new CustomPreferencesObject();

        // Create general preferences
        Map<String, Object> generalPreferences = new HashMap<>();
        generalPreferences.put("primary_dialect", dialectID);

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

        ObjectMapper mapper = new ObjectMapper();

        try {
            return mapper.writeValueAsString(userPreferencesObj);
        } catch (JsonProcessingException e) {
            throw new NuxeoException(e);
        }
    }

    public String createDefaultUserPreferencesWithRegistration(DocumentModel registration) throws Exception {
        String dialectID = (String) registration.getPropertyValue("fvuserinfo:requestedSpace");

        return createDefaultUserPreferencesWithDialectID(dialectID);
    }

    /**
     * @param existingUserObject
     * @param registration
     * @throws Exception
     */
    public DocumentModel updateUserPreferencesWithRegistration(DocumentModel existingUserObject,
                                                               DocumentModel registration) throws Exception {
        String modifiedPreferencesString = createDefaultUserPreferencesWithRegistration(registration);
        existingUserObject.setPropertyValue("user:preferences", modifiedPreferencesString);

        return existingUserObject;
    }
}
