package services;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
public abstract class AbstractFirstVoicesOperationsService {

  FirstVoicesPublisherService publisherService = Framework
      .getService(FirstVoicesPublisherService.class);

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

  protected Boolean isPublished(DocumentModel doc) {
    return doc.getLifeCyclePolicy().equals("fv-lifecycle") && doc.getCurrentLifeCycleState()
        .equals("Published");
  }

  protected DocumentModel publishDocumentIfDialectPublished(CoreSession session,
      DocumentModel doc) {
    DocumentModel dialect = getDialect(session, doc);

    if (isPublished(dialect)) {
      if (isPublished(doc)) {
        publisherService.republish(doc);
      } else {
        publisherService.publish(doc);
      }
    }
    return session.saveDocument(doc);
  }
}
