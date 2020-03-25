package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public interface UnpublishedChangesService {

    /*
        Method that returns true if there are unpublished changes on a document.
        Returns false otherwise.
     */
    boolean checkUnpublishedChanges(CoreSession session, DocumentModel document);

}
