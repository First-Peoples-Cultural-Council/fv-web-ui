package ca.firstvoices.dialect.assets.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

/**
 * @author david
 */
public interface RelationsService {
  DocumentModelList getRelations(CoreSession session, DocumentModel doc);

}
