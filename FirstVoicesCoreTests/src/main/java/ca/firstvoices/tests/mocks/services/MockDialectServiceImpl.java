package ca.firstvoices.tests.mocks.services;

import static ca.firstvoices.tests.mocks.Constants.FV_LANGUAGE;
import static ca.firstvoices.tests.mocks.Constants.FV_LANGUAGE_FAMILY;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.PathRef;

public class MockDialectServiceImpl implements MockDialectService {

  @Override
  public DocumentModel generateMockRandomDialect(CoreSession session, int maxEntries, String name) {
    // See other services, operations and InitialDatabaseSetup for inspiration
    // Feel free to create other services, utils and methods as needed
    // for reusability (for example to create a word, etc.)

    return generateEmptyDialect(session, name);

  }

  @Override
  public DocumentModel generateMockDemoDialect(CoreSession session, int maxEntries, String name) {
    // See other services, operations and InitialDatabaseSetup for inspiration
    // Feel free to create other services, utils and methods as needed
    // for reusability (for example to create a word, etc.)

    return generateEmptyDialect(session, name);

  }

  @Override
  public void removeMockDialect(String name) {
    //To be implemented at a later date.
    throw new UnsupportedOperationException("Remove functions are not implemented yet.");

  }

  @Override
  public void removeMockDialects() {
    //To be implemented at a later date.
    throw new UnsupportedOperationException("Remove functions are not implemented yet.");
  }

  private DocumentModel createDocument(CoreSession session, DocumentModel model) {
    model.setPropertyValue("dc:title", model.getName());
    DocumentModel newDoc = session.createDocument(model);
    session.save();

    return newDoc;
  }

  private void generateDialectTree(CoreSession session) {
    //NOTE: Note entirely satisfied with this method,
    // should I handle more cases such as partially generated trees?
    // ie only /FV/Workspaces/Data/Test or /FV/Workspaces/ exists?

    String testPath = "/FV/Workspaces/Data/Test/Test/";
    //if path exists, do nothing
    if (!session.exists(new PathRef(testPath))) {

      // if FV domain does not exist, generate FV/Workspaces/Data
      if (!session.exists(new PathRef("/FV"))) {
        createDocument(session,
            session.createDocumentModel("/", "FV", "Domain"));
        createDocument(session,
            session.createDocumentModel("/FV", "Workspaces", "WorkspaceRoot"));
        createDocument(session,
            session.createDocumentModel("/FV/Workspaces", "Data", "Workspace"));
      }

      if (session.exists(new PathRef("FV/Workspaces/Data/"))) {
        createDocument(session,
            session
                .createDocumentModel("/FV/Workspaces/Data", "Test", FV_LANGUAGE_FAMILY));
        createDocument(session,
            session.createDocumentModel("/FV/Workspaces/Data/Test", "Test",
                FV_LANGUAGE));
      } else {
        throw new NuxeoException("Document tree FV/Workspaces/Data/ must exist");
      }

    }

  }

  private DocumentModel generateEmptyDialect(CoreSession session, String name) {
    //In the current session, in the /FV/Workspaces/Data/TestLangFam/TestLang/ directory
    //create an empty dialect with all necessary children

    generateDialectTree(session);

    return createDocument(session,
        session
            .createDocumentModel("/FV/Workspaces/Data/Test/Test/", name, "FVDialect"));
  }

}
