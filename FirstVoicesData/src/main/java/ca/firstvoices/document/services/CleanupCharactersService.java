package ca.firstvoices.document.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public interface CleanupCharactersService {
    void cleanUnicodeCharacters(CoreSession session, DocumentModel document, String propertyName);
}
