package ca.firstvoices.services;

import static org.junit.Assert.assertNotNull;

import ca.firstvoices.security.tests.AbstractFVTest;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import javax.inject.Inject;
import javax.security.auth.login.LoginException;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.local.ClientLoginModule;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.login.test.ClientLoginFeature;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.PartialDeploy;
import org.nuxeo.runtime.test.runner.TargetExtensions;

/**
 * @author david
 */
@RunWith(FeaturesRunner.class)
@Features({PlatformFeature.class, AutomationFeature.class})
@Deploy({"FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.services.gettasksforuser.xml"})
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy("FirstVoicesSecurity.tests:OSGI-INF.extensions/ca.firstvoices.fakestudio.xml")
public class GetTasksServiceTest extends AbstractFVTest {

  @Inject
  private GetTasksService service;

  @Inject
  private CoreSession session;

  @Inject
  ClientLoginFeature login;

  @Before
  public void setUp() {
    session.removeChildren(session.getRootDocument().getRef());
    session.createDocument(session.createDocumentModel("/", "FV", "Domain"));
    session.createDocument(session.createDocumentModel("/FV/", "Workspaces", "WorkspaceRoot"));
    session.createDocument(session.createDocumentModel("/FV/Workspaces", "Data", "Workspace"));
    session.createDocument(
        session.createDocumentModel("/FV/Workspaces/Data", "Family", "FVLanguageFamily"));
    session.createDocument(
        session.createDocumentModel("/FV/Workspaces/Data/Family", "Language", "FVLanguage"));
    session.save();
    DocumentModel member = createUserWithPassword("member@firstvoices.com", "Member", "Member",
        "members");
    assertNotNull(member);
    DocumentModel admin = createUserWithPassword("admin@firstvoices.com", "Admin", "Admin",
        "members");
    assertNotNull(member);
  }

  @After
  public void tearDown() {
    session.removeChildren(session.getRootDocument().getRef());
    session.save();
  }

  @Test
  public void testGetTasksForAdminUser() throws LoginException {
    Principal dummyPrincipal = login.login("member@firstvoices.com");
    NuxeoPrincipal currentDummy = ClientLoginModule.getCurrentPrincipal();
    List<String> userGroups = new ArrayList();
    userGroups.add("members");
    currentDummy.setGroups(userGroups);
    Assert.assertTrue(service.getTasksForUser(session, currentDummy).isEmpty());

  }

}
