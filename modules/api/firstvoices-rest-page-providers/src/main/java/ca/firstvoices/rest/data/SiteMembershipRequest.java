package ca.firstvoices.rest.data;

import java.io.Serializable;

public class SiteMembershipRequest implements Serializable {

  private final boolean communityMember;
  private final boolean languageTeam;
  private final String interestReason;
  private final String comment;

  public SiteMembershipRequest(
      final boolean communityMember, final boolean languageTeam, final String interestReason,
      final String comment) {
    this.communityMember = communityMember;
    this.languageTeam = languageTeam;
    this.interestReason = interestReason;
    this.comment = comment;
  }

  public String getComment() {
    return comment;
  }

  public String getInterestReason() {
    return interestReason;
  }

  public boolean isCommunityMember() {
    return communityMember;
  }

  public boolean isLanguageTeam() {
    return languageTeam;
  }

  @Override
  public String toString() {
    return "SiteMembershipRequest{" + "communityMember=" + communityMember + ", languageTeam="
        + languageTeam + ", interestReason='" + interestReason + '\'' + ", comment='" + comment
        + '\'' + '}';
  }
}
