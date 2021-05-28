/*
 *
 *  *
 *  * Copyright 2020 First People's Cultural Council
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  * /
 *
 */

package ca.firstvoices.utils;

import static ca.firstvoices.utils.FVRegistrationConstants.EMAIL_EXISTS_ERROR;
import static ca.firstvoices.utils.FVRegistrationConstants.LOGIN_AND_EMAIL_EXIST_ERROR;
import static ca.firstvoices.utils.FVRegistrationConstants.LOGIN_EXISTS_ERROR;
import static ca.firstvoices.utils.FVRegistrationConstants.REGISTRATION_CAN_PROCEED;
import static ca.firstvoices.utils.FVRegistrationConstants.REGISTRATION_EXISTS_ERROR;
import ca.firstvoices.user.FVUserRegistrationInfo;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.automation.server.jaxrs.RestOperationException;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.UnrestrictedSessionRunner;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.user.invite.UserInvitationComponent;
import org.nuxeo.ecm.user.invite.UserInvitationService.ValidationMethod;
import org.nuxeo.ecm.user.registration.UserRegistrationService;
import org.nuxeo.runtime.api.Framework;

public class FVRegistrationUtilities {

  private static final Log log = LogFactory.getLog(FVRegistrationUtilities.class);

  private FVUserRegistrationInfo userInfo;

  private FVRegistrationMailUtilities mailUtil = new FVRegistrationMailUtilities();
  private OperationContext ctx;

  /**
   * @param sl
   * @return
   */
  public static ArrayList<String> makeArrayFromStringList(StringList sl) {
    if (sl == null) {
      return null;
    }

    ArrayList<String> al = new ArrayList<>();
    for (String s : sl) {
      al.add(s);
    }

    return al;
  }

  /**
   * @param dateRegistered
   * @return
   */
  public static long calculateRegistrationAgeInDays(Calendar dateRegistered) {
    long timeDiff = Calendar.getInstance().getTimeInMillis() - dateRegistered.getTimeInMillis();
    long diffDays = timeDiff / (24 * 60 * 60 * 1000);

    return diffDays;
  }

  // provide hrs within the day since registration started
  public static long calculateRegistrationModHours(Calendar dateRegistered) {
    long timeDiff = Calendar.getInstance().getTimeInMillis() - dateRegistered.getTimeInMillis();
    long diffHours = (timeDiff / (60 * 60 * 1000)) % 24;
    return diffHours;
  }

  /**
   * Removes registration request for users
   *
   * @param users list of users to remove registration requests for
   */
  public static void removeRegistrationsForUsers(CoreSession session, StringList users) {
    DocumentModelList docs = getRegistrations(session, users);

    for (DocumentModel doc : docs) {
      session.removeDocument(doc.getRef());
    }
  }

  /**
   * Get registration for a list of users
   *
   * @param users list of users to lookup registration for
   */
  public static DocumentModelList getRegistrations(CoreSession session, StringList users) {
    String query = String.format(
        "SELECT * FROM FVUserRegistration " + "WHERE userinfo:email IN ('%s') "
            + "ORDER BY dc:created DESC",
        String.join("','", users));

    DocumentModelList docs = session.query(query);

    return docs;
  }

  /**
   * Get registration for single user, for a dialect
   *
   * @param user    user to lookup registration for
   * @param dialect dialect user requested to join
   */
  public static DocumentModelList getRegistrations(
      CoreSession session, String user, String dialect) {
    String query = String.format(
        "SELECT * FROM FVUserRegistration " + "WHERE userinfo:email LIKE '%s' "
            + "AND fvuserinfo:requestedSpace = '%s' " + "ORDER BY dc:created DESC",
        user,
        dialect);

    DocumentModelList docs = session.query(query);

    return docs;
  }

  /**
   * @param registrationRequest
   * @param session
   * @param userManager1
   */
  public void registrationCommonSetup(
      DocumentModel registrationRequest, CoreSession session, UserManager userManager1) {

    userInfo = new FVUserRegistrationInfo();

    userInfo.setEmail((String) registrationRequest.getPropertyValue("userinfo:email"));
    userInfo.setFirstName((String) registrationRequest.getPropertyValue("userinfo:firstName"));
    userInfo.setLastName((String) registrationRequest.getPropertyValue("userinfo:lastName"));
    userInfo.setLogin(userInfo.getEmail());

    try {
      FVUserPreferencesSetup up = new FVUserPreferencesSetup();
      String defaultUserPrefs =
          up.createDefaultUserPreferencesWithRegistration(registrationRequest);
      userInfo.setPreferences(defaultUserPrefs);
    } catch (Exception e) {
      log.error(e);
    }
  }

  /**
   * @param registrationRequest
   * @param session
   * @return
   */
  public void quickUserRegistrationCondition(
      DocumentModel registrationRequest, CoreSession session) {

    ArrayList<String> preSetGroup;
    preSetGroup = new ArrayList();
    preSetGroup.add("members");

    userInfo.setGroups(preSetGroup);

  }

  /**
   * @param registrationRequest
   * @param session
   * @return
   */
  public boolean userInviteCondition(DocumentModel registrationRequest, CoreSession session) {
    boolean autoAccept;

    // If authorized, use preset groups
    NuxeoPrincipal currentUser = session.getPrincipal();
    if (currentUser.isAdministrator()
        || currentUser.isMemberOf(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP)) {
      autoAccept = true;

      @SuppressWarnings("unchecked") List<String> preSetGroup =
          (List<String>) registrationRequest.getPropertyValue("userinfo:groups");

      if (!preSetGroup.isEmpty()) {
        userInfo.setGroups(preSetGroup);
      }
    } else {
      // If not authorized, never autoAccept

      autoAccept = false;
    }

    return autoAccept;
  }

  /**
   * @param registrationService
   * @param registrationRequest
   * @param info
   * @param comment
   * @param validationMethod
   * @param autoAccept
   * @return
   */
  public String registrationCommonFinish(
      UserRegistrationService registrationService, DocumentModel registrationRequest,
      Map<String, Serializable> info, String comment, ValidationMethod validationMethod,
      boolean autoAccept, CoreSession session) throws Exception {
    int validationStatus;

    try {
      ctx = new OperationContext(session);
      Map<String, Object> params = new HashMap<>();
      params.put("Login:", userInfo.getEmail());
      params.put("email:", userInfo.getEmail());
      AutomationService automationService = Framework.getService(AutomationService.class);
      validationStatus = (int) automationService.run(ctx, "FVValidateRegistrationAttempt", params);
    } catch (Exception e) {
      log.warn("Exception while validating registration.");
      throw new Exception("Exception while invoking registration validation. " + e);
    } finally {
      ctx.close();
    }

    if (validationStatus != REGISTRATION_CAN_PROCEED) {
      switch (validationStatus) {
        case EMAIL_EXISTS_ERROR:
        case LOGIN_EXISTS_ERROR:
        case LOGIN_AND_EMAIL_EXIST_ERROR:
          throw new RestOperationException("This email address is already in use.", 400);

        case REGISTRATION_EXISTS_ERROR:
          throw new RestOperationException(
              "A pending registration with the same credentials is present. Please check your "
                  + "email (including SPAM folder) for a message with instructions or contact us"
                  + " for help.",
              400);
        default:
          break;
      }
    }

    // Additional information from registration
    info.put("fvuserinfo:preferences", userInfo.getPreferences());
    info.put(UserInvitationComponent.PARAM_ORIGINATING_USER, session.getPrincipal().getName());

    // Set permissions on registration document
    String registrationId = null;

    registrationId = registrationService.submitRegistrationRequest(userInfo,
        info,
        validationMethod,
        autoAccept,
        userInfo.getEmail());

    return registrationId;
  }

  /**
   * @param uregRef
   */
  public void registrationValidationHandler(DocumentRef uregRef, CoreSession s) {
    UserManager userManager = Framework.getService(UserManager.class);

    CoreInstance.doPrivileged(s, session -> {

      DocumentModel ureg = session.getDocument(uregRef);
      String username = (String) ureg.getPropertyValue("userinfo:login");
      DocumentModel userDoc = userManager.getUserModel(username);

      try {
        // Set creation time
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date(System.currentTimeMillis()));

        // String defaultUserPrefs = up.createDefaultUserPreferencesWithRegistration( ureg );

        // Update user properties

        // If user requested access to a private (i.e. Enabled) dialect; do not set user
        // preferences
        // so that the user is not redirected to the private dialect and gets a 404.
        // Next step would be for Language Administrator to add them to a group directly.
        userDoc.setPropertyValue("user:ua", ureg.getPropertyValue("fvuserinfo:ua"));
        userDoc.setPropertyValue("user:ip", ureg.getPropertyValue("fvuserinfo:ip"));
        userDoc.setPropertyValue("user:referer", ureg.getPropertyValue("fvuserinfo:referer"));
        userDoc.setPropertyValue("user:created", calendar);
        userManager.updateUser(userDoc);

        // Add user to 'members' group
        String newUserGroup = "members";
      } catch (Exception e) {
        log.error("Exception while updating user and completing registration " + e);
        throw new NuxeoException(e);
      }
    });
  }

  protected static class UnrestrictedSourceDocumentResolver extends UnrestrictedSessionRunner {

    // private final CoreSession session;
    private final String docid;

    public DocumentModel dialect;

    protected UnrestrictedSourceDocumentResolver(CoreSession session, String docId) {
      super(session);
      // this.session = session;
      docid = docId;
    }

    @Override
    public void run() {
      // Get requested space (dialect)
      dialect = session.getDocument(new IdRef(docid));

      if (dialect.isProxy()) {
        dialect = session.getSourceDocument(dialect.getRef());
      }
      dialect.detach(true);
    }
  }

  protected static class UnrestrictedGroupResolver extends UnrestrictedSessionRunner {

    // private final CoreSession session;
    private DocumentModel dialect;

    private ArrayList<String> memberGroups = new ArrayList<>();

    private String languageAdminGroup;

    protected UnrestrictedGroupResolver(CoreSession session, DocumentModel dialect) {
      super(session);
      // this.session = session;
      this.dialect = dialect;
    }

    @Override
    public void run() {
      DocumentModel dialect1 = session.getDocument(new IdRef(dialect.getId()));
      // Add user to relevant group
      for (ACE ace : dialect1.getACP().getACL(ACL.LOCAL_ACL).getACEs()) {

        String username = ace.getUsername();

        if (SecurityConstants.READ.equals(ace.getPermission())) {
          if (username.contains("_members") && ace.isGranted()) {
            memberGroups.add(username);
          }
        }

        if (SecurityConstants.EVERYTHING.equals(ace.getPermission()) && ace.isGranted()) {
          if (username.contains(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP)) {
            languageAdminGroup = username;
          }
        }
      }
    }
  }

  protected static class UnrestrictedRequestPermissionResolver extends UnrestrictedSessionRunner {

    private String registrationDocId;

    private String languageAdminGroup;

    protected UnrestrictedRequestPermissionResolver(
        CoreSession session, String registrationDocId, String languageAdminGroup) {
      super(session);
      this.registrationDocId = registrationDocId;
      this.languageAdminGroup = languageAdminGroup;
    }

    @Override
    public void run() {
      DocumentModel registrationDoc = session.getDocument(new IdRef(registrationDocId));

      ACE registrationACE = new ACE(languageAdminGroup, SecurityConstants.EVERYTHING);
      ACE registrationContainerACE = new ACE(languageAdminGroup, SecurityConstants.REMOVE_CHILDREN);

      ACP registrationDocACP = registrationDoc.getACP();
      registrationDocACP.addACE("local", registrationACE);
      registrationDoc.setACP(registrationDocACP, false);

      // Apply REMOVE CHILD permission to parent so that registration requests can be removed.
      DocumentModel registrationContainer = session.getDocument(registrationDoc.getParentRef());
      ACP registrationContainerDocACP = registrationContainer.getACP();
      registrationContainerDocACP.addACE("local", registrationContainerACE);

      registrationContainer.setACP(registrationContainerDocACP, false);
    }
  }
}
