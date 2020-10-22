package models.maps;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.HashMap;

/**
 * A LANGUAGE model for the map
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Language {

    @JsonProperty("name")
    private String name;

    @JsonProperty("id")
    private String id;

    @JsonProperty("color")
    private String color;

    @JsonProperty("bbox")
    private HashMap<String, Object> bbox;

    @JsonProperty("sleeping")
    private Boolean sleeping;

    @JsonProperty("family")
    private HashMap<String, String> family;

    @JsonProperty("other_names")
    private String other_names;

    @JsonProperty("language_audio")
    private JsonNode language_audio;

    @JsonProperty("greeting_audio")
    private JsonNode greeting_audio;

    @JsonProperty("fv_archive_link")
    private String fv_archive_link;

    public Language() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public JsonNode getLanguage_audio() {
        return language_audio;
    }

    public void setLanguage_audio(JsonNode language_audio) {
        this.language_audio = language_audio;
    }

    public JsonNode getGreeting_audio() {
        return greeting_audio;
    }

    public void setGreeting_audio(JsonNode greeting_audio) {
        this.greeting_audio = greeting_audio;
    }

    public String getFv_archive_link() {
        return fv_archive_link;
    }

    public void setFv_archive_link(String fv_archive_link) {
        this.fv_archive_link = fv_archive_link;
    }
}