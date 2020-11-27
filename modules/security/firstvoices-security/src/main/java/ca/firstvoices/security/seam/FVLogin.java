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

package ca.firstvoices.security.seam;

import ca.firstvoices.security.services.FVUserProfileService;
import ca.firstvoices.security.utils.FVLoginUtils;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.Charset;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.faces.context.FacesContext;
import org.apache.catalina.util.URLEncoder;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jboss.seam.ScopeType;
import org.jboss.seam.annotations.Begin;
import org.jboss.seam.annotations.In;
import org.jboss.seam.annotations.Install;
import org.jboss.seam.annotations.Name;
import org.jboss.seam.annotations.Scope;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.platform.ui.web.rest.RestHelper;
import org.nuxeo.ecm.webapp.helpers.StartupHelper;
import org.nuxeo.runtime.api.Framework;

@Name("startupHelper")
@Scope(ScopeType.SESSION)
@Install(precedence = Install.DEPLOYMENT)
public class FVLogin extends StartupHelper {

  private static final long serialVersionUID = 1L;

  private static final Log log = LogFactory.getLog(FVLogin.class);

  // this is configured with a property to be set easily in nuxeo.conf in different envs
  static String fvContextPath = Framework.getProperty("fv.contextPath", "app");

  // this is configured to avoid redirects for anonymous users, when Nuxeo is run standalone,
  // for example in Dev localhost
  static String fvDisableLoginRedirect = Framework.getProperty("fv.disableLoginRedirect");

  @In(create = true)
  protected transient FVUserProfileService fvUserProfileService;

  public static String getURIFromPath(String redirectTo)
      throws URISyntaxException {
    redirectTo = URLEncoder.DEFAULT.encode(redirectTo, Charset.availableCharsets().get("UTF-8"));
    return new URI(redirectTo).toASCIIString();
  }

  @Override
  @Begin(id = "#{conversationIdGenerator.nextMainConversationId}", join = true)
  public String initDomainAndFindStartupPage(String domainTitle, String viewId) {
    String resultFromDefaultHelper = "view_home";

    if (fvContextPath == null) {
      fvContextPath = "";
    }

    try {

      if (documentManager == null) {
        resultFromDefaultHelper = initServerAndFindStartupPage();
      }

      String nuxeoUrl = FVLoginUtils.getBaseURL(restHelper);

      String redirectTo = (nuxeoUrl + fvContextPath).endsWith("/") ? (nuxeoUrl + fvContextPath)
          : (nuxeoUrl + fvContextPath) + "/";
      String backToPath = RestHelper.getHttpServletRequest().getParameter("backTo");

      NuxeoPrincipal currentUser = documentManager.getPrincipal();

      if (currentUser.isAdministrator()) {
        return "view_home";
      }

      // User is not anonymous
      if (!currentUser.isAnonymous()) {
        if (validatePath(backToPath)) {
          redirectTo = nuxeoUrl + backToPath;
        } else {        // Otherwise, send to default redirect path

          redirectTo = fvUserProfileService
              .getDefaultDialectRedirectPath(documentManager, currentUser, nuxeoUrl, true);
        }

        FacesContext.getCurrentInstance().getExternalContext().redirect(getURIFromPath(redirectTo));

      } else {
        // User is anonymous (or logging out)

        // If redirects disabled, send to Nuxeo back-end.
        if (fvDisableLoginRedirect != null && fvDisableLoginRedirect.equals("true")) {
          return "view_home";
        }

        FacesContext.getCurrentInstance().getExternalContext().redirect(getURIFromPath(redirectTo));
      }

    } catch (URISyntaxException | IOException e) {
      log.error(e);
    }

    return resultFromDefaultHelper;
  }

  private boolean validatePath(String path) {
    String urlRegex =
        "^((%[0-9A-Fa-f]{2}|[-()_.!~*';/?:@&=+$,A-Za-z0-9])+)" + "([).!';/?:,][[:blank:]])?$";

    Pattern urlPattern = Pattern.compile(urlRegex);

    if (path == null || path.isEmpty()) {
      return false;
    }

    Matcher matcher = urlPattern.matcher(path);
    return matcher.matches();
  }
}
