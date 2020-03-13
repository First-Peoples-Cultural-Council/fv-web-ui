package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.DocumentModel;

public abstract class AbstractService {
    public DocumentModel getDialect(DocumentModel doc) {
        if ("FVDialect".equals(doc.getType())) {
            return doc; // doc is dialect
        }
        DocumentModel parent = doc.getCoreSession().getParentDocument(doc.getRef());
        while (parent != null && !"FVDialect".equals(parent.getType())) {
            parent = doc.getCoreSession().getParentDocument(parent.getRef());
        }
        if (parent == null) {
            return null;
        }
        return parent;
    }
}