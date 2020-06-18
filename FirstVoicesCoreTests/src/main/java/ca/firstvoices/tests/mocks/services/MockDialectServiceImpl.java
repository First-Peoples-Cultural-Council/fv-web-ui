package ca.firstvoices.tests.mocks.services;

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
    DocumentModel dialect = generateEmptyDialect(session, name);

    return dialect;
  }

  @Override
  public DocumentModel generateMockDemoDialect(CoreSession session, int maxEntries, String name) {
    // See other services, operations and InitialDatabaseSetup for inspiration
    // Feel free to create other services, utils and methods as needed
    // for reusability (for example to create a word, etc.)
    DocumentModel dialect = generateEmptyDialect(session, name);

    return dialect;
  }

  @Override
  public void removeMockDialect(String name) {

  }

  @Override
  public void removeMockDialects() {

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
    // ie only /FV/Workspaces/Data/TestLangFam or /FV/Workspaces/ exists?

    String testPath = "/FV/Workspaces/Data/TestLangFam/TestLang/";
    //if path exists, do nothing
    if (!session.exists(new PathRef(testPath))) {

      // if FV domain does not exist, generate FV/Workspaces/Data
      if (!session.exists(new PathRef("/FV"))) {
        DocumentModel domain = createDocument(session,
            session.createDocumentModel("/", "FV", "Domain"));
        DocumentModel workspaceRoot = createDocument(session,
            session.createDocumentModel("/FV", "Workspaces", "WorkspaceRoot"));
        DocumentModel workspace = createDocument(session,
            session.createDocumentModel("/FV/Workspaces", "Data", "Workspace"));
      }

      if (session.exists(new PathRef("FV/Workspaces/Data/"))) {
        DocumentModel languageFamily = createDocument(session,
            session
                .createDocumentModel("/FV/Workspaces/Data", "TestLangFam", "FVLanguageFamily"));
        DocumentModel language = createDocument(session,
            session.createDocumentModel("/FV/Workspaces/Data/TestLangFam", "TestLang",
                "FVLanguage"));
      } else {
        throw new NuxeoException("Document tree FV/Workspaces/Data/ must exist");
      }

    }

  }

  private DocumentModel generateEmptyDialect(CoreSession session, String name) {
    //In the current session, in the /FV/Workspaces/Data/TestLangFam/TestLang/ directory
    //create an empty dialect with all necessary children

    generateDialectTree(session);

    DocumentModel dialect = createDocument(session,
        session
            .createDocumentModel("/FV/Workspaces/Data/TestLangFam/TestLang/", name, "FVDialect"));
    DocumentModel dictionary = createDocument(session,
        session.createDocumentModel(dialect.getPathAsString(), "Dictionary", "FVDictionary"));
    DocumentModel alphabet = createDocument(session,
        session.createDocumentModel(dialect.getPathAsString(), "Alphabet", "FVAlphabet"));
    DocumentModel categories = createDocument(session,
        session.createDocumentModel(dialect.getPathAsString(), "Categories", "FVCategories"));

    return dialect;
  }

}
