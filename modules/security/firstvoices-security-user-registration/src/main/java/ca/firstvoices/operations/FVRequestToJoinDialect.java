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

import java.util.Date;
import javax.ws.rs.core.Response;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.IterableQueryResult;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.ecm.platform.usermanager.UserManager;

@Operation(id = FVRequestToJoinDialect.ID,
    category = Constants.CAT_USERS_GROUPS,
    label = "Request to join dialect",
    description = "An existing user requests to join a dialect")
public class FVRequestToJoinDialect {

  public static final String ID = "User.RequestToJoinDialect";

  private static final Log log = LogFactory.getLog(FVRequestToJoinDialect.class);

  @Context protected CoreSession session;

  @Context protected UserManager userManager;

  @Context protected OperationContext operationContext;

  @Param(name = "communityMember", required = true) protected boolean communityMember;
  @Param(name = "languageTeam", required = true) protected boolean languageTeam;
  @Param(name = "interestReason", required = false) protected String interestReason;
  @Param(name = "comment", required = false) protected String comment;
  @Param(name = "dialect", required = true) protected String dialect;

  @OperationMethod
  public void run() throws Exception {
    NuxeoPrincipal user = operationContext.getPrincipal();

    final DocumentModel joinRequest = session.createDocumentModel("FVSiteJoinRequest");

    // prevent duplicate join requests
    try (final IterableQueryResult queryResult = session.queryAndFetch(String.format(
        "SELECT * from FVSiteJoinRequest where fvjoinrequest:dialect = %s and fvjoinrequest:user "
            + "= %s",
        NXQL.escapeString(dialect),
        NXQL.escapeString(user.getEmail())), "NXQL")) {

      if (queryResult.size() > 0) {
        throw new OperationException("You cannot request to join more than once");
      }
    }

    joinRequest.setProperty("FVSiteJoinRequest", "user", user.getEmail());
    joinRequest.setProperty("FVSiteJoinRequest", "dialect", dialect);
    joinRequest.setProperty("FVSiteJoinRequest", "requestTime", new Date());
    joinRequest.setProperty("FVSiteJoinRequest", "languageTeam", languageTeam);
    joinRequest.setProperty("FVSiteJoinRequest", "communityMember", communityMember);
    joinRequest.setProperty("FVSiteJoinRequest", "interestReason", interestReason);
    joinRequest.setProperty("FVSiteJoinRequest", "comment", dialect);

    final DocumentModel joinRequestDocument = session.createDocument(joinRequest);
    session.saveDocument(joinRequestDocument);

  }

}
