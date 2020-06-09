package services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

/**
 * @author david
 */
public abstract class AbstractFirstVoicesOperationsService {

  protected DocumentModel getDialect(CoreSession session, DocumentModel doc) {
    if ("FVDialect".equals(doc.getType())) {
      return doc;
    }
    DocumentModel parent = session.getParentDocument(doc.getRef());
    while (parent != null && !"FVDialect".equals(parent.getType())) {
      parent = session.getParentDocument(parent.getRef());
    }
    return parent;
  }

  protected boolean isPublished(DocumentModel doc) {
    return doc.getLifeCyclePolicy().equals("fv-lifecycle") && doc.getCurrentLifeCycleState()
        .equals("Published");
  }

}
