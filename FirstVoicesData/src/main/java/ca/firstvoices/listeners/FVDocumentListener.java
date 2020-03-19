package ca.firstvoices.listeners;

import ca.firstvoices.services.CleanupCharactersService;
import ca.firstvoices.services.AssignAncestorsService;
import ca.firstvoices.services.SanitizeDocumentService;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.api.model.DocumentPart;
import org.nuxeo.ecm.core.api.model.Property;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.api.Framework;

import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;


public class FVDocumentListener extends AbstractListener {

    private CoreSession session;
    private AssignAncestorsService assignAncestorsService = Framework.getService(AssignAncestorsService.class);
    protected SanitizeDocumentService sanitizeDocumentService = Framework.getService(SanitizeDocumentService.class);
    private CleanupCharactersService cleanupCharactersService = Framework.getService(CleanupCharactersService.class);
    private EventContext ctx;
    private Event e;
    private DocumentModel document;

    @Override
    public void handleEvent(Event event) {
        e = event;
        ctx = e.getContext();
        if (!(ctx instanceof DocumentEventContext))
            return;

        session = ctx.getCoreSession();

        document = ((DocumentEventContext) ctx).getSourceDocument();
        if (document == null || document.isImmutable()) {
            return;
        }

        if (event.getName().equals(DocumentEventTypes.ABOUT_TO_CREATE)) {
            cleanupWordsAndPhrases();
            validateCharacter();
        }

        if (event.getName().equals(DocumentEventTypes.DOCUMENT_CREATED)) {
            assignAncestors();
        }

        if (event.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {
            cleanupWordsAndPhrases();
            validateCharacter();
        }

        if (event.getName().equals(DocumentEventTypes.DOCUMENT_UPDATED)) {
            sanitizeWord();
        }

    }

    public void assignAncestors() {
        String[] types = {
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

        if (!Arrays.stream(types).parallel().anyMatch(document.getDocumentType().toString()::contains)) return;

        assignAncestorsService.assignAncestors(session, document);
    }

    public void cleanupWordsAndPhrases() {
        try {
            if (e.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {
                DocumentPart[] docParts = document.getParts();
                for (DocumentPart docPart : docParts) {
                    Iterator<Property> dirtyChildrenIterator = docPart.getDirtyChildren();

                    while (dirtyChildrenIterator.hasNext()) {
                        Property property = dirtyChildrenIterator.next();
                        String propertyName = property.getField().getName().toString();
                        if (property.isDirty() && propertyName.equals("dc:title")) {
                            cleanupCharactersService.cleanConfusables(document);
                        }
                    }
                }
            }
            if (e.getName().equals(DocumentEventTypes.ABOUT_TO_CREATE)) {
                cleanupCharactersService.cleanConfusables(document);
            }
        } catch (Exception exception) {
            rollBackEvent(e);
            throw exception;
        }
    }

    public void sanitizeWord() {
        if((document.getType().equals("FVWord") || document.getType().equals("FVPhrase"))
                && !document.isProxy()){
            sanitizeDocumentService.sanitizeDocument(session, document);
        }
    }

    public void validateCharacter() {
        if (document.getDocumentType().getName().equals("FVCharacter")) {
            try {
                DocumentModelList characters = getCharacters(document);

                if (e.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {
                    List<DocumentModel> results = characters.stream().map(
                            c -> c.getId().equals(document.getId()) ? document : c).collect(Collectors.toList());
                    cleanupCharactersService.mapAndValidateConfusableCharacters(results);
                }

                if (e.getName().equals(DocumentEventTypes.ABOUT_TO_CREATE)) {
                    cleanupCharactersService.mapAndValidateConfusableCharacters(characters);
                }

            } catch (Exception exception) {
                rollBackEvent(e);
                throw exception;
            }
        }
    }
}