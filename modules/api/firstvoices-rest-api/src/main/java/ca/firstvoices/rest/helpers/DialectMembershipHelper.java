package ca.firstvoices.rest.helpers;

import ca.firstvoices.utils.FVSiteJoinRequestUtilities;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;

public class DialectMembershipHelper {

  private DialectMembershipHelper() {
  }

  public enum DialectMembershipStatus {
    UNKNOWN("unknown"), AVAILABLE("available"), PENDING("pending"), JOINED("joined"), UNJOINABLE(
        "not joinable"), UNAUTHENTICATED("unauthenticated");

    private final String status;

    public String getStatus() {
      return this.status;
    }

    DialectMembershipStatus(String status) {
      this.status = status;
    }
  }

  public static DialectMembershipStatus getMembershipStatus(
      CoreSession session, NuxeoPrincipal principal, String dialectId) {

    boolean alreadyMember = FVSiteJoinRequestUtilities.isMember(session,
        principal,
        dialectId);

    boolean pendingRegistration = FVSiteJoinRequestUtilities.hasPendingRegistration(session,
        principal.getEmail(),
        dialectId);


    if (principal.isAnonymous()) {
      return DialectMembershipStatus.UNAUTHENTICATED;
    }

    if (alreadyMember) {
      return DialectMembershipStatus.JOINED;
    }

    if (!pendingRegistration) {
      return DialectMembershipStatus.AVAILABLE;
    }

    return DialectMembershipStatus.PENDING;

  }

}
