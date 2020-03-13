package ca.firstvoices.document.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.event.Event;

import java.util.Map;

public interface CleanupCharactersService {
    void cleanUnicodeCharacters(CoreSession session, DocumentModel document, Event event);
}
