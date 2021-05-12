package ca.firstvoices.rest.helpers;

import ca.firstvoices.utils.FVRegistrationUtilities;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
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

    boolean alreadyMember = false;

    final DocumentModelList registrations = FVRegistrationUtilities.getRegistrations(session,
        principal.getEmail(),
        dialectId);

    if (principal.isAnonymous()) {
      return DialectMembershipStatus.UNAUTHENTICATED;
    }

    if (registrations.isEmpty() && !alreadyMember) {
      return DialectMembershipStatus.AVAILABLE;
    }
    if (!registrations.isEmpty() && !alreadyMember) {
      return DialectMembershipStatus.PENDING;
    }
    if (alreadyMember) {
      return DialectMembershipStatus.JOINED;
    }

    return DialectMembershipStatus.UNKNOWN;

  }

}
