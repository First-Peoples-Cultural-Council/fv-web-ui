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

/*
 * Contributors:
 *     Kristof Subryan <vtr_monk@mac.com>
 */

package ca.firstvoices.operations;


import static ca.firstvoices.utils.FVRegistrationConstants.EMAIL_EXISTS_ERROR;
import static ca.firstvoices.utils.FVRegistrationConstants.LOGIN_AND_EMAIL_EXIST_ERROR;
import static ca.firstvoices.utils.FVRegistrationConstants.LOGIN_EXISTS_ERROR;
import static ca.firstvoices.utils.FVRegistrationConstants.REGISTRATION_CAN_PROCEED;
import static ca.firstvoices.utils.FVRegistrationConstants.REGISTRATION_EXISTS_ERROR;

import ca.firstvoices.user.FVUserRegistrationInfo;
import java.io.Serializable;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Response;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.server.jaxrs.RestOperationException;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.user.invite.UserInvitationComponent;
import org.nuxeo.ecm.user.invite.UserInvitationService.ValidationMethod;
import org.nuxeo.ecm.user.registration.DocumentRegistrationInfo;
import org.nuxeo.ecm.user.registration.UserRegistrationService;

@Operation(id = FVQuickUserRegistration.ID,
    category = Constants.CAT_USERS_GROUPS,
    label = "Guest" + " self registration",
    description = "Starts guest registration.")
public class FVQuickUserRegistration {

  public static final String ID = "User.SelfRegistration";

  private FVUserRegistrationInfo userInfo;

  @Context protected UserManager userManager;

  @Context protected UserRegistrationService registrationService;

  @Context protected CoreSession session;

  @Context protected OperationContext operationContext;

  @Param(name = "docInfo", required = false) protected DocumentRegistrationInfo docInfo = null;

  @Param(name = "validationMethod", required = false) protected ValidationMethod validationMethod =
      ValidationMethod.EMAIL;

  @Param(name = "info", required = false) protected Map<String, Serializable> info =
      new HashMap<>();

  @OperationMethod
  public Object run(DocumentModel registrationRequest) {
    HttpServletRequest request = (HttpServletRequest) operationContext.get("request");

    try {
      // Setup `info` (this gets added to the registration object)
      info.put("fvuserinfo:ip", getIp(request));
      info.put("fvuserinfo:referer", request.getHeader("Referer"));
      info.put("fvuserinfo:ua", request.getHeader("User-Agent"));
      info.put("fvuserinfo:traditionalName",
          registrationRequest.getPropertyValue("fvuserinfo:traditionalName"));

      info.put(UserInvitationComponent.PARAM_ORIGINATING_USER, session.getPrincipal().getName());

      // Setup `userinfo` (this gets translated to a user object)
      userInfo = new FVUserRegistrationInfo();
      userInfo.setEmail((String) registrationRequest.getPropertyValue("userinfo:email"));
      userInfo.setFirstName((String) registrationRequest.getPropertyValue("userinfo:firstName"));
      userInfo.setLastName((String) registrationRequest.getPropertyValue("userinfo:lastName"));
      userInfo.setLogin(userInfo.getEmail());
      userInfo.setGroups(Collections.singletonList("members"));

      submitRegistration(info, validationMethod);
    } catch (RestOperationException e) {
      // Pass validation errors back to UI
      if (e.getStatus() == 400) {
        return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
      }
    }

    return Response.status(200).entity("Thank you for registering!").build();
  }

  /**
   * @param info
   * @param validationMethod
   * @return
   */
  private void submitRegistration(Map<String, Serializable> info,
      ValidationMethod validationMethod) throws RestOperationException {
    int validationStatus;

    // Validate registration
    validationStatus = validateRegistration(userInfo.getLogin(), userInfo.getEmail());

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

    registrationService.submitRegistrationRequest(
        userInfo,
        info,
        validationMethod,
        true,
        userInfo.getEmail());
  }

  private int validateRegistration(String login, String email) {
    return CoreInstance.doPrivileged(session, s -> {

      DocumentModelList registrations = null;
      DocumentModel userE = null;
      int verificationState = REGISTRATION_CAN_PROCEED;
      DocumentModel user = userManager.getUserModel(login);

      if (user != null) {
        verificationState = LOGIN_EXISTS_ERROR;
      } else {
        String queryStr = null;

        if (email != null) {
          userE = userManager.getUserModel(email);

          if (userE != null) {
            verificationState = LOGIN_AND_EMAIL_EXIST_ERROR;
          } else {
            queryStr = String.format(
                "Select * from Document where ecm:mixinType = 'UserRegistration' AND "
                    + "ecm:currentLifeCycleState = 'approved' AND ( %s = '%s' OR %s = '%s')",
                "userinfo:login",
                login,
                "userinfo:email",
                email);
          }
        } else {
          queryStr = String.format(
              "Select * from Document where ecm:mixinType = 'UserRegistration' AND "
                  + "ecm:currentLifeCycleState = 'approved' AND  %s = '%s' ",
              "userinfo:login",
              login);
        }

        if (userE == null && queryStr != null) {
          registrations = s.query(queryStr);

          if (registrations != null && !registrations.isEmpty()) {
            verificationState = REGISTRATION_EXISTS_ERROR;
          }
        }
      }

      return verificationState;
    });
  }

  private String getIp(HttpServletRequest request) {
    String ip = null;

    // Client IP
    String ip1 = request.getHeader("Remote_Addr");
    String ip2 = request.getHeader("X-Forwarded-For");

    if (ip1 == null || ip1.isEmpty()) {
      ip = ip2;
    }

    return ip;
  }
}
