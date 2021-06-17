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

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

public class FVRegistrationUtilities {

  private FVRegistrationUtilities() {
    throw new IllegalStateException("Utility class");
  }

  /**
   * @param sl
   * @return
   */
  public static List<String> makeArrayFromStringList(StringList sl) {
    if (sl == null) {
      return new ArrayList<>();
    }

    return new ArrayList<>(sl);
  }

  /**
   * @param dateRegistered
   * @return
   */
  public static long calculateRegistrationAgeInDays(Calendar dateRegistered) {
    long timeDiff = Calendar.getInstance().getTimeInMillis() - dateRegistered.getTimeInMillis();
    return timeDiff / (24 * 60 * 60 * 1000);
  }

  // provide hrs within the day since registration started
  public static long calculateRegistrationModHours(Calendar dateRegistered) {
    long timeDiff = Calendar.getInstance().getTimeInMillis() - dateRegistered.getTimeInMillis();
    return (timeDiff / (60 * 60 * 1000)) % 24;
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

    return session.query(query);
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

    return session.query(query);
  }
}
