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

import java.util.Arrays;
import java.util.Iterator;

public class DocumentListener implements EventListener {

    private CleanupCharactersService service = Framework.getService(CleanupCharactersService.class);

    // List of types this cleanup service is applied to:
    // If we are moving the cleanupCharacterService to only be for FVDocuments, we can move the call to the service to FVDocumentListener.
    // For now, since we aren't entirely sure of the type this will be called from, I'm putting it into a "DocumentListener" class.
    private String[] types = {
//            "FVAlphabet",
//            "FVAudio",
//            "FVBook",
//            "FVBookEntry",
//            "FVBooks",
//            "FVCategories",
//            "FVCategory",
//            "FVCharacter",
//            "FVContributor",
//            "FVContributors",
//            "FVDialect",
//            "FVDictionary",
//            "FVGallery",
//            "FVLanguage",
//            "FVLanguageFamily",
//            "FVLink",
//            "FVLinks",
            "FVPhrase",
//            "FVPicture",
//            "FVPortal",
//            "FVResources",
//            "FVVideo",
            "FVWord",
    };

    //  List of property names this service is applied to:
    // TODO: We're only doing this on dc:title. Update this later to do any property?
    private String[] propertyNames = {
            "dc:title"
    };


    @Override
    public void handleEvent(Event event) {
        if (event.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE) || event.getName().equals(DocumentEventTypes.DOCUMENT_CREATED)) {

            EventContext ctx = event.getContext();
            if (!(ctx instanceof DocumentEventContext)) return;

            DocumentModel document = ((DocumentEventContext) ctx).getSourceDocument();
            if (document == null || document.isImmutable()) return;

            CoreSession session = ctx.getCoreSession();

            if (Arrays.stream(types).noneMatch(t ->  t.equalsIgnoreCase(document.getType()))) return;

            if (event.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {
                DocumentPart[] docParts = document.getParts();
                for (DocumentPart docPart : docParts) {
                    Iterator<Property> dirtyChildrenIterator = docPart.getDirtyChildren();

                    while (dirtyChildrenIterator.hasNext()) {
                        Property property = dirtyChildrenIterator.next();
                        String propertyName = property.getField().getName().toString();
                        if (property.isDirty() && Arrays.stream(propertyNames).anyMatch(s -> propertyName.equals(s))) {
                            service.cleanUnicodeCharacters(session, document, types, propertyName);
                        }
                    }
                }

            } else if (event.getName().equals(DocumentEventTypes.DOCUMENT_CREATED)) {
                Arrays.stream(propertyNames).forEach(propertyName -> {
                    if (document.getProperty(propertyName) != null) {
                        service.cleanUnicodeCharacters(session, document, types, propertyName);
                    }
                });
            }
        }
    }
}
