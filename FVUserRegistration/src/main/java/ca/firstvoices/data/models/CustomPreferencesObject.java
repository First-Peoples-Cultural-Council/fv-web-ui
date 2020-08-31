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

package ca.firstvoices.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.HashMap;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CustomPreferencesObject {

  @JsonProperty(value = "General", required = false)
  private Map<String, Object> general = new HashMap<>();

  @JsonProperty(value = "Navigation", required = false)
  private Map<String, Object> navigation = new HashMap<>();

  @JsonProperty(value = "Theme", required = false)
  private Map<String, Object> theme = new HashMap<>();

  @JsonProperty(value = "generalPreferences", required = false)
  private Map<String, Object> generalPreferences = new HashMap<>();

  @JsonProperty(value = "navigationPreferences", required = false)
  private Map<String, Object> navigationPreferences = new HashMap<>();

  @JsonProperty(value = "themePreferences", required = false)
  private Map<String, Object> themePreferences = new HashMap<>();

  public Map<String, Object> getGeneralPreferences() {
    return general.isEmpty() ? generalPreferences : general;
  }

  public void setGeneralPreferences(Map<String, Object> generalPreferences) {
    this.generalPreferences = generalPreferences;
  }

  public Map<String, Object> getNavigationPreferences() {
    return navigation.isEmpty() ? navigationPreferences : navigation;
  }

  public void setNavigationPreferences(Map<String, Object> navigationPreferences) {
    this.navigationPreferences = navigationPreferences;
  }

  public Map<String, Object> getThemePreferences() {
    return theme.isEmpty() ? themePreferences : theme;
  }

  public void setThemePreferences(Map<String, Object> themePreferences) {
    this.themePreferences = themePreferences;
  }

  public Map<String, Object> getGeneral() {
    return general;
  }

  public void setGeneral(Map<String, Object> general) {
    this.general = general;
  }

  public Map<String, Object> getNavigation() {
    return navigation;
  }

  public void setNavigation(Map<String, Object> navigation) {
    this.navigation = navigation;
  }

  public Map<String, Object> getTheme() {
    return theme;
  }

  public void setTheme(Map<String, Object> theme) {
    this.theme = theme;
  }
}
