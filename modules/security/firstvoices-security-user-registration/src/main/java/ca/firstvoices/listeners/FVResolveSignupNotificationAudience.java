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

package ca.firstvoices.listeners;

import static ca.firstvoices.utils.FVSiteJoinRequestUtilities.SITE_JOIN_REQUEST_SCHEMA;

import ca.firstvoices.utils.CustomSecurityConstants;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.platform.notification.api.NotificationManager;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.user.invite.UserRegistrationConfiguration;
import org.nuxeo.ecm.user.registration.UserRegistrationService;
import org.nuxeo.runtime.api.Framework;

public class FVResolveSignupNotificationAudience implements EventListener {

  public static final Log log = LogFactory.getLog(FVResolveSignupNotificationAudience.class);

  private final UserRegistrationService registrationService = Framework
      .getService(UserRegistrationService.class);

  @Override
  public void handleEvent(Event event) {

    if (!(event.getContext() instanceof DocumentEventContext)) {
      return;
    }
    DocumentEventContext ctx = (DocumentEventContext) event.getContext();

    log.debug("resolving audience for event " + event.getName() + " triggered by " + event
        .getContext()
        .getPrincipal());

    NotificationManager notificationManager = Framework.getService(NotificationManager.class);
    UserManager userManager = Framework.getService(UserManager.class);

    String siteURL =
        Framework.getProperty("nuxeo.url")
            .replace("/nuxeo", "")
            .replace("8080", "3001");

    switch (event.getName()) {
      case "joinRequestAccepted":
        CoreInstance.doPrivileged(ctx.getCoreSession(), session -> {
          DocumentModel joinRequest = ctx.getSourceDocument();
          DocumentRef dialectDocumentId = new IdRef(joinRequest
              .getProperty(SITE_JOIN_REQUEST_SCHEMA, "dialect")
              .toString());
          DocumentModel dialectDocument = session.getDocument(dialectDocumentId);

          Map<String, Object> infoMap = new HashMap<>();
          infoMap.put("siteName", dialectDocument.getTitle());
          infoMap.put("siteURL", siteURL);

          notificationManager.sendNotification("joinRequestAccepted",
              infoMap,
              ctx.getSourceDocument().getProperty(SITE_JOIN_REQUEST_SCHEMA, "user").toString());
        });

        break;
      case "userRequestsAccess":
        CoreInstance.doPrivileged(ctx.getCoreSession(), session -> {
          DocumentModel joinRequest = ctx.getSourceDocument();
          DocumentRef dialectDocumentId = new IdRef(joinRequest
              .getProperty(SITE_JOIN_REQUEST_SCHEMA, "dialect")
              .toString());

          DocumentModel dialectDocument = session.getDocument(dialectDocumentId);

          String languageAdminGroupName = null;

          for (ACE ace : dialectDocument.getACP().getACL(ACL.LOCAL_ACL).getACEs()) {
            String acePrincipal = ace.getUsername();

            if (acePrincipal.contains(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP)
                && ace.isGranted()) {
              languageAdminGroupName = acePrincipal;
            }
          }

          if (languageAdminGroupName != null) {
            log.warn("sending notification to " + languageAdminGroupName);
            Map<String, Object> infoMap = new HashMap<>();

            String username =
                ctx.getSourceDocument().getProperty(SITE_JOIN_REQUEST_SCHEMA, "user").toString();
            NuxeoPrincipal principal = userManager.getPrincipal(username);
            DocumentModel principalDoc = principal.getModel();

            infoMap.put("siteName", dialectDocument.getTitle());
            infoMap.put("siteURL", siteURL);
            infoMap.put("username", username);
            infoMap.put("firstName", principal.getFirstName());
            infoMap.put("lastName", principal.getLastName());
            infoMap.put("traditionalName", principalDoc.getPropertyValue("user:traditionalName"));
            infoMap.put("communityMember",
                ctx.getSourceDocument().getProperty(SITE_JOIN_REQUEST_SCHEMA, "communityMember"));
            infoMap.put("languageTeam",
                ctx.getSourceDocument().getProperty(SITE_JOIN_REQUEST_SCHEMA, "languageTeam"));
            infoMap.put("interestReason",
                ctx.getSourceDocument().getProperty(SITE_JOIN_REQUEST_SCHEMA, "interestReason"));
            infoMap.put("comment",
                ctx.getSourceDocument().getProperty(SITE_JOIN_REQUEST_SCHEMA, "comment"));
            List<String> recipients =
                userManager.getUsersInGroupAndSubGroups(languageAdminGroupName);

            for (String recipient : recipients) {
              notificationManager.sendNotification("userRequestsAccess", infoMap, recipient);
            }
          }

        });
        break;
      case "registrationExpiring":
        CoreInstance.doPrivileged(ctx.getCoreSession(), session -> {
          DocumentModel registerRequest = ctx.getSourceDocument();

          // Get and construct enter password url
          DocumentModel registerContainer =
              session.getDocument(registerRequest.getParentRef());
          String configName =
              registerContainer.getPropertyValue("registrationconfiguration:name").toString();

          UserRegistrationConfiguration regConfig =
              registrationService.getConfiguration(configName);

          String baseUrl = Framework.getProperty("nuxeo.url");
          baseUrl = StringUtils.isBlank(baseUrl) ? "/" : baseUrl;
          if (!baseUrl.endsWith("/")) {
            baseUrl = baseUrl + "/";
          }

          Map<String, Object> infoMap = new HashMap<>();

          String enterPasswordURL =
              baseUrl.concat(regConfig.getEnterPasswordUrl());

          infoMap.put("enterPasswordURL",
              enterPasswordURL + "/" + configName + "/" + registerRequest.getId());

          infoMap.put("dateCreated",
              registerRequest.getPropertyValue("dc:created"));
          infoMap.put("firstName",
              registerRequest.getPropertyValue("userinfo:firstName"));
          infoMap.put("lastName",
              registerRequest.getPropertyValue("userinfo:lastName"));
          infoMap.put("traditionalName",
              registerRequest.getPropertyValue("fvuserinfo:traditionalName"));

          notificationManager.sendNotification("registrationExpiring",
              infoMap,
              String.valueOf(registerRequest.getPropertyValue("userinfo:email")));
        });

        break;
      default:
        break;
    }
  }

}
