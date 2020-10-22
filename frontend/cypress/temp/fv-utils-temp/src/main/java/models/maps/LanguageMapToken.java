package models.maps;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * A LANGUAGE MAP TOKEN model for the map
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LanguageMapToken {

    @JsonProperty("token")
    private String token;

    public LanguageMapToken() {
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}