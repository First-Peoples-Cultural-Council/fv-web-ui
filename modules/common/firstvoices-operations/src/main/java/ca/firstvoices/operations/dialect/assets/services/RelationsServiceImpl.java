package ca.firstvoices.operations.dialect.assets.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

/**
 * @author david
 */
public class RelationsServiceImpl implements RelationsService {

  @Override
  public DocumentModelList getRelations(CoreSession session, DocumentModel doc) {

    String query = "SELECT * FROM Document WHERE fv:related_assets = '" + doc.getId()
        + "' AND ecm:isTrashed = 0 AND ecm:isVersion = 0 AND ecm:isProxy = 0";

    if (doc.isProxy()) {
      query = "SELECT * FROM Document WHERE fvproxy:proxied_related_assets/* = '" + doc.getId()
          + "' AND ecm:isTrashed = 0 AND ecm:isVersion = 0";
    }

    return session.query(query);
  }

  @Override
  public DocumentModelList getRelations(CoreSession session, DocumentModel doc, String type) {

    String query =
        "SELECT * FROM Document WHERE ecm:primaryType = '" + type + "' AND fv:related_assets = '"
            + doc.getId() + "' AND ecm:isTrashed = 0 AND ecm:isVersion = 0 AND ecm:isProxy = 0";

    if (doc.isProxy()) {
      query = "SELECT * FROM Document WHERE ecm:primaryType = '" + type + "' AND "
          + "fvproxy:proxied_related_assets/* = '" + doc.getId() + "' AND ecm:isTrashed = 0 AND "
          + "ecm:isVersion = 0";
    }

    return session.query(query);
  }
}
