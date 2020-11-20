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
import ca.firstvoices.security.utils.FVLoginUtils;
import javax.servlet.ServletRequest;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.platform.ui.web.util.BaseURL;
import org.nuxeo.ecm.platform.web.common.vh.VirtualHostHelper;

/**
 * Operation returns the user start page for the current user
 */
@Operation(id = FVGetUserStartPage.ID, category = Constants.CAT_USERS_GROUPS, label =
    "FVGetUserStartPage", description = "")
public class FVGetUserStartPage {

  public static final String ID = "FVGetUserStartPage";

  @Context
  protected CoreSession session;
  @Context
  protected OperationContext ctx;
  /**
   * Determines whether the home page is returned if no specific start page found or an empty
   * string
   */
  @Param(name = "defaultHome")
  protected Boolean defaultHome = true;
  @Context
  private FVUserProfileService fvUserProfileService;

  @OperationMethod
  public String run() {

    ServletRequest request = (ServletRequest) ctx.get("request");

    String baseURL = FVLoginUtils.removeNuxeoFromPath(BaseURL.getBaseURL(request),
        VirtualHostHelper.getContextPath(request));

    NuxeoPrincipal currentUser = session.getPrincipal();
    return fvUserProfileService
        .getDefaultDialectRedirectPath(session, currentUser, baseURL, defaultHome);
  }

}
