package ca.firstvoices.rest.data;

import java.io.Serializable;
import java.util.Date;

public class AdminSiteJoinRequest implements Serializable {

  private final String id;
  private final String requestUsername;
  private final String requestUserFirstName;
  private final String requestUserLastName;
  private final Date requestDate;
  private final String status;
  private final String interestReason;
  private final String comment;
  private final boolean communityMember;
  private final boolean languageTeamMember;

  public AdminSiteJoinRequest(
      final String id, final String requestUsername, final String requestUserFirstName,
      final String requestUserLastName, final Date date, final String status,
      final String interestReason, final String comment, final boolean communityMember,
      final boolean languageTeamMember) {

    this.id = id;
    this.requestUsername = requestUsername;
    this.requestUserFirstName = requestUserFirstName;
    this.requestUserLastName = requestUserLastName;
    requestDate = date;
    this.status = status;
    this.interestReason = interestReason;
    this.comment = comment;
    this.communityMember = communityMember;
    this.languageTeamMember = languageTeamMember;

  }

  public String getId() {
    return id;
  }

  public String getRequestUsername() {
    return requestUsername;
  }

  public String getRequestUserFirstName() {
    return requestUserFirstName;
  }

  public String getRequestUserLastName() {
    return requestUserLastName;
  }

  public Date getRequestDate() {
    return requestDate;
  }

  public String getStatus() {
    return status;
  }

  public String getInterestReason() {
    return interestReason;
  }

  public String getComment() {
    return comment;
  }

  public boolean isCommunityMember() {
    return communityMember;
  }

  public boolean isLanguageTeamMember() {
    return languageTeamMember;
  }
}
