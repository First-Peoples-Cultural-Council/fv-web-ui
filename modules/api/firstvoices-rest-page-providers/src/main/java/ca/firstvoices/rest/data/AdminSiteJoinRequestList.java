package ca.firstvoices.rest.data;

import java.io.Serializable;
import java.util.List;

public class AdminSiteJoinRequestList implements Serializable {

  private final List<AdminSiteJoinRequest> joinRequests;

  public AdminSiteJoinRequestList(
      final List<AdminSiteJoinRequest> requests) {
    joinRequests = requests;
  }

  public List<AdminSiteJoinRequest> getJoinRequests() {
    return joinRequests;
  }
}
