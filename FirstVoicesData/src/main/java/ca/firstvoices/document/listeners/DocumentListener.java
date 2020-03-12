package ca.firstvoices.document.listeners;

import ca.firstvoices.document.services.CleanupCharactersService;
import com.google.common.collect.ImmutableMap;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.api.model.DocumentPart;
import org.nuxeo.ecm.core.api.model.Property;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.core.schema.DocumentType;
import org.nuxeo.runtime.api.Framework;

import java.util.Arrays;
import java.util.Iterator;
import java.util.Map;

public class DocumentListener implements EventListener {

    protected CleanupCharactersService cleanupCharactersService = Framework.getService(CleanupCharactersService.class);

    // List of types this cleanup service is applied to:
    private String[] types = {
            "FVAlphabet",
            "FVAudio",
            "FVBook",
            "FVBookEntry",
            "FVBooks",
            "FVCategories",
            "FVCategory",
            "FVCharacter",
            "FVContributor",
            "FVContributors",
            "FVDialect",
            "FVDictionary",
            "FVGallery",
            "FVLanguage",
            "FVLanguageFamily",
            "FVLink",
            "FVLinks",
            "FVPhrase",
            "FVPicture",
            "FVPortal",
            "FVResources",
            "FVVideo",
            "FVWord",
    };

    // TODO: THE IDEA HERE IS THAT WE'LL PULL A LIST OF CONFUSABLES FROM THE DIALECT IN THE FUTURE
    private Map<String, String> confusables = ImmutableMap.of(
            // k == confusable value & v == correct value
            "a", "a",
            "b", "b"
    );

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

        DocumentType currentType = document.getDocumentType();

        if (Arrays.stream(types).parallel().anyMatch(currentType.toString()::contains)) {
            CoreSession session = ctx.getCoreSession();

            // TODO: We're only doing this on dc:title. Update this later to do any property?
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
                    cleanupCharactersService.cleanUnicodeCharacters(session, document, confusables, "dc:title");
                }
            } else {
                cleanupCharactersService.cleanUnicodeCharacters(session, document, confusables, "dc:title");
            }
        }
    }
}
