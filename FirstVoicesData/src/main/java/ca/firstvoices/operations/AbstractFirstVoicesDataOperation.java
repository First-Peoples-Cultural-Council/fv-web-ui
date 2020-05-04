package ca.firstvoices.operations;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.PathRef;

/**
 * @author david
 */
public class AbstractFirstVoicesDataOperation {

  protected DocumentModel getDialect(CoreSession session, DocumentModel doc) {
    if ("FVDialect".equals(doc.getType())) {
      return doc; // doc is dialect
    }
    DocumentModel parent = session.getDocument(doc.getParentRef());
    while (parent != null && !"FVDialect".equals(parent.getType())) {
      parent = session.getDocument(parent.getParentRef());
    }
    return parent;
  }

  protected DocumentModel getAlphabet(CoreSession session, DocumentModel doc) {
    if ("FVAlphabet".equals(doc.getType())) {
      return doc;
    }
    DocumentModel dialect = getDialect(session, doc);
    if (dialect == null) {
      return null;
    }
    return session.getDocument(new PathRef(dialect.getPathAsString() + "/Alphabet"));
  }

  protected DocumentModelList getCharacters(CoreSession session, DocumentModel doc) {
    DocumentModel alphabet = getAlphabet(session, doc);
    return session.getChildren(alphabet.getRef());
  }

}
