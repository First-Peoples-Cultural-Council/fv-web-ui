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

import ca.firstvoices.utils.FVRegistrationUtilities;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Response;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.server.jaxrs.RestOperationException;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.user.invite.UserInvitationService.ValidationMethod;
import org.nuxeo.ecm.user.registration.DocumentRegistrationInfo;
import org.nuxeo.ecm.user.registration.UserRegistrationService;

@Operation(id = FVQuickUserRegistration.ID, category = Constants.CAT_USERS_GROUPS, label = "Guest"
    + " self registration", description = "Starts guest registration.")
public class FVQuickUserRegistration {

  public static final String ID = "User.SelfRegistration";

  private static final Log log = LogFactory.getLog(FVQuickUserRegistration.class);

  @Context
  protected UserManager userManager;

  @Context
  protected UserRegistrationService registrationService;

  @Context
  protected CoreSession session;

  @Context
  protected OperationContext operationContext;

  @Param(name = "docInfo", required = false)
  protected DocumentRegistrationInfo docInfo = null;

  @Param(name = "validationMethod", required = false)
  protected ValidationMethod validationMethod = ValidationMethod.EMAIL;

  @Param(name = "info", required = false)
  protected Map<String, Serializable> info = new HashMap<>();

  @OperationMethod
  public Object run(DocumentModel registrationRequest) throws Exception {
    String ip = null;

    FVRegistrationUtilities utilCommon = new FVRegistrationUtilities();

    // Extract additional information from request
    HttpServletRequest request = (HttpServletRequest) operationContext.get("request");

    // Client IP
    String ip1 = request.getHeader("Remote_Addr");
    String ip2 = request.getHeader("X-Forwarded-For");

    if (ip1 == null || ip1.isEmpty()) {
      ip = ip2;
    }

    // Referer
    String referer = request.getHeader("Referer");

    // User-agent
    String ua = request.getHeader("User-Agent");

    // Add request variables to info object
    info.put("ip", ip);
    info.put("referer", referer);
    info.put("ua", ua);

    /*
     * This operation has for most part similar code to sister operation UserInvite. The main
     * difference is in
     * conditions we apply for both. Common code is split into 2 parts - preCondition -
     * postCondition Each of the
     * operations executes it own, context specific conditions and any other operations
     * following if appropriate. In
     * this case it is sending of emails to both user and LanguageAdministrator informing them
     * about actions.
     */

    try {
      utilCommon.registrationCommonSetup(registrationRequest, session, userManager);

      utilCommon.quickUserRegistrationCondition(registrationRequest, session);

      String registrationId = utilCommon
          .registrationCommonFinish(registrationService, registrationRequest, info, null,
              validationMethod, true, session); // we always autoAccept quick registration
    } catch (RestOperationException e) {
      // Pass validation errors back to UI
      if (e.getStatus() == 400) {
        return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
      }
    }

    return Response.status(200).entity("Thank you for registering!").build();
  }

}
