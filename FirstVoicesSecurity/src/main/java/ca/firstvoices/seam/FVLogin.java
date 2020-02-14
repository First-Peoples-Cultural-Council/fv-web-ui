package ca.firstvoices.seam;

import ca.firstvoices.services.FVUserProfileService;
import ca.firstvoices.utils.FVLoginUtils;
import org.apache.catalina.util.URLEncoder;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jboss.seam.ScopeType;
import org.jboss.seam.annotations.*;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.platform.ui.web.rest.RestHelper;
import org.nuxeo.ecm.webapp.helpers.StartupHelper;
import org.nuxeo.runtime.api.Framework;

import javax.faces.context.FacesContext;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.Charset;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Name("startupHelper")
@Scope(ScopeType.SESSION)
@Install(precedence = Install.DEPLOYMENT)
public class FVLogin extends StartupHelper {
    private static final long serialVersionUID = 1L;

    private static final Log log = LogFactory.getLog(FVLogin.class);

    // this is configured with a property to be set easily in nuxeo.conf in different envs
    static String fvContextPath = Framework.getProperty("fv.contextPath", "app");

    // this is configured to avoid redirects for anonymous users, when Nuxeo is run standalone, for example in Dev localhost
    static String fvDisableLoginRedirect = Framework.getProperty("fv.disableLoginRedirect");

    @In(create = true)
    protected transient FVUserProfileService fvUserProfileService;

    @Override
    @Begin(id = "#{conversationIdGenerator.nextMainConversationId}", join = true)
    public String initDomainAndFindStartupPage(String domainTitle, String viewId) {
        String result_from_default_helper = "view_home";

        if (fvContextPath == null) {
            fvContextPath = "";
        }

        try {

            if (documentManager == null) {
                result_from_default_helper = initServerAndFindStartupPage();
            }

            String NUXEO_URL = FVLoginUtils.getBaseURL(restHelper);

            String redirectTo = (NUXEO_URL + fvContextPath).endsWith("/") ? (NUXEO_URL + fvContextPath)
                    : (NUXEO_URL + fvContextPath) + "/";
            String backToPath = RestHelper.getHttpServletRequest().getParameter("backTo");

            NuxeoPrincipal currentUser = documentManager.getPrincipal();

            if (currentUser.isAdministrator()) {
                return "view_home";
            }

            // User is not anonymous
            if (!currentUser.isAnonymous()) {
                if (validatePath(backToPath)) {
                    redirectTo = NUXEO_URL + backToPath;
                }
                // Otherwise, send to default redirect path
                else {
                    redirectTo = fvUserProfileService.getDefaultDialectRedirectPath(documentManager, currentUser, NUXEO_URL, true);
                }

                FacesContext.getCurrentInstance().getExternalContext().redirect(getURIFromPath(redirectTo));

            }
            // User is anonymous (or logging out)
            else {
                // If redirects disabled, send to Nuxeo back-end.
                if (fvDisableLoginRedirect != null && fvDisableLoginRedirect.equals("true")) {
                    return "view_home";
                }

                FacesContext.getCurrentInstance().getExternalContext().redirect(getURIFromPath(redirectTo));
            }

        } catch (URISyntaxException | IOException e) {
            log.error(e);
        }

        return result_from_default_helper;
    }

    public static String getURIFromPath(String redirectTo) throws URISyntaxException, UnsupportedEncodingException {
        redirectTo = URLEncoder.DEFAULT.encode(redirectTo, Charset.availableCharsets().get("UTF-8"));
        return new URI(redirectTo).toASCIIString();
    }

    private boolean validatePath(String path) {
        String URL_REGEX = "^((%[0-9A-Fa-f]{2}|[-()_.!~*';/?:@&=+$,A-Za-z0-9])+)" + "([).!';/?:,][[:blank:]])?$";

        Pattern URL_PATTERN = Pattern.compile(URL_REGEX);

        if (path == null || path.isEmpty()) {
            return false;
        }

        Matcher matcher = URL_PATTERN.matcher(path);
        return matcher.matches();
    }
}
