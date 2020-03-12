package ca.firstvoices.user;

import org.nuxeo.ecm.user.invite.UserRegistrationInfo;

public class FVUserRegistrationInfo extends UserRegistrationInfo {

    protected String requestedSpace;

    protected String preferences;

    protected String ageGroup;

    protected String role;

    protected Boolean language_team_member;

    protected Boolean community_member;

    protected String comment;

    public FVUserRegistrationInfo() {
    }

    public String getPreferences() {
        return preferences;
    }

    public void setPreferences(String preferences) {
        this.preferences = preferences;
    }

    public void setRequestedSpace(String requestedSpace) {
        this.documentId = requestedSpace;
        this.requestedSpace = requestedSpace;
    }

    public String getRequestedSpace() {
        return requestedSpace;
    }

    public String getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Boolean getLanguageTeamMember() {
        return language_team_member;
    }

    public void setLanguageTeamMember(Boolean language_team_member) {
        this.language_team_member = language_team_member;
    }

    public Boolean getCommunityMember() {
        return community_member;
    }

    public void setCommunityMember(Boolean community_member) {
        this.community_member = community_member;
    }
}