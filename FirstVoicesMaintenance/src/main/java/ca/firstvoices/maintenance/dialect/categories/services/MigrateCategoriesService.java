package ca.firstvoices.maintenance.dialect.categories.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

public interface MigrateCategoriesService {

  public boolean migrateCategoriesTree(CoreSession session, DocumentModel dialect);

  /**
   * @param session
   * @param dialect
   * @param batchSize
   * @return the amount of words that are left to process
   */
  public int migrateWords(CoreSession session, DocumentModel dialect, int batchSize);

  public void publishCategoriesTree(CoreSession session, DocumentModel dialect);

  public String getUniqueCategoriesQuery(String dialectId);

  public DocumentModelList getCategories(CoreSession session, DocumentModel container,
      boolean includeProxies);
}
