package ca.firstvoices.tests.mocks.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.PathRef;

public interface MockDialectService {

  /**
   * Generates a dialect with random data if one with the same name does not exist
   *
   * @param maxEntries - max number of dialect entries to create (words, phrases, songs, audio
   *                   files)
   * @return generated dialect
   */
  DocumentModel generateMockRandomDialect(CoreSession session, int maxEntries);

  /**
   * Generates a dialect with demo data if one with the same name does not exist
   *
   * @param maxEntries - max number of dialect entries to create (words, phrases, songs, audio
   *                   files)
   * @return generated dialect
   */
  DocumentModel generateMockDemoDialect(CoreSession session, int maxEntries, String name);

  /**
   * Ensure there is logic in place to remove dialects only from Test areas
   *
   * @param path - pathRef of the dialect to be deleted
   */
  void removeMockDialect(CoreSession session, PathRef path);

  /**
   * Should remove all test dialects completely Ensure there is logic in place to remove dialects
   * only from Test areas
   */
  void removeMockDialects(CoreSession session);
}
