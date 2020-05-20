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

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.UnrestrictedSessionRunner;
import org.nuxeo.ecm.directory.Session;
import org.nuxeo.ecm.directory.api.DirectoryService;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;

/**
 * Creates a key for the resetPassword demand and store it.
 */
public class CreatePasswordResetLinkUnrestricted extends UnrestrictedSessionRunner {

  public static final Log log = LogFactory.getLog(CreatePasswordResetLinkUnrestricted.class);

  protected String email;

  protected String errorMessage;

  protected String passwordResetLink;

  public CreatePasswordResetLinkUnrestricted(String defaultRepositoryName, String email) {
    super(defaultRepositoryName);
    this.email = email;
  }

  public String getPasswordResetLink() {
    return passwordResetLink;
  }

  @Override
  public void run() {
    DocumentModel userModel = searchCorrectUserByEmail(email);
    if (userModel == null) {
      // user associated with this email does not exist.
      errorMessage = "label.askResetPassForm.registrationnotfound";
      return;
    }
    String key = StringHashGenerator
        .hashStrings(email, Long.toString(Calendar.getInstance().getTimeInMillis()));
    passwordResetLink =
        Framework.getProperty("nuxeo.url") + "/site/resetPassword/enterNewPassword/" + key;
    try (Session session = Framework.getService(DirectoryService.class).open("resetPasswordKeys")) {
      Map<String, Object> fieldMap = new HashMap<String, Object>();
      fieldMap.put("passwordResetKey", key);
      SimpleDateFormat sdf = new SimpleDateFormat("yyMMdd");
      String simpleDate = sdf.format(new Date());
      fieldMap.put("creationDate", simpleDate);
      fieldMap.put("email", email);
      session.createEntry(fieldMap);
    }
  }

  public String getErrorMessage() {
    return errorMessage;
  }

  public DocumentModel searchCorrectUserByEmail(String email) {
    Map<String, Serializable> params = new HashMap<String, Serializable>();
    params.put("email", email);
    DocumentModelList users = Framework.getService(UserManager.class).searchUsers(params, null);
    if (users.size() > 0) {
      // normally we should have only one registered email
      return users.get(0);
    }
    return null;

  }
}
