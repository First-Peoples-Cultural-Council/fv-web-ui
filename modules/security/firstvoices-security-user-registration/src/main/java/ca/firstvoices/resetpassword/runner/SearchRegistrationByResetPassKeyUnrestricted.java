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

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.UnrestrictedSessionRunner;
import org.nuxeo.ecm.directory.Session;
import org.nuxeo.ecm.directory.api.DirectoryService;
import org.nuxeo.runtime.api.Framework;

/**
 * Search a registration with the given resetPasswordKey.
 */
public class SearchRegistrationByResetPassKeyUnrestricted extends UnrestrictedSessionRunner {

  protected String passwordKey;

  protected String errorMessage;

  protected DocumentModel registration;

  public SearchRegistrationByResetPassKeyUnrestricted(CoreSession session, String passwordKey) {
    super(session);
    this.passwordKey = passwordKey;
  }

  public SearchRegistrationByResetPassKeyUnrestricted(String repositoryName, String passwordKey) {
    super(repositoryName);
    this.passwordKey = passwordKey;
  }

  @Override
  public void run() {
    try (Session session = Framework.getService(DirectoryService.class).open("resetPasswordKeys")) {
      DocumentModel entry = session.getEntry(passwordKey);
      if (entry == null) {
        // No key found
        errorMessage = "label.resetPassForm.registrationnotfound";
        return;
      }
      registration = entry;
    }
  }

  public String getErrorMessage() {
    return errorMessage;
  }

  public DocumentModel getRegistration() {
    return registration;
  }

}
