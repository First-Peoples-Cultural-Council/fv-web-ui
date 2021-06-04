package ca.firstvoices.rest.data;

import ca.firstvoices.security.utils.CustomSecurityConstants;
import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

public class SiteMembershipUpdateRequest implements Serializable {
  public static final String ACCEPT = "ACCEPT";
  public static final String IGNORE = "IGNORE";

  private final String messageToUser;
  private final String newStatus;
  private final String group;

  public SiteMembershipUpdateRequest(final String newStatus, final String messageToUser,
      final String group) {
    this.messageToUser = messageToUser;
    this.newStatus = newStatus;
    this.group = group;

    // an Enum would be better, but harder to make play nice with Nuxeo
    List<String> validStatuses = Arrays.asList(ACCEPT, IGNORE);
    if (validStatuses.stream().noneMatch(s -> s.equals(this.newStatus))) {
      throw new IllegalArgumentException("Invalid status");
    }

    List<String> validGroups = Arrays.asList(CustomSecurityConstants.MEMBERS_GROUP,
        CustomSecurityConstants.RECORDERS_GROUP,
        CustomSecurityConstants.RECORDERS_APPROVERS_GROUP,
        CustomSecurityConstants.LANGUAGE_ADMINS_GROUP, "N/A");
    if (validGroups.stream().noneMatch(s -> s.equals(this.group))) {
      throw new IllegalArgumentException("Invalid group");
    }
  }
 
  public String getMessageToUser() {
    return messageToUser;
  }

  public String getNewStatus() {
    return newStatus;
  }

  public String getGroup() {
    return group;
  }
}
