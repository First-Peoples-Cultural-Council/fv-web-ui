/*
 *
 *  *
 *  * Copyright 2020 First People's Cultural Council
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  * /
 *
 */

package ca.firstvoices.utils;

import ca.firstvoices.data.models.CustomPreferencesObject;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;

public class FVUserPreferencesUtilities {

  public static String createDefaultFromSite(String dialectID) {

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
    CustomPreferencesObject userPreferencesObj = new CustomPreferencesObject();
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

  public static String createDefault(DocumentModel registration) {
    String dialectID = (String) registration.getPropertyValue("fvuserinfo:requestedSpace");

    return createDefaultFromSite(dialectID);
  }

  private FVUserPreferencesUtilities() {
    throw new IllegalStateException("Utility class");
  }
}
