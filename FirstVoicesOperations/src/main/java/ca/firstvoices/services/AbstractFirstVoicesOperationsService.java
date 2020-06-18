package ca.firstvoices.services;

import static ca.firstvoices.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.schemas.DomainTypesConstants.FV_DIALECT;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

/**
 * @author david
 */
public abstract class AbstractFirstVoicesOperationsService {

  protected DocumentModel getDialect(CoreSession session, DocumentModel doc) {
    if (FV_DIALECT.equals(doc.getType())) {
      return doc;
    }
    DocumentModel parent = session.getParentDocument(doc.getRef());
    while (parent != null && !FV_DIALECT.equals(parent.getType())) {
      parent = session.getParentDocument(parent.getRef());
    }
    return parent;
  }

  protected boolean isPublished(DocumentModel doc) {
    return doc.getLifeCyclePolicy().equals("fv-lifecycle") && doc.getCurrentLifeCycleState()
        .equals(PUBLISHED_STATE);
  }

}
