package ca.firstvoices.tests.mocks.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public class MockDialectServiceImpl implements MockDialectService {

  @Override
  public DocumentModel generateMockRandomDialect(CoreSession session, int maxEntries, String name) {
    // See other services, operations and InitialDatabaseSetup for inspiration
    // Feel free to create other services, utils and methods as needed for reusability (for example to create a word, etc.)
    return null;
  }

  @Override
  public DocumentModel generateMockDemoDialect(CoreSession session, int maxEntries, String name) {
    // See other services, operations and InitialDatabaseSetup for inspiration
    // Feel free to create other services, utils and methods as needed for reusability (for example to create a word, etc.)
    return null;
  }

  @Override
  public void removeMockDialect(String name) {

  }

  @Override
  public void removeMockDialects() {

  }
}
