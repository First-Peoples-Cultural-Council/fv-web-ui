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

package ca.firstvoices.operations;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import ca.firstvoices.testUtil.FirstVoicesDataFeature;
import ca.firstvoices.tests.mocks.operations.InitialDatabaseSetup;
import java.util.ArrayList;
import java.util.Arrays;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({FirstVoicesDataFeature.class})
@Deploy("FirstVoicesCoreTests:OSGI-INF/dbinit/dbinit-operations.xml")
public class InitialDatabaseSetupTest extends AbstractFirstVoicesDataTest {

  // Environment variables for the admin account that will be created.
  private static final String username = System.getenv("CYPRESS_FV_USERNAME");
  private static final String password = System.getenv("CYPRESS_FV_PASSWORD");

  @Inject
  protected CoreSession session;

  @Before
  public void setUp() throws Exception {
    assertNotNull("Should have a valid session", session);

    createSetup(session);

    assertNotNull("Should have a valid Workspaces Directory",
        createDocument(session, session.createDocumentModel("/FV", "Workspaces", "WorkspaceRoot")));
    assertNotNull("Should have a valid SharedData directory", createDocument(session,
        session.createDocumentModel("/FV/Workspaces", "SharedData", "Workspace")));

    assertNotNull("Should have a valid Workspaces/Data directory", createDocument(session,
        session.createDocumentModel("/FV/Workspaces", "Data", "Workspace")));
    assertNotNull("Should have a valid sections/Data directory",
        createDocument(session, session.createDocumentModel("/FV/sections", "Data", "Section")));

    assertNotNull("Should have a valid Workspaces/SharedData directory", createDocument(session,
        session.createDocumentModel("/FV/Workspaces", "SharedData", "Workspace")));
    assertNotNull("Should have a valid sections/SharedData directory", createDocument(session,
        session.createDocumentModel("/FV/sections", "SharedData", "Section")));
  }

  @Test
  public void initialDatabaseSetup() throws OperationException {
    OperationContext ctx = new OperationContext(session);

        /*
            Check that the directories dont exist
         */
    assertFalse(session.exists(new PathRef("/FV/Workspaces/Site")));
    assertFalse(session.exists(new PathRef("/FV/sections/Site")));

        /*
            Check that the groups don't exist yet
         */
    assertNull(userManager.getGroup("language_administrators"));
    assertNull(userManager.getGroup("recorders"));
    assertNull(userManager.getGroup("recorders_with_approval"));

        /*
            Check that the members group has no subgroups yet
         */
    ArrayList<String> expected = new ArrayList<>();
    assertEquals(expected, userManager.getGroupModel("members").getProperty("group", "subGroups"));

        /*
            Check that the publication targets don't exist yet
         */
    DocumentModel sourceDoc = session.getDocument(new PathRef("/FV/Workspaces/Data"));
    assertNull(sourceDoc.getPropertyValue("publish:sections"));
    sourceDoc = session.getDocument(new PathRef("/FV/Workspaces/SharedData"));
    assertNull(sourceDoc.getPropertyValue("publish:sections"));

        /*
            Check that no admin user exists
         */
    if (username != null && password != null) {
      assertNull(userManager.getUserModel(username));
    }

        /*
            Run the initial setup operation
         */
    automationService.run(ctx, InitialDatabaseSetup.ID);

        /*
            Check that the directories now exist
         */
    assertTrue(session.exists(new PathRef("/FV/Workspaces/Site")));
    assertTrue(session.exists(new PathRef("/FV/sections/Site")));
    assertTrue(session.exists(new PathRef("/FV/Workspaces/Site/Resources")));
    assertTrue(session.exists(new PathRef("/FV/Workspaces/Site/Resources/Pages")));
    assertTrue(session.exists(new PathRef("/FV/Workspaces/SharedData/Shared Categories")));
    assertTrue(session.exists(new PathRef("/FV/Workspaces/SharedData/Shared Links")));
    assertTrue(session.exists(new PathRef("/FV/Workspaces/SharedData/Shared Resources")));

        /*
            Check that the groups now exist
         */
    assertNotNull(userManager.getGroup("language_administrators"));
    assertNotNull(userManager.getGroup("recorders"));
    assertNotNull(userManager.getGroup("recorders_with_approval"));

        /*
            Check that the members group now has the subgroups added
         */
    expected = new ArrayList<>(
        Arrays.asList("language_administrators", "recorders", "recorders_with_approval"));
    assertEquals(expected, userManager.getGroupModel("members").getProperty("group", "subGroups"));

        /*
            Check that the users of the group members and guests have the appropriate permissions
         */
    DocumentModel root = session.getRootDocument();
    DocumentModel sections = session.getDocument(new PathRef("/FV/sections"));
    assertEquals(1, root.getACP().getAccess("members", "Read").value());
    assertEquals(1, sections.getACP().getAccess("Guest", "Read").value());

        /*
            Check that the publication targets exist
         */
    sourceDoc = session.getDocument(new PathRef("/FV/Workspaces/Data"));
    assertNotNull(sourceDoc.getPropertyValue("publish:sections"));
    sourceDoc = session.getDocument(new PathRef("/FV/Workspaces/SharedData"));
    assertNotNull(sourceDoc.getPropertyValue("publish:sections"));
    sourceDoc = session.getDocument(new PathRef("/FV/Workspaces/Site"));
    assertNotNull(sourceDoc.getPropertyValue("publish:sections"));

        /*
            Check that the admin user now exists
         */
    if (username != null && password != null) {
      assertNotNull(userManager.getUserModel(username));
    }

  }
}

