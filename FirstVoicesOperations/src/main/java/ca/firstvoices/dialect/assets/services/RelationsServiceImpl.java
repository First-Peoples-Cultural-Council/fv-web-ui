package ca.firstvoices.dialect.assets.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

/**
 * @author david
 */
public class RelationsServiceImpl implements RelationsService {

  @Override
  public DocumentModelList getRelations(CoreSession session, DocumentModel doc) {

    String query = "SELECT * FROM Document WHERE " + doc.getId()
        + " IN fv:related_assets AND ecm:isTrashed = 0";

    return session.query(query);
  }
}
