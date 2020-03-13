package ca.firstvoices.document.listeners;

import ca.firstvoices.document.services.CleanupCharactersService;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

public class DocumentListener implements EventListener {

    protected CleanupCharactersService cleanupCharactersService = Framework.getService(CleanupCharactersService.class);

    @Override
    public void handleEvent(Event event) {
        EventContext ctx = event.getContext();
        if (!(ctx instanceof DocumentEventContext)) return;

        DocumentModel document = ((DocumentEventContext) ctx).getSourceDocument();
        if (document == null || document.isImmutable()) return;

        CoreSession session = ctx.getCoreSession();

        // If we are moving the cleanupCharacterService to only be for FVDocuments, we can move the call to the service to FVDocumentListener.
        // For now, since we aren't entirely sure of the type this will be called from, I'm putting it into a "DocumentListener" class.
        if (event.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE) || event.getName().equals(DocumentEventTypes.DOCUMENT_CREATED)) {
            cleanupCharactersService.cleanUnicodeCharacters(session, document , event);
        }
    }
}
