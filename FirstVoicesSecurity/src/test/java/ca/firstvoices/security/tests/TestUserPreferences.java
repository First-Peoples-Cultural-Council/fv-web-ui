package ca.firstvoices.security.tests;

import ca.firstvoices.seam.FVLogin;
import ca.firstvoices.services.FVUserProfileService;
import ca.firstvoices.utils.FVUserPreferencesSetup;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.*;

import javax.inject.Inject;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;

import static org.junit.Assert.*;

@RunWith(FeaturesRunner.class)
@Features({ PlatformFeature.class })
@Deploy({ "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.fvuserprofile.services.xml", "FVUserRegistration:OSGI-INF/extensions/ca.firstvoices.user.xml", "org.nuxeo.ecm.user.registration",
        "org.nuxeo.ecm.user.registration.web:OSGI-INF/user-registration-contrib.xml", "org.nuxeo.ecm.user.invite" })
@PartialDeploy(bundle = "FirstVoicesData", extensions = { TargetExtensions.ContentModel.class })
public class TestUserPreferences extends AbstractFVTest {

    @Inject
    protected CoreSession session;

    @Inject
    protected UserManager userManager;

    @Inject
    protected FVUserProfileService fvUserProfileService;

    static final String NUXEO_URL = System.getProperty("nuxeoURL", "http://localhost/nuxeo/");

    static String FV_CONTEXT_PATH = Framework.getProperty("fv.contextPath", "app");

    DocumentModel dialectDoc;

    @Before
    public void setUp() throws Exception {
        session.createDocument(session.createDocumentModel("/", "FV", "Domain"));
        session.createDocument(session.createDocumentModel("/", "Family", "FVLanguageFamily"));
        session.createDocument(session.createDocumentModel("/Family", "Language", "FVLanguage"));

        dialectDoc = session.createDocument(session.createDocumentModel("/Family/Language", "Dialect", "FVDialect"));
        dialectDoc = session.saveDocument(dialectDoc);
        assertNotNull(dialectDoc);

    }

    @Test
    public void testRedirectionOnUserPreferences() {
        // create a User
        DocumentModel testUser = createUserWithPassword("test@test.com", "Test", "X", "members");
        assertNotNull(testUser);

        // test redirection when user does not have preferences set up and is part of the global membership
        String redirectionUrl = fvUserProfileService.getDefaultDialectRedirectPath(session, userManager.getPrincipal("test@test.com"), NUXEO_URL, true);
        assertEquals(NUXEO_URL + FV_CONTEXT_PATH, redirectionUrl);

        // test redirection when user does not have preferences set up and we DON'T want to redirect to the home page
        String redirectionUrlNoHomePage = fvUserProfileService.getDefaultDialectRedirectPath(session, userManager.getPrincipal("test@test.com"), NUXEO_URL, false);
        assertNull(redirectionUrlNoHomePage);

        // add a dialect but the dialect does not have a short url
        String json = new FVUserPreferencesSetup().createDefaultUserPreferencesWithDialectID(dialectDoc.getId());
        assertNotNull(json);
        testUser.setPropertyValue("user:preferences", json);
        userManager.updateUser(testUser);
        redirectionUrl = fvUserProfileService.getDefaultDialectRedirectPath(session, userManager.getPrincipal("test@test.com"), NUXEO_URL, true);

        assertEquals(NUXEO_URL + "app/explore/Family/Language/Dialect", redirectionUrl);

        // add a short url on the dialect
        dialectDoc.setPropertyValue("fvdialect:short_url", "dialect");
        dialectDoc = session.saveDocument(dialectDoc);

        redirectionUrl = fvUserProfileService.getDefaultDialectRedirectPath(session, userManager.getPrincipal("test@test.com"), NUXEO_URL, true);

        assertEquals(NUXEO_URL+ "app/sections/dialect", redirectionUrl);

    }

    @Test
    public void testDifferentUserPreferences() {
        DocumentModel testUser = createUserWithPassword("test@test.com", "Test", "X", "members");
        assertNotNull(testUser);
        String json = String.format(
                "{\"navigationPreferences\":{\"start_page\":\"my_dialect\"},\"themePreferences\":{\"font_size\":\"default\"},\"generalPreferences\":{\"primary_dialect\":\"%s\"}}",
                dialectDoc.getId());
        testUser.setPropertyValue("user:preferences", json);
        userManager.updateUser(testUser);
        String redirectionUrl = fvUserProfileService.getDefaultDialectRedirectPath(session, userManager.getPrincipal("test@test.com"), NUXEO_URL, true);
        assertEquals(NUXEO_URL + "app/explore/Family/Language/Dialect", redirectionUrl);
    }

    @Test
    public void testSpecialCharactersInDialect() {
        Exception e = null;
        String redirectPath = "/app/explore/FV/Workspaces/Data/TEST my dialect /xTest Dialect portal";
        try {
            redirectPath = FVLogin.getURIFromPath(redirectPath);
        } catch (URISyntaxException | UnsupportedEncodingException e1) {
            e = e1;
        }
        assertNull(e);

        e = null;
        redirectPath = "explore/FV/Workspaces/Data/SENĆOŦEN/SENĆOŦEN/SENĆOŦEN";
        try {
            redirectPath = FVLogin


                    .getURIFromPath(redirectPath);
        } catch (URISyntaxException | UnsupportedEncodingException e1) {
            e = e1;
        }
        assertNull(e);

        e = null;
        redirectPath = "/app/explore/FV/Workspaces/Data/TEST x̣ƏƏpɬ LANG/TEST x̣ƏƏpɬ Dialect/x̣ƏƏpɬ-Dialect";
        try {
            redirectPath = FVLogin.getURIFromPath(redirectPath);
        } catch (URISyntaxException | UnsupportedEncodingException e1) {
            e = e1;
        }
        assertNull(e);

    }
}
