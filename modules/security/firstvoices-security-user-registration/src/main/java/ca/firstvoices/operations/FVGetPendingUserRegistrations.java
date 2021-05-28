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

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;

@Operation(id = FVGetPendingUserRegistrations.ID,
    category = Constants.CAT_USERS_GROUPS,
    label = "FVGetPendingUserRegistrations",
    description = "Get registrations for specific dialect or "
        + "when input is ALL (*) for the system. \n prune action can be 'ignore', 'approved' or "
        + "'accepted'\n.")
public class FVGetPendingUserRegistrations {

  public static final String ID = "FVGetPendingUserRegistrations";
  public static final String IGNORE = "ignore";
  // approved means they didn't create a password yet
  public static final String APPROVED = "approved";
  // accepted means they created a password
  public static final String ACCEPTED = "accepted";
  private static final Log log = LogFactory.getLog(FVGetPendingUserRegistrations.class);
  @Context protected CoreSession session;

  @Param(name = "dialectID") protected String dialectID;

  @Param(name = "pruneAction", required = false, values = {APPROVED, ACCEPTED, IGNORE})
  protected String pruneAction;

  @OperationMethod
  public DocumentModelList run() {
    DocumentModelList registrations = null;

    try {
      String query = "Select * from Document where ecm:mixinType = 'UserRegistration'";

      // If dialect id provided, filter based on dialect id
      if (!(dialectID.toLowerCase().equals("all") || dialectID.toLowerCase().equals("*"))) {
        query = String.format(
            "Select * from Document where ecm:mixinType = 'UserRegistration' and %s = '%s'",
            "docinfo:documentId",
            dialectID);
      }

      // If "approved" or "accepted" specified, filter based on state
      if (pruneAction.equals(APPROVED) || pruneAction.equals(ACCEPTED)) {
        query = String.format(
            query + "AND ecm:currentLifeCycleState = '%s' ORDER BY dc:created DESC",
            pruneAction);
      }

      registrations = session.query(query);
    } catch (Exception e) {
      log.warn(e);
    }

    return registrations;
  }
}
