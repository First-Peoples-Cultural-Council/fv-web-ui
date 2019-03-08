package ca.firstvoices.services;

import java.util.ArrayList;
import java.util.Arrays;

import org.nuxeo.ecm.core.api.DocumentModel;

public abstract class AbstractEditorService {

    protected DocumentModel getDialect(DocumentModel doc) {
        DocumentModel parent = doc;
        while (parent != null && !"Root".equals(parent.getType()) && !"FVDialect".equals(parent.getType())) {
            parent = doc.getCoreSession().getDocument(parent.getParentRef());
        }

        if( "Root".equals(parent.getType()) ) {
            return( null );
        }
        else {
            return parent;
        }

    }
}
