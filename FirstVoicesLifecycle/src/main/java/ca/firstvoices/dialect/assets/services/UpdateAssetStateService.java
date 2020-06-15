package ca.firstvoices.dialect.assets.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

/**
 * @author david
 */
public interface UpdateAssetStateService {

  DocumentModel enableAsset(CoreSession session, DocumentModel doc);

  DocumentModel disableAsset(CoreSession session, DocumentModel doc);
}
