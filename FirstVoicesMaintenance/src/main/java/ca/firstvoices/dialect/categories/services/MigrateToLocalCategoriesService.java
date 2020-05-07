package ca.firstvoices.dialect.categories.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public interface MigrateToLocalCategoriesService {

  public boolean migrateCategoriesTree(CoreSession session, DocumentModel dialect);

  /**
   *
   * @param session
   * @param dialect
   * @param batchSize
   * @return true if there is more to migrate, false otherwise
   */
  public boolean migrateWords(CoreSession session, DocumentModel dialect, int batchSize);
}
