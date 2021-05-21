package ca.firstvoices.rest.data;

import java.io.Serializable;

public class SiteMembershipStatus implements Serializable {

  private final String membershipStatus;

  public String getMembershipStatus() {
    return membershipStatus;
  }

  public SiteMembershipStatus(final String membershipStatus) {
    this.membershipStatus = membershipStatus;
  }
}
