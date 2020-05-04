package ca.firstvoices.listeners;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;

public abstract class AbstractFirstVoicesDataListener implements EventListener {

    protected DocumentModel getDialect(DocumentModel doc) {
        CoreSession session = doc.getCoreSession();
        if ("FVDialect".equals(doc.getType())) {
            return doc; // doc is dialect
        }
        DocumentModel parent = session.getDocument(doc.getParentRef());
        while (parent != null && !"FVDialect".equals(parent.getType())) {
            parent = session.getDocument(parent.getParentRef());
        }
        return parent;
    }

    protected DocumentModel getAlphabet(DocumentModel doc) {
        if("FVAlphabet".equals(doc.getType())) {
            return doc;
        }
        DocumentModel dialect = getDialect(doc);
        if (dialect == null) {
            return null;
        }
        return doc.getCoreSession().getDocument(new PathRef(dialect.getPathAsString() + "/Alphabet"));
    }

    protected DocumentModelList getCharacters(DocumentModel doc) {
        DocumentModel alphabet = getAlphabet(doc);
        return doc.getCoreSession().getChildren(alphabet.getRef());
    }

    protected void rollBackEvent(Event event) {
        event.markBubbleException();
        event.markRollBack();
    }
}
