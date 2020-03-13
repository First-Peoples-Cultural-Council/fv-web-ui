package ca.firstvoices.document.services;

import ca.firstvoices.services.AbstractService;
import com.google.common.collect.ImmutableMap;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.api.model.DocumentPart;
import org.nuxeo.ecm.core.api.model.Property;
import org.nuxeo.ecm.core.event.Event;

import java.util.Arrays;
import java.util.Iterator;
import java.util.Map;

public class CleanupCharactersServiceImpl extends AbstractService implements CleanupCharactersService {

    //  List of property names this service is applied to:
    // TODO: We're only doing this on dc:title. Update this later to do any property?
    // Another thought: Do we want this in the service?
    private String[] propertyNames = {
            "dc:title"
    };

    // List of types this cleanup service is applied to:
    // If we are moving the cleanupCharacterService to only be for FVDocuments, we can move the call to the service to FVDocumentListener.
    // For now, since we aren't entirely sure of the type this will be called from, I'm putting it into a "DocumentListener" class.
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


    @Override
    public void cleanUnicodeCharacters(CoreSession session, DocumentModel document, Event event) {
        if (event.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {
            DocumentPart[] docParts = document.getParts();
            for (DocumentPart docPart : docParts) {
                Iterator<Property> dirtyChildrenIterator = docPart.getDirtyChildren();

                while (dirtyChildrenIterator.hasNext()) {
                    Property property = dirtyChildrenIterator.next();
                    String propertyName = property.getField().getName().toString();
                    if (property.isDirty() && Arrays.stream(propertyNames).anyMatch(s -> propertyName.equals(s))) {
                        cleanCharacters(session, document , propertyName);
                    }
                }
            }
        } else if (event.getName().equals(DocumentEventTypes.DOCUMENT_CREATED)) {
            Arrays.stream(propertyNames).forEach(propertyName -> {
                if (document.getProperty(propertyName) != null) {
                    cleanCharacters(session, document , propertyName);
                }
            });
        }
    }

    private void cleanCharacters(CoreSession session, DocumentModel document, String propertyName) {
        String currentType = document.getDocumentType().toString();
        if (Arrays.stream(types).noneMatch(currentType::contains)) return;

        // TODO: THE IDEA HERE IS THAT WE'LL PULL A LIST OF CONFUSABLES FROM THE DIALECT IN THE FUTURE.
        // Get dialect (this will be used later...)
        DocumentModel dialect = getDialect(document);
        if (dialect == null) return;
        // THIS IS HOW WE WOULD DO THIS JUST FOR ONE DIALECT IF RELEASED:
//        if (!"ESPERANTO".equalsIgnoreCase((String) dialect.getPropertyValue("dc:title"))) return;

        Map<String, String> confusables = ImmutableMap.of(
                // k == confusable value & v == correct value
                "b", "a",
                "c", "d"
        );

        // Make sure that none of the values are keys (to avoid endless looping on save)
        // TODO: WHEN CREATING CONFUSABLES WE NEED TO MAKE SURE THAT THE "CORRECT VALUE (VALUE)" IS NOT AN "CONFUSABLE VALUE (KEY)"
        if (confusables.values().stream().anyMatch(v -> confusables.containsKey(v))) return;

        String propertyValue = (String) document.getPropertyValue(propertyName);

        if (propertyValue != null) {
            String updatedPropertyValue = replaceConfusables( confusables, "", propertyValue);
            if (!updatedPropertyValue.equals(propertyValue)) {
                // We only want to save if we are updating the property value (otherwise it will trigger loop)
                document.setPropertyValue(propertyName, updatedPropertyValue);
                session.saveDocument(document);
            }
        }
    }


    private String replaceConfusables(Map<String, String> confusables, String current, String updatedPropertyValue) {
        if (updatedPropertyValue.length() == 0) {
            return current;
        }

        for (Map.Entry<String, String> entry : confusables.entrySet()) {
            String k = entry.getKey();
            String v = entry.getValue();
            if (updatedPropertyValue.startsWith(k)) {
                return replaceConfusables( confusables,current + v, updatedPropertyValue.substring(k.length()));
            }
        }

        char charAt = updatedPropertyValue.charAt(0);

        return replaceConfusables( confusables, current + charAt, updatedPropertyValue.substring(1));
    }

}
