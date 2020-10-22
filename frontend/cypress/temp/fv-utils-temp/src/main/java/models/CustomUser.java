package models;

import org.nuxeo.client.objects.user.User;

public class CustomUser extends User {

    public String getPreferences() {
        return (String) this.properties.get("preferences");
    }

    public void setPreferences(String preferences) {
        this.properties.put("preferences", preferences);
    }
}