package ca.firstvoices.editors.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;

public interface DraftEditorService
{
    public void putUUIDInfo(CoreSession session, DocumentModel doc, String key, String value );
    public String getUUID( DocumentModel doc, String key );
    public void removeUUIDInfo(DocumentModel liveDoc, String referenceKey );
    public DocumentModel editDraftForDocument( DocumentModel doc );
    public DocumentModel publishDraftDocument( DocumentModel draftDoc );
    public void saveEditedDraftDocument( DocumentModel draftDoc );
    // public boolean canEditDraftDocument( DocumentModel doc ); // dont use it until verified to work correctly
    public DocumentRef getDraftDocumentRefIfExists(DocumentModel liveDoc);
    public boolean releaseTimedOutLock( DocumentModel doc );
    public DocumentModel terminateDraftEditSession( DocumentModel doc );
}
