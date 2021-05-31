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
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.platform.notification.api.NotificationManager;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;

public class FVResolveSignupNotificationAudience implements EventListener {

  public static final Log log = LogFactory.getLog(FVResolveSignupNotificationAudience.class);

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

    switch (event.getName()) {
      case "joinRequestAccepted":
        CoreInstance.doPrivileged(ctx.getCoreSession(), session -> {
          Map<String, Object> infoMap = new HashMap<>();
          notificationManager.sendNotification("joinRequestAccepted",
              infoMap,
              ctx.getSourceDocument().getProperty(SITE_JOIN_REQUEST_SCHEMA, "user").toString());
        });

        break;
      case "userRequestsAccess":
        DocumentModel sourceDocument = ctx.getSourceDocument();
        DocumentRef dialectDocumentId = new IdRef(sourceDocument
            .getProperty(SITE_JOIN_REQUEST_SCHEMA, "dialect")
            .toString());

        CoreInstance.doPrivileged(ctx.getCoreSession(), session -> {
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
            infoMap.put("dialectName", dialectDocument.getTitle());
            infoMap.put("username",
                ctx.getSourceDocument().getProperty(SITE_JOIN_REQUEST_SCHEMA, "user"));
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
      default:
        break;
    }
  }

}
