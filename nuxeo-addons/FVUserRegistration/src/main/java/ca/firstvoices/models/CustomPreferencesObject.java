package ca.firstvoices.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "General", "Navigation", "Theme" })
public class CustomPreferencesObject {

    @JsonProperty("General")
    private Map<String, Object> generalPreferences = new HashMap<>();

    @JsonProperty("Navigation")
    private Map<String, Object> navigationPreferences = new HashMap<>();

    @JsonProperty("Theme")
    private Map<String, Object> themePreferences = new HashMap<>();

    public Map<String, Object> getGeneralPreferences() {
        return generalPreferences;
    }

    public void setGeneralPreferences(Map<String, Object> generalPreferences) {
        this.generalPreferences = generalPreferences;
    }

    public Map<String, Object> getNavigationPreferences() {
        return navigationPreferences;
    }

    public void setNavigationPreferences(Map<String, Object> navigationPreferences) {
        this.navigationPreferences = navigationPreferences;
    }

    public Map<String, Object> getThemePreferences() {
        return themePreferences;
    }

    public void setThemePreferences(Map<String, Object> themePreferences) {
        this.themePreferences = themePreferences;
    }
}