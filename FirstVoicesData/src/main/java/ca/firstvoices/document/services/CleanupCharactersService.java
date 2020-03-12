package ca.firstvoices.document.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.Map;

public interface CleanupCharactersService {
    void cleanUnicodeCharacters(CoreSession session, DocumentModel document, Map<String, String> confusables, String propertyName);
}
