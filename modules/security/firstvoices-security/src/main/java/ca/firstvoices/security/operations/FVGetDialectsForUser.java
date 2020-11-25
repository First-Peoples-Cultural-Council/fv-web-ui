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

package ca.firstvoices.security.operations;

import ca.firstvoices.security.services.FVUserProfileService;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;

/**
 * Operation gets the dialects a user is a member of TODO: Convert to service
 */
@Operation(id = FVGetDialectsForUser.ID, category = Constants.CAT_USERS_GROUPS, label =
    "FVGetDialectsForUser", description = "")
public class FVGetDialectsForUser {

  public static final String ID = "FVGetDialectsForUser";

  @Context
  protected CoreSession session;

  @Context
  private FVUserProfileService fvUserProfileService;

  @OperationMethod
  public DocumentModelList run() {

    NuxeoPrincipal currentUser = session.getPrincipal();
    return fvUserProfileService.getUserDialects(currentUser, session);
  }

}
