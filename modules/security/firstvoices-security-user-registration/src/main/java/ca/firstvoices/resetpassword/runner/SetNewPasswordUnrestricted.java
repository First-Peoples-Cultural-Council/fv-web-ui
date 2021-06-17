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

package ca.firstvoices.resetpassword.runner;

import javax.ws.rs.core.Response;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.UnrestrictedSessionRunner;
import org.nuxeo.ecm.directory.Session;
import org.nuxeo.ecm.directory.api.DirectoryService;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;

/**
 * Set the new password for the user.
 */
public class SetNewPasswordUnrestricted extends UnrestrictedSessionRunner {

  public static final Log log = LogFactory.getLog(SetNewPasswordUnrestricted.class);

  protected Response response;

  protected String passwordKey;

  protected String password;

  protected String errorMessage;

  public SetNewPasswordUnrestricted(
      String defaultRepositoryName, String password, String passwordKey) {
    super(defaultRepositoryName);
    this.password = password;
    this.passwordKey = passwordKey;
  }

  public Response getResponse() {
    return response;
  }

  @Override
  public void run() {

    SearchRegistrationByResetPassKeyUnrestricted runner =
        new SearchRegistrationByResetPassKeyUnrestricted(session, passwordKey);
    runner.runUnrestricted();
    DocumentModel registration = runner.getRegistration();
    if (registration == null) {
      // No key found
      errorMessage = "label.resetPassForm.registrationnotfound";
      return;
    }
    String email = registration.getProperty("resetPasswordKeys:email").getValue(String.class);
    UserManager userManager = Framework.getService(UserManager.class);
    NuxeoPrincipal currentUser = userManager.getPrincipal(email);
    currentUser.setPassword(password);
    userManager.updateUser(currentUser.getModel());
    if (!userManager.checkUsernamePassword(currentUser.getName(), password)) {
      errorMessage = "label.resetPassForm.error";
      return;
    }
    try (Session session = Framework.getService(DirectoryService.class).open("resetPasswordKeys")) {
      session.deleteEntry(passwordKey);
    }

  }

  public String getErrorMessage() {
    return errorMessage;
  }

}
