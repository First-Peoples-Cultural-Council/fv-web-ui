package models.maps;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.ArrayList;

/**
 * A COMMUNITY model for the map
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Community {

    @JsonProperty("name")
    private String name;

    @JsonProperty("id")
    private String id;

    @JsonProperty("point")
    private Object point;

    @JsonProperty("other_names")
    private String other_names;

    @JsonProperty("audio")
    private JsonNode audio;

    @JsonProperty("notes")
    private String notes;

    @JsonProperty("population")
    private Integer population;

    @JsonProperty("languages")
    private ArrayList<Language> languages;

    public Community() {
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

    public Object getPoint() {
        return point;
    }

    public void setPoint(Object point) {
        this.point = point;
    }

    public String getOther_names() {
        return other_names;
    }

    public void setOther_names(String other_names) {
        this.other_names = other_names;
    }

    public JsonNode getAudio() {
        return audio;
    }

    public void setAudio(JsonNode audio) {
        this.audio = audio;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public ArrayList<Language> getLanguages() {
        return languages;
    }

    public void setLanguages(ArrayList<Language> languages) {
        this.languages = languages;
    }

    public Integer getPopulation() {
        return population;
    }

    public void setPopulation(Integer population) {
        this.population = population;
    }
}