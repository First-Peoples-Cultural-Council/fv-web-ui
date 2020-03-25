package ca.firstvoices.operations;

import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import org.junit.Before;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.automation.OperationContext;

import java.util.ArrayList;
import java.util.Arrays;

import static org.junit.Assert.*;

public class InitialDatabaseSetupTest extends AbstractFirstVoicesDataTest {

    // Environment variables for the admin account that will be created.
    private static final String username = System.getenv("CYPRESS_FV_USERNAME");
    private static final String password = System.getenv("CYPRESS_FV_PASSWORD");

    @Before
    public void setUp() throws Exception {
        assertNotNull("Should have a valid session", session);

        createSetup(session);

        assertNotNull("Should have a valid Workspaces Directory",
                createDocument(session, session.createDocumentModel("/FV", "Workspaces", "WorkspaceRoot")));
        assertNotNull("Should have a valid SharedData directory",
                createDocument(session, session.createDocumentModel("/FV/Workspaces", "SharedData", "Workspace")));

        assertNotNull("Should have a valid Workspaces/Data directory",
                createDocument(session, session.createDocumentModel("/FV/Workspaces", "Data", "Workspace")));
        assertNotNull("Should have a valid sections/Data directory",
                createDocument(session, session.createDocumentModel("/FV/sections", "Data", "Section")));

        assertNotNull("Should have a valid Workspaces/SharedData directory",
                createDocument(session, session.createDocumentModel("/FV/Workspaces", "SharedData", "Workspace")));
        assertNotNull("Should have a valid sections/SharedData directory",
                createDocument(session, session.createDocumentModel("/FV/sections", "SharedData", "Section")));
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
        expected = new ArrayList<>(Arrays.asList("language_administrators", "recorders", "recorders_with_approval"));
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

