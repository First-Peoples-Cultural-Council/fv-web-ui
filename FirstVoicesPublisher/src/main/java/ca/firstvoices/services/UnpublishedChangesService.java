package ca.firstvoices.services;

import org.javers.core.diff.Diff;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public interface UnpublishedChangesService {

    /*
        Method that returns true if there are unpublished changes on a document.
        Returns false otherwise.
     */
    boolean checkUnpublishedChanges(CoreSession session, DocumentModel document);

    /*
        Method that returns the changes between a document and it's unpublished version
        Return nothing otherwise
     */
    Diff getUnpublishedChanges(CoreSession session, DocumentModel document);

}
