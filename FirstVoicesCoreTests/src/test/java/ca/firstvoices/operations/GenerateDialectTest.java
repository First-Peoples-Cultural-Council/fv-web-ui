package ca.firstvoices.operations;

import ca.firstvoices.testUtil.AbstractFirstVoicesCoreTestsTest;
import ca.firstvoices.tests.mocks.operations.GenerateDialect;
import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.PathRef;

/**
 * @author bronson
 */

public class GenerateDialectTest extends AbstractFirstVoicesCoreTestsTest {

  @Test
  public void generateEmptyDialectTreeDoesntExist() throws OperationException {
    startFresh(session);
    OperationContext ctx = new OperationContext(session);

    automationService.run(ctx, GenerateDialect.ID);

    Assert.assertTrue(
        session.exists(new PathRef("/FV/Workspaces/Data/TestLangFam/TestLang/TestDialect1")));
  }

  @Test
  public void generateEmptyDialectTreeExists() throws OperationException {
    startFresh(session);

    DocumentModel domain = createDocument(session,
        session.createDocumentModel("/", "FV", "Domain"));
    DocumentModel workspaceRoot = createDocument(session,
        session.createDocumentModel("/FV", "Workspaces", "WorkspaceRoot"));
    DocumentModel workspace = createDocument(session,
        session.createDocumentModel("/FV/Workspaces", "Data", "Workspace"));
    DocumentModel languageFamily = createDocument(session,
        session
            .createDocumentModel("/FV/Workspaces/Data", "TestLangFam", "FVLanguageFamily"));
    DocumentModel language = createDocument(session,
        session.createDocumentModel("/FV/Workspaces/Data/TestLangFam", "TestLang",
            "FVLanguage"));

    OperationContext ctx = new OperationContext(session);

    automationService.run(ctx, GenerateDialect.ID);

    Assert.assertTrue(
        session.exists(new PathRef("/FV/Workspaces/Data/TestLangFam/TestLang/TestDialect1")));
  }


}
