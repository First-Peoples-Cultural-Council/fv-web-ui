package models.maps;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

/**
 * A RECORDING model for the map
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Recording {

    @JsonProperty("id")
    private String id;

    @JsonProperty("speaker")
    private String speaker;

    @JsonProperty("date_recorded")
    private Date date_recorded;

    @JsonProperty("created")
    private Date created;

    @JsonProperty("recorder")
    private String recorder;

    @JsonProperty("audio_file")
    private String audio_file;

    public String getSpeaker() {
        return speaker;
    }

    public void setSpeaker(String speaker) {
        this.speaker = speaker;
    }

    public Date getDate_recorded() {
        return date_recorded;
    }

    public void setDate_recorded(Date date_recorded) {
        this.date_recorded = date_recorded;
    }

    public String getRecorder() {
        return recorder;
    }

    public void setRecorder(String recorder) {
        this.recorder = recorder;
    }

    public String getAudio_file() {
        return audio_file;
    }

    public void setAudio_file(String audio_file) {
        this.audio_file = audio_file;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }
}