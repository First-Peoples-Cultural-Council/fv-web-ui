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

package ca.firstvoices.security.tests;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import ca.firstvoices.utils.CustomSecurityConstants;
import javax.inject.Inject;
import javax.security.auth.login.LoginException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.PartialDeploy;
import org.nuxeo.runtime.test.runner.TargetExtensions;


@RunWith(FeaturesRunner.class)
@Features({PlatformFeature.class, AutomationFeature.class})
@Deploy({"FirstVoicesSecurity.tests:userservice-config.xml",
    "FVUserRegistration:OSGI-INF/extensions/ca.firstvoices.auth.xml",
    "FVUserRegistration:OSGI-INF/extensions/ca.firstvoices.user.xml",
    "org.nuxeo.ecm.user.registration",
    "org.nuxeo.ecm.user.registration.web:OSGI-INF/user-registration-contrib.xml",
    "org.nuxeo.ecm.user.invite",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.securitypolicies.groups.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.securitypolicies.lifecycle.xml"})
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})
public class TestSecurityPolicies extends AbstractFVTest {

  @Inject
  protected CoreSession session;

  @Inject
  protected CoreFeature coreFeature;

  @Inject
  protected UserManager userManager;

  @Inject
  protected AutomationService automationService;

  DocumentModel domain;
  DocumentModel sectionsRoot;

  DocumentModel dialectSencoten;
  DocumentModel dialectDene;

  DocumentModel dialectSencotenDictionary;
  DocumentModel dialectDeneDictionary;

  NuxeoPrincipal DENE_ADMIN_USER;
  NuxeoPrincipal DENE_RECORDER_USER;
  NuxeoPrincipal DENE_MEMBER_USER;

  NuxeoPrincipal SENCOTEN_ADMIN_USER;
  NuxeoPrincipal SENCOTEN_RECORDER_USER;
  NuxeoPrincipal SENCOTEN_MEMBER_USER;

  @Before
  public void setUp() throws Exception {

    session.removeChildren(session.getRootDocument().getRef());

    domain = session.createDocument(session.createDocumentModel("/", "FV", "Domain"));

    session.createDocument(session.createDocumentModel("/FV/", "Workspaces", "WorkspaceRoot"));
    session.createDocument(session.createDocumentModel("/FV/Workspaces", "Data", "Workspace"));
    session.createDocument(
        session.createDocumentModel("/FV/Workspaces/Data", "Family", "FVLanguageFamily"));
    session.createDocument(
        session.createDocumentModel("/FV/Workspaces/Data/Family", "Language", "FVLanguage"));

    session.save();

    // Get sections document (automatically created)
    DocumentModelList docs = session
        .query("SELECT * FROM Document WHERE ecm:path = '/FV/sections'");
    sectionsRoot = docs.get(0);

    // Set default permissions

    // Remove members READ permission from repository
    DocumentModel repo = session.getDocument(domain.getParentRef());
    ACP acp = repo.getACP();
    ACL aclTest = acp.getACL("local");
    aclTest.removeByUsername("members");
    acp.addACL(aclTest);
    repo.setACP(acp, true);

    // Set permissions
    setACL(domain, "administrators", SecurityConstants.EVERYTHING);
    setACL(sectionsRoot, "Guest", SecurityConstants.READ);
    setACL(sectionsRoot, "members", SecurityConstants.READ);

    dialectSencoten = session.createDocument(session
        .createDocumentModel("/FV/Workspaces/Data/Family/Language", "Senćoŧen", "FVDialect"));
    dialectSencoten = session.saveDocument(dialectSencoten);

    dialectSencotenDictionary = session.createDocument(session
        .createDocumentModel("/FV/Workspaces/Data/Family/Language/Senćoŧen", "Dictionary",
            "FVDictionary"));
    dialectSencotenDictionary = session.saveDocument(dialectSencotenDictionary);

    assertNotNull(dialectSencoten);

    dialectDene = session.createDocument(
        session.createDocumentModel("/FV/Workspaces/Data/Family/Language", "Dene", "FVDialect"));
    dialectDene = session.saveDocument(dialectDene);

    dialectDeneDictionary = session.createDocument(session
        .createDocumentModel("/FV/Workspaces/Data/Family/Language/Dene", "Dictionary",
            "FVDictionary"));
    dialectDeneDictionary = session.saveDocument(dialectDeneDictionary);

    assertNotNull(dialectDene);

    // User operation to create groups for both dialects
    OperationContext ctx = new OperationContext(session);
    ctx.setInput(dialectSencoten);
    automationService.run(ctx, "FVDialectRegularDocumentPermissions");

    ctx.setInput(dialectDene);
    automationService.run(ctx, "FVDialectRegularDocumentPermissions");

    // Create users
    DocumentModel DENE_ADMIN = createUserWithPassword("DENE_ADMIN@.", "", "",
        "dene_language_administrators");
    DocumentModel DENE_RECORDER = createUserWithPassword("DENE_RECORDER@.", "", "",
        "dene_recorders");
    DocumentModel DENE_MEMBER = createUserWithPassword("DENE_MEMBER@.", "", "", "dene_members");

    DocumentModel SENCOTEN_ADMIN = createUserWithPassword("SENCOTEN_ADMIN@.", "", "",
        "senćoŧen_language_administrators");
    DocumentModel SENCOTEN_RECORDER = createUserWithPassword("SENCOTEN_RECORDER@.", "", "",
        "senćoŧen_recorders");
    DocumentModel SENCOTEN_MEMBER = createUserWithPassword("SENCOTEN_MEMBER@.", "", "",
        "senćoŧen_members");

    DENE_ADMIN_USER = userManager.getPrincipal("DENE_ADMIN@.");
    DENE_RECORDER_USER = userManager.getPrincipal("DENE_RECORDER@.");
    DENE_MEMBER_USER = userManager.getPrincipal("DENE_MEMBER@.");

    SENCOTEN_ADMIN_USER = userManager.getPrincipal("SENCOTEN_ADMIN@.");
    SENCOTEN_RECORDER_USER = userManager.getPrincipal("DENE_RECORDER@.");
    SENCOTEN_MEMBER_USER = userManager.getPrincipal("SENCOTEN_MEMBER@.");

    session.save();
  }

  @After
  public void cleanup() {
    session.removeChildren(session.getRootDocument().getRef());
    session.save();
  }

  @Test
  public void testGuestAccess() {
    NuxeoPrincipal guest = userManager.getPrincipal("Guest");
    assertNotNull(guest);

    // Guest SHOULD NOT be able to access both dialects
    assertFalse(session.hasPermission(guest, dialectSencoten.getRef(), SecurityConstants.READ));
    assertFalse(session.hasPermission(guest, dialectDene.getRef(), SecurityConstants.READ));

    // Guest SHOULD be able to read section root
    assertTrue(session.hasPermission(guest, sectionsRoot.getRef(), SecurityConstants.READ));

    // Guest SHOULD NOT be able to write to sections root
    assertFalse(session.hasPermission(guest, sectionsRoot.getRef(), SecurityConstants.WRITE));
  }

  @Test
  public void testSiteMembersAccess() {
    NuxeoPrincipal member = userManager.getPrincipal("SITE_MEMBER");
    assertNotNull(member);

    // Site member SHOULD NOT be able to access both dialects
    assertFalse(session.hasPermission(member, dialectSencoten.getRef(), SecurityConstants.READ));
    assertFalse(session.hasPermission(member, dialectDene.getRef(), SecurityConstants.READ));

    // Site member SHOULD be able to read section root
    assertTrue(session.hasPermission(member, sectionsRoot.getRef(), SecurityConstants.READ));

    // Site member SHOULD NOT be able to write to sections root
    assertFalse(session.hasPermission(member, sectionsRoot.getRef(), SecurityConstants.WRITE));
  }

  @Test
  public void testSuperAdminAccess() {
    // Get Super Admin user
    NuxeoPrincipal FPCC_ADMIN = userManager.getPrincipal("FPCC_ADMIN");
    assertNotNull(FPCC_ADMIN);

    // test EVERYTHING access on dialect 1 and 2
    assertTrue(
        session.hasPermission(FPCC_ADMIN, dialectSencoten.getRef(), SecurityConstants.EVERYTHING));
    assertTrue(
        session.hasPermission(FPCC_ADMIN, dialectDene.getRef(), SecurityConstants.EVERYTHING));
  }

  @Test
  public void testLanguageAdminAccess() {
    // test language admins for access to their own dialects - should have EVERYTHING access
    assertTrue(
        session.hasPermission(DENE_ADMIN_USER, dialectDene.getRef(), SecurityConstants.EVERYTHING));
    assertTrue(session.hasPermission(SENCOTEN_ADMIN_USER, dialectSencoten.getRef(),
        SecurityConstants.EVERYTHING));

    // test language admins for access on each others dialect (should not have EVERYTHING access)
    assertFalse(session
        .hasPermission(DENE_ADMIN_USER, dialectSencoten.getRef(), SecurityConstants.EVERYTHING));
    assertFalse(session
        .hasPermission(SENCOTEN_ADMIN_USER, dialectDene.getRef(), SecurityConstants.EVERYTHING));

    // test language admins for READ access on each others dialect (should not have READ access)
    assertFalse(
        session.hasPermission(DENE_ADMIN_USER, dialectSencoten.getRef(), SecurityConstants.READ));
    assertFalse(
        session.hasPermission(SENCOTEN_ADMIN_USER, dialectDene.getRef(), SecurityConstants.READ));

    // Delete users
    userManager.deleteUser("DENE_ADMIN@.");
    userManager.deleteUser("SENCOTEN_ADMIN@.");
  }

  @Test
  public void testRecorderAccess() throws LoginException {
    // Recorders SHOULD NOT have EVERYTHING access
    assertFalse(session
        .hasPermission(DENE_RECORDER_USER, dialectDene.getRef(), SecurityConstants.EVERYTHING));
    assertFalse(session
        .hasPermission(userManager.getPrincipal("SENCOTEN_RECORDER@."), dialectSencoten.getRef(),
            SecurityConstants.EVERYTHING));

    // Recorders SHOULD have Record access on their own dialects
    assertTrue(session
        .hasPermission(DENE_RECORDER_USER, dialectDene.getRef(), CustomSecurityConstants.RECORD));
    assertTrue(session
        .hasPermission(userManager.getPrincipal("SENCOTEN_RECORDER@."), dialectSencoten.getRef(),
            CustomSecurityConstants.RECORD));

    // Recorders SHOULD NOT have Record or Read access on other dialect
    assertFalse(session
        .hasPermission(DENE_RECORDER_USER, dialectSencoten.getRef(), SecurityConstants.WRITE));
    assertFalse(session
        .hasPermission(userManager.getPrincipal("SENCOTEN_RECORDER@."), dialectDene.getRef(),
            SecurityConstants.READ));

    // Actions

    // Recorders SHOULD be able to create children under a dictionary
    assertTrue(session
        .hasPermission(userManager.getPrincipal("DENE_RECORDER@."), dialectDeneDictionary.getRef(),
            SecurityConstants.ADD_CHILDREN));
    assertFalse(session
        .hasPermission(userManager.getPrincipal("SENCOTEN_RECORDER@."), dialectDene.getRef(),
            SecurityConstants.READ));

    // Recorders SHOULD NOT be able to create children under someone else's dictionary
    assertFalse(session.hasPermission(userManager.getPrincipal("DENE_RECORDER@."),
        dialectSencotenDictionary.getRef(), SecurityConstants.ADD_CHILDREN));
    assertFalse(session
        .hasPermission(userManager.getPrincipal("SENCOTEN_RECORDER@."), dialectDene.getRef(),
            SecurityConstants.READ));

    // Delete users
    userManager.deleteUser("DENE_RECORDER@.");
    userManager.deleteUser("SENCOTEN_RECORDER@.");
  }

  @Test
  public void testDialectMemberAccess() throws LoginException {

    // Create two dialect members

    // Members SHOULD NOT have EVERYTHING access
    assertFalse(session
        .hasPermission(userManager.getPrincipal("DENE_MEMBER@."), dialectDene.getRef(),
            SecurityConstants.EVERYTHING));
    assertFalse(session
        .hasPermission(userManager.getPrincipal("SENCOTEN_MEMBER@."), dialectSencoten.getRef(),
            SecurityConstants.EVERYTHING));

    // Test Members READ access based on dialect state

    // Members SHOULD NOT have READ access in the NEW state
    assertFalse(session
        .hasPermission(userManager.getPrincipal("DENE_MEMBER@."), dialectDene.getRef(),
            SecurityConstants.READ));

    // Members SHOULD NOT have READ access in the DISABLED state
    dialectDene.followTransition("Disable");
    assertFalse(session
        .hasPermission(userManager.getPrincipal("DENE_MEMBER@."), dialectDene.getRef(),
            SecurityConstants.READ));

    // Members SHOULD have READ access in the ENABLED state
    dialectDene.followTransition("Enable");
    assertTrue(session
        .hasPermission(userManager.getPrincipal("DENE_MEMBER@."), dialectDene.getRef(),
            SecurityConstants.READ));

    // But not members of a different group
    assertFalse(session
        .hasPermission(userManager.getPrincipal("SENCOTEN_MEMBER@."), dialectDene.getRef(),
            SecurityConstants.READ));

    // Members SHOULD have READ access in the PUBLISHED state
    dialectDene.followTransition("Publish");
    assertTrue(session
        .hasPermission(userManager.getPrincipal("DENE_MEMBER@."), dialectDene.getRef(),
            SecurityConstants.READ));

    // But not members of a different group
    assertFalse(session
        .hasPermission(userManager.getPrincipal("SENCOTEN_MEMBER@."), dialectDene.getRef(),
            SecurityConstants.READ));

    // Delete users
    userManager.deleteUser("DENE_MEMBER@.");
    userManager.deleteUser("SENCOTEN_MEMBER@.");
  }
}
