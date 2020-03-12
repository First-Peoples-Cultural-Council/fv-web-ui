package ca.firstvoices.document.listeners;

import ca.firstvoices.document.services.CleanupCharactersService;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.api.model.DocumentPart;
import org.nuxeo.ecm.core.api.model.Property;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

import java.util.Iterator;

public class DocumentListener implements EventListener {

    protected CleanupCharactersService cleanupCharactersService = Framework.getService(CleanupCharactersService.class);

    @Override
    public void handleEvent(Event event) {

        // Get event context and return if not DocumentEventContext
        EventContext ctx;
        ctx = event.getContext();
        if (!(ctx instanceof DocumentEventContext))
            return;

        // Get document from context and return if it is not mutable
        DocumentModel document = ((DocumentEventContext) ctx).getSourceDocument();
        if (document == null || document.isImmutable()) {
            return;
        }

        CoreSession session = ctx.getCoreSession();

        if (event.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {
            Boolean titleModified = false;

            DocumentPart[] docParts = document.getParts();
            for (DocumentPart docPart : docParts) {
                Iterator<Property> dirtyChildrenIterator = docPart.getDirtyChildren();

                while (dirtyChildrenIterator.hasNext()) {
                    Property property = dirtyChildrenIterator.next();
                    String propertyName = property.getField().getName().toString();

                    if (propertyName.equals("dc:title") && property.isDirty()) {
                        titleModified = true;
                    }
                }
            }

            if (titleModified) {
                cleanupCharactersService.cleanUnicodeCharacters(session, document, "dc:title");
            }
        } else {
            cleanupCharactersService.cleanUnicodeCharacters(session, document, "dc:title");
        }
    }
}
