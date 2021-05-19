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
import java.util.stream.Collectors;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IterableQueryResult;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.ecm.core.schema.FacetNames;

public class FVSiteJoinRequestUtilities {

  public static final String SITE_JOIN_REQUEST_SCHEMA = "FVSiteJoinRequest";

  private FVSiteJoinRequestUtilities() {
  }


  public static boolean isMember(CoreSession session, NuxeoPrincipal user, String dialect) {

    List<String> groups = user.getGroups();
    if (groups == null || groups.isEmpty()) {
      return false;
    }

    String escapedGroupList = groups
        .stream()
        .map(NXQL::escapeString)
        .collect(Collectors.joining(", "));

    String query = "SELECT * FROM FVDialect WHERE " + NXQL.ECM_MIXINTYPE + " <> '"
        + FacetNames.HIDDEN_IN_NAVIGATION + "' AND " + NXQL.ECM_ISTRASHED + " != 1"
        + " AND ecm:isVersion = 0 AND ecm:uuid = " + NXQL.escapeString(dialect) + " AND "
        + "ecm:acl/*/principal IN (" + escapedGroupList + ") " + " AND ecm:isProxy = 0 ";

    DocumentModelList matches = session.query(query);
    return !matches.isEmpty();
  }

  public static boolean hasPendingRegistration(CoreSession session, String email, String dialect) {
    // prevent duplicate join requests
    try (final IterableQueryResult queryResult = session.queryAndFetch(String.format(
        "SELECT * from"
            + " FVSiteJoinRequest where fvjoinrequest:dialect = %s and fvjoinrequest:user = %s",
        NXQL.escapeString(dialect),
        NXQL.escapeString(email)), "NXQL")) {

      if (queryResult.size() > 0) {
        return true;
      }
    }
    return false;
  }

}
