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

import java.util.List;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.platform.usermanager.UserManager;

public class FVOperationCredentialsVerification {

  private static int GLOBAL_ADMINISTRATOR_OR_SYSTEM = 1;

  private static int LANGUAGE_ADMINISTRATOR = 2;

  private static int INVALID_CREDENTIALS = 0;

  private static String language_admin_group = null;

  private static int isValidPrincipal(NuxeoPrincipal p) {
    String principalName = p.getName();
    language_admin_group = null;

    if (!(principalName.equals("system") || principalName.equals("Administrator"))) {
      List<String> principalGroups = p.getGroups();

      for (String gn : principalGroups) {
        if (gn.equals("administrators")) {
          return GLOBAL_ADMINISTRATOR_OR_SYSTEM;
        }

        if (gn.contains("_language_administrators")) {
          language_admin_group = gn;
          return LANGUAGE_ADMINISTRATOR;
        }
      }

      return INVALID_CREDENTIALS;
    }

    return GLOBAL_ADMINISTRATOR_OR_SYSTEM;
  }

  public static boolean newUserHomeChange(
      CoreSession session, UserManager userManager, String username, String dialectGUID) {
    try {
      NuxeoPrincipal invokingPrincipal = session.getPrincipal();

      int credentialsType = isValidPrincipal(invokingPrincipal);

      if (credentialsType != GLOBAL_ADMINISTRATOR_OR_SYSTEM) {
        // language admin can make changes to a user in their dialect
        if (credentialsType == LANGUAGE_ADMINISTRATOR) {
          DocumentModelList registrations = FVRegistrationUtilities.getRegistrations(
              session,
              username,
              dialectGUID);

          // If registrations for this dialect found, allow moving user
          return registrations.size() <= 0;
        }

        return true; // invalid credentials
      }
    } catch (Exception e) {
      return true;
    }

    return false; // continue executing command - valid credentials
  }

  public static boolean userUpdate(
      CoreSession session, UserManager userManager, String username) {
    NuxeoPrincipal invokingPrincipal = session.getPrincipal();

    int credentialsType = isValidPrincipal(invokingPrincipal);

    if (credentialsType != GLOBAL_ADMINISTRATOR_OR_SYSTEM) {
      // language admin can make changes to a user in their dialect
      // LANGUAGE_ADMINISTRATOR
      if (credentialsType == LANGUAGE_ADMINISTRATOR) {
        NuxeoPrincipal userToChange = userManager.getPrincipal(username);

        int ui = language_admin_group.indexOf("_");
        String dns = language_admin_group.substring(0, ui); // dialect name

        List<String> userToChangeGroups = userToChange.getGroups();

        for (String gn : userToChangeGroups) {
          if (gn.contains(dns)) {
            return false; // valid credentials
          }
        }
      }

      return true; // invalid credentials
    }

    return false; // continue executing command - valid credentials
  }

  public static boolean groupUpdate(
      CoreSession session, String groupName) {
    NuxeoPrincipal invokingPrincipal = session.getPrincipal();

    int credentialsType = isValidPrincipal(invokingPrincipal);

    if (credentialsType != GLOBAL_ADMINISTRATOR_OR_SYSTEM) {
      // language admin can make changes to a group associated with their dialect
      if (credentialsType == LANGUAGE_ADMINISTRATOR) {
        int ui = language_admin_group.indexOf("_");
        String dns = language_admin_group.substring(0, ui); // dialect name ending

        return !groupName.contains(dns); // continue executing command - valid credentials
      }

      return true; // invalid credentials
    }

    return false; // continue executing command - valid credentials
  }
}
