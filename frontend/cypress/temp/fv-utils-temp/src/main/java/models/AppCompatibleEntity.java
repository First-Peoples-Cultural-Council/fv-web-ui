package models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.nuxeo.client.objects.Document;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * An object that maps to the expected output for MotherTongues apps.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AppCompatibleEntity {

    @JsonProperty("entryID")
    private String entryID;

    @JsonProperty("word")
    private String title;

    @JsonProperty("definition")
    private String definition;

    @JsonProperty("audio")
    private ArrayList<HashMap<String, String>> audio = new ArrayList<>();

    @JsonProperty("img")
    private ArrayList<HashMap<String, String>> img = new ArrayList<>();

    @JsonProperty("optional")
    private HashMap<String, String> optional = new HashMap<>();

    @JsonProperty("theme")
    private ArrayList<HashMap<String, String>> theme = new ArrayList<>();

    protected HashMap<String, String> optionalFields = new HashMap<>();

    public AppCompatibleEntity(Document doc) {

        // Set ID
        setEntryID(doc.getId());

        // Set entity value
        setTitle(doc.getTitle().trim());

        // Set definition (extract translation field).
        List<Map<String, String>> definitions = doc.getPropertyValue("fv:definitions");
        ArrayList<String> definitionTranslations = definitions.stream().map(definition -> definition.get("translation")).collect(Collectors.toCollection(ArrayList::new));

        if (definitionTranslations != null && definitionTranslations.size() > 0) {
            setDefinition(String.join("; ", definitionTranslations));
        }

        // Skip setting audio based on context parameters; better done externally so they can be downloaded as well.
        // Skip setting images based on context parameters; better done externally so they can be downloaded as well.

        if (doc.getPropertyValue("fv:cultural_note") != null) {
            ArrayList<String> culturalNotes = doc.getPropertyValue("fv:cultural_note");
            culturalNotes.forEach(note -> optionalFields.put("Cultural Note",note));
        }


        if (doc.getPropertyValue("fv:reference") != null) {
            optionalFields.put("Reference", doc.getPropertyValue("fv:reference"));
        }

        setOptional(optionalFields);
    }

    public String getEntryID() {
        return entryID;
    }

    protected void setEntryID(String entryID) {
        this.entryID = entryID;
    }

    public String getTitle() {
        return title;
    }

    protected void setTitle(String title) {
        this.title = title;
    }

    public String getDefinition() {
        return definition;
    }

    protected void setDefinition(String definition) {
        this.definition = definition;
    }

    public ArrayList<HashMap<String, String>> getAudio() {
        return audio;
    }

    public void setAudio(ArrayList<HashMap<String, String>> audio) {
        this.audio = audio;
    }

    public ArrayList<HashMap<String, String>> getImg() {
        return img;
    }

    public void setImg(ArrayList<HashMap<String, String>> img) {
        this.img = img;
    }

    public HashMap<String, String> getOptional() {
        return optional;
    }

    protected void setOptional(HashMap<String, String> optional) {
        this.optional = optional;
    }

    public ArrayList<HashMap<String, String>> getTheme() {
        return theme;
    }

    public void setTheme(ArrayList<HashMap<String, String>> theme) {
        this.theme = theme;
    }
}