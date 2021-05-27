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
import java.util.List;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.IterableQueryResult;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.UnrestrictedSessionRunner;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.query.sql.NXQL;

public class FVSiteJoinRequestUtilities {

  public static final String SITE_JOIN_REQUEST_SCHEMA = "FVSiteJoinRequest";

  private FVSiteJoinRequestUtilities() {
  }

  public static boolean isMember(CoreSession session, NuxeoPrincipal user, String dialect) {

    if (dialect == null) {
      throw new IllegalArgumentException("no dialect specified");
    }

    try {

      DocumentModel dialectDocument = session.getDocument(new IdRef(dialect));
      if (dialectDocument == null) {
        return false; // if we can't read it with our current permissions, we're
        // definitely not in
        // the group
      }

      // resolve member group names
      List<String> eligibleGroups = new ArrayList<>();

      for (ACE ace : dialectDocument.getACP().getACL(ACL.LOCAL_ACL).getACEs()) {
        String acePrincipal = ace.getUsername();

        if (acePrincipal.contains(CustomSecurityConstants.MEMBERS_GROUP) && ace
            .isGranted()) {
          eligibleGroups.add(acePrincipal);
        }

        if (acePrincipal.contains(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP) && ace
            .isGranted()) {
          eligibleGroups.add(acePrincipal);
        }
      }

      return eligibleGroups.stream().anyMatch(user::isMemberOf);

    } catch (Exception e) {
      // this is a little broad, but the Exceptions aren't checked and I am not sure
      // which ones
      // can be thrown.
      return false;
    }

  }

  public static boolean hasPendingRegistration(CoreSession session, String email,
      String dialect) {
    PendingRegistrationChecker pendingRegistrationChecker = new PendingRegistrationChecker(
        session, email, dialect);
    pendingRegistrationChecker.runUnrestricted();
    return pendingRegistrationChecker.isHasPending();

  }

  private static class PendingRegistrationChecker extends UnrestrictedSessionRunner {

    private final String email;
    private final String dialect;
    private boolean hasPending = false;

    PendingRegistrationChecker(CoreSession session, final String email, final String dialect) {
      super(session);
      this.email = email;
      this.dialect = dialect;
    }

    @Override
    public void run() {
      // prevent duplicate join requests
      try (final IterableQueryResult queryResult = session.queryAndFetch(String.format(
          "SELECT * from"
              + " FVSiteJoinRequest where fvjoinrequest:dialect = %s and "
              + "fvjoinrequest:user = %s",
          NXQL.escapeString(dialect), NXQL.escapeString(email)), "NXQL")) {

        if (queryResult.size() > 0) {
          this.hasPending = true;
        }
      }
    }

    public boolean isHasPending() {
      return hasPending;
    }

  }

}
