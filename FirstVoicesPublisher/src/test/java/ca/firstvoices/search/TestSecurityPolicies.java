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

package ca.firstvoices.search;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.security.tests.AbstractFVTest;
import javax.inject.Inject;
import javax.security.auth.login.LoginContext;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CloseableCoreSession;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.PartialDeploy;
import org.nuxeo.runtime.test.runner.TargetExtensions;

@RunWith(FeaturesRunner.class)
@Features({PlatformFeature.class})
@Deploy({"FirstVoicesNuxeoPublisher", "FirstVoicesSecurity",
    "org.nuxeo.ecm.platform.publisher.core",
    "FirstVoicesNuxeoPublisher.tests:OSGI-INF/extensions/fv-publisher-finder-contrib-test.xml",
    "FVUserRegistration:OSGI-INF/extensions/ca.firstvoices.user.xml",
    "org.nuxeo.ecm.user.registration",
    "org.nuxeo.ecm.user.registration.web:OSGI-INF/user-registration-contrib.xml",
    "org.nuxeo.ecm.user.invite"})
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentTemplate.class})
public class TestSecurityPolicies extends AbstractFVTest {

  @Inject
  protected CoreSession session;

  @Inject
  protected UserManager userManager;

  @Inject
  protected FirstVoicesPublisherService publisherService;

  @Inject
  protected PublisherService publisher;

  DocumentModel wordDoc;

  DocumentModel dialectDoc;

  @Before
  public void setUp() throws Exception {
    session.removeChildren(session.getRootDocument().getRef());
    session.save();
    session.createDocument(session.createDocumentModel("/", "FV", "Domain"));
    session.createDocument(session.createDocumentModel("/FV", "Workspace", "WorkspaceRoot"));
    session.save();
    session.createDocument(session.createDocumentModel("/FV", "sections", "SectionRoot"));
    session.save();

    session.createDocument(
        session.createDocumentModel("/FV/Workspaces/Data", "Family", "FVLanguageFamily"));
    session.createDocument(
        session.createDocumentModel("/FV/Workspaces/Data/Family", "Language", "FVLanguage"));

    dialectDoc = session.createDocument(
        session.createDocumentModel("/FV/Workspaces/Data/Family/Language", "Dialect", "FVDialect"));
    dialectDoc = session.saveDocument(dialectDoc);
    session.createDocument(session
        .createDocumentModel("/FV/Workspaces/Data/Family/Language/Dialect/Categories", "Category",
            "FVCategory"));
    session.createDocument(session
        .createDocumentModel("/FV/Workspaces/Data/Family/Language/Dialect/Categories/Category",
            "SubCategory", "FVCategory"));

    wordDoc = session.createDocument(session
        .createDocumentModel("/FV/Workspaces/Data/Family/Language/Dialect/Dictionary", "NewWord",
            "FVWord"));
    wordDoc = session.saveDocument(wordDoc);
    wordDoc.setPropertyValue("dc:title", "Test");
    wordDoc = session.saveDocument(wordDoc);
    setACL(wordDoc, "members", SecurityConstants.EVERYTHING);
    session.save();
    assertNotNull(wordDoc);

  }

  @Test
  @Ignore
  public void testNonRecordersSecurityPolicy() throws Exception {
    // Users who aren't at least recorders should be denied access documents with New or
    // Disabled state
    assertEquals("New", wordDoc.getCurrentLifeCycleState());
    DocumentModelList searchResults = session.query(
        "SELECT * FROM Document WHERE ecm:path STARTSWITH '/FV/Workspaces/Data/' AND dc:title = "
            + "'Test'");
    assertEquals(1, searchResults.size());

    // Log in as a non recorder
    DocumentModel nonRecorderTestUser = createUserWithPassword("test@test.com", "Test", "X",
        "members");
    assertNotNull(nonRecorderTestUser);

    LoginContext loginCtx = Framework.loginAsUser("test@test.com");
    try (CloseableCoreSession userSession = CoreInstance
        .openCoreSession(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            Framework.getService(UserManager.class).getPrincipal("test@test.com"))) {
      searchResults = userSession.query(
          "SELECT * FROM Document WHERE ecm:path STARTSWITH '/FV/sections/Data/' AND dc:title = "
              + "'Test'");
      assertEquals(0, searchResults.size());

    } finally {
      loginCtx.logout();
    }
    // LOg in as a recorder
    createGroup("recorders");

    DocumentModel recorderTestUser = createUserWithPassword("tes2t@test.com", "Test", "X",
        "recorders", "members");
    assertNotNull(recorderTestUser);

    loginCtx = Framework.loginAsUser("test2@test.com");
    try (CloseableCoreSession userSession = CoreInstance
        .openCoreSession(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            Framework.getService(UserManager.class).getPrincipal("test@test.com"))) {
      searchResults = userSession.query(
          "SELECT * FROM Document WHERE ecm:path STARTSWITH '/FV/sections/Data/' AND dc:title = "
              + "'Test'");
      assertEquals(0, searchResults.size());

    } finally {
      loginCtx.logout();
    }

    publisherService.publish(dialectDoc);
    publisherService.publish(wordDoc);
    session.save();
    DocumentModel proxyWord = session.getProxies(wordDoc.getRef(), null).get(0);
    assertNotNull(proxyWord);
    // test that the word is published in /FV/sections/Data
    assertEquals("/FV/sections/Data/Family/Language/Dialect/Dictionary/NewWord",
        proxyWord.getPathAsString());

    wordDoc = session.getDocument(wordDoc.getRef());
    assertEquals("Published", wordDoc.getCurrentLifeCycleState());
    searchResults = session.query(
        "SELECT * FROM Document WHERE ecm:path STARTSWITH '/FV/Workspaces/Data/' AND dc:title = "
            + "'Test'");
    assertEquals(1, searchResults.size());

  }

}
