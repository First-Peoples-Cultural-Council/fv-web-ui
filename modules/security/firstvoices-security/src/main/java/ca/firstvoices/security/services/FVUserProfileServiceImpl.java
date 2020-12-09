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

package ca.firstvoices.security.services;

import ca.firstvoices.data.models.CustomPreferencesObject;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.logging.log4j.ThreadContext;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.ecm.core.schema.FacetNames;
import org.nuxeo.runtime.api.Framework;

public class FVUserProfileServiceImpl implements FVUserProfileService {

  private static final Log log = LogFactory.getLog(FVUserProfileServiceImpl.class);

  // this is configured with a property to be set easily in nuxeo.conf in different envs
  static String fvContextPath = Framework.getProperty("fv.contextPath", "app");

  public DocumentModelList getUserDialects(NuxeoPrincipal currentUser, CoreSession session) {
    DocumentModelList dialects = null;
    List<String> groups = currentUser.getGroups();

    if (groups != null && !groups.isEmpty()) {
      Iterator<String> it = groups.iterator();

      StringBuilder inClauseBuilder = new StringBuilder("(\"" + groups.get(0) + "\"");

      it.next();
      while (it.hasNext()) {
        inClauseBuilder.append(",\"").append(it.next()).append("\"");
      }
      inClauseBuilder.append(")");

      String query = "SELECT * FROM FVDialect WHERE " + NXQL.ECM_MIXINTYPE + " <> '"
          + FacetNames.HIDDEN_IN_NAVIGATION + "' AND " + NXQL.ECM_ISTRASHED + " != 1"
          + " AND ecm:isVersion = 0 AND ecm:acl/*/principal IN "
          + inClauseBuilder.toString() + " " + " AND ecm:isProxy = 0 ";

      dialects = session.query(query);
    }

    if (dialects == null) {
      dialects = new DocumentModelListImpl();
    }

    //Sentry Context
    ThreadContext.put("userDialects",
        dialects.stream().map(DocumentModel::getName).collect(Collectors.joining(", ")));

    return dialects;
  }

  public String getDefaultDialectRedirectPath(CoreSession documentManager,
      NuxeoPrincipal currentUser, String baseURL, Boolean defaultHome) {
    String primaryDialectPath = null;
    String primaryDialeprimaryDialectShortUrltShortUrl = null;
    String userPreferences = (String) currentUser.getModel().getPropertyValue("user:preferences");

    if (currentUser.isAnonymous()) {
      return null;
    }

    // Lookup dialect in default preferences
    if (userPreferences != null) {
      DocumentModel dialect = null;

      CustomPreferencesObject userPreferencesSettings;
      try {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        userPreferencesSettings = objectMapper
            .readValue(userPreferences, new TypeReference<CustomPreferencesObject>() {
            });
      } catch (IOException e) {
        log.error(e);
        return null;
      }

      String primaryDialect = (String) userPreferencesSettings.getGeneralPreferences()
          .get("primary_dialect");
      if (primaryDialect != null && documentManager.exists(new IdRef(primaryDialect))) {
        // MC-Nuxeo : I see that new inviated users don't have acess to this document even if
        // the dialect its
        // set in theire preferences
        dialect = documentManager.getDocument(new IdRef(primaryDialect));
      }

      if (dialect != null) {
        primaryDialeprimaryDialectShortUrltShortUrl = (String) dialect
            .getPropertyValue("fvdialect:short_url");
        primaryDialectPath = dialect.getPathAsString();
      }
    } else {
      // Find first dialect user is member of...

      DocumentModelList dialects = getUserDialects(currentUser, documentManager);
      // MC-Nuxeo: fvdialect:short_url is always null; where is this set?
      if (dialects != null && !dialects.isEmpty()) {
        primaryDialeprimaryDialectShortUrltShortUrl = (String) dialects.get(0)
            .getPropertyValue("fvdialect:short_url");
        primaryDialectPath = dialects.get(0).getPathAsString();
      }
    }

    String finalPath = null;

    if (primaryDialeprimaryDialectShortUrltShortUrl != null
        && !primaryDialeprimaryDialectShortUrltShortUrl.isEmpty()) {
      // Users who are ONLY global 'members' should just go to the Sections URL
      if (currentUser.getGroups().contains("members") && currentUser.getGroups().size() == 1) {
        finalPath = fvContextPath + "/sections/" + primaryDialeprimaryDialectShortUrltShortUrl;
      } else {
        // Other users can go to Workspaces
        finalPath = fvContextPath + "/Workspaces/" + primaryDialeprimaryDialectShortUrltShortUrl;
      }
    } else if (primaryDialectPath != null) {
      // must encode only Dialect..
      finalPath = fvContextPath + "/explore" + primaryDialectPath;
    }

    if (finalPath == null && !defaultHome) {
      return null;
    }

    return Arrays.asList(baseURL, finalPath == null ? fvContextPath : finalPath).stream()
        .map(s -> (s != null && s.endsWith("/")) ? s.substring(0, s.length() - 1) : s)
        .map(s -> (s != null && s.startsWith("/")) ? s.substring(1) : s)
        .collect(Collectors.joining("/"));
  }
}
