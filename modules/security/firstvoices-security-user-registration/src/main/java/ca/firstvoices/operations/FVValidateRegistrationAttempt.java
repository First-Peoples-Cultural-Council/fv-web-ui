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

package ca.firstvoices.operations;

import static ca.firstvoices.utils.FVRegistrationConstants.LOGIN_AND_EMAIL_EXIST_ERROR;
import static ca.firstvoices.utils.FVRegistrationConstants.LOGIN_EXISTS_ERROR;
import static ca.firstvoices.utils.FVRegistrationConstants.REGISTRATION_CAN_PROCEED;
import static ca.firstvoices.utils.FVRegistrationConstants.REGISTRATION_EXISTS_ERROR;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;

/*
    public static final int REGISTRATION_CAN_PROCEED       = 0;
    public static final int EMAIL_EXISTS_ERROR             = 1;
    public static final int LOGIN_EXISTS_ERROR             = 2;
    public static final int LOGIN_AND_EMAIL_EXIST_ERROR    = 3;
    public static final int REGISTRATION_EXISTS_ERROR      = 4;

*/
@Operation(id = FVValidateRegistrationAttempt.ID, category = Constants.CAT_USERS_GROUPS, label =
    "FVValidateRegistrationAttempt", description =
    "Validate new user registration attempt. "
        + "Input: Login and Email of the new user. Return error code (email exists, login exist, "
        + "registration can be accepted)")
public class FVValidateRegistrationAttempt {

  public static final String ID = "FVValidateRegistrationAttempt";

  private static final Log log = LogFactory.getLog(FVValidateRegistrationAttempt.class);

  @Param(name = "Login:")
  protected String login;

  @Param(name = "email:", required = false)
  protected String email = null;

  @Context
  protected CoreSession session;

  @OperationMethod
  public int run() {

    return CoreInstance.doPrivileged(session, s -> {

      DocumentModelList registrations = null;
      DocumentModel userE = null;
      int verificationState = REGISTRATION_CAN_PROCEED;
      UserManager userManager = Framework.getService(UserManager.class);
      DocumentModel user = userManager.getUserModel(login);

      if (user != null) {
        verificationState = LOGIN_EXISTS_ERROR;
      } else {
        String querryStr = null;

        if (email != null) {
          userE = userManager.getUserModel(email);

          if (userE != null) {
            verificationState = LOGIN_AND_EMAIL_EXIST_ERROR;
          } else {
            querryStr = String.format(
                "Select * from Document where ecm:mixinType = 'UserRegistration' AND "
                    + "ecm:currentLifeCycleState = 'approved' AND ( %s = '%s' OR %s = '%s')",
                "userinfo:login", login, "userinfo:email", email);
          }
        } else {
          querryStr = String.format(
              "Select * from Document where ecm:mixinType = 'UserRegistration' AND "
                  + "ecm:currentLifeCycleState = 'approved' AND  %s = '%s' ", "userinfo:login",
              login);
        }

        if (userE == null && querryStr != null) {
          registrations = s.query(querryStr);

          if (registrations != null && !registrations.isEmpty()) {
            verificationState = REGISTRATION_EXISTS_ERROR;
          }
        }
      }
      return verificationState;

    });
  }
}
