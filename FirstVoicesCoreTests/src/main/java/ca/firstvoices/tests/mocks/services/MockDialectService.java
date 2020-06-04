package ca.firstvoices.tests.mocks.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public interface MockDialectService {

  /**
   * Generates a dialect with random data if one with the same name does not exist
   * @param maxEntries - max number of dialect entries to create (words, phrases, songs, audio files)
   * @param name - the name of the dialect
   * @return generated dialect
   */
  DocumentModel generateMockRandomDialect(CoreSession session, int maxEntries, String name);

  /**
   * Generates a dialect with demo data if one with the same name does not exist
   * @param maxEntries - max number of dialect entries to create (words, phrases, songs, audio files)
   * @param name - the name of the dialect
   * @return generated dialect
   */
  DocumentModel generateMockDemoDialect(CoreSession session, int maxEntries, String name);

  /**
   * Ensure there is logic in place to remove dialects only from Test areas
   * @param name
   */
  void removeMockDialect(String name);

  /**
   * Should remove all test dialects completely
   * Ensure there is logic in place to remove dialects only from Test areas
   */
  void removeMockDialects();
}
