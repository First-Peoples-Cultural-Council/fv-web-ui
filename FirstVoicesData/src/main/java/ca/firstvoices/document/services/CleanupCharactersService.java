package ca.firstvoices.document.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

import java.util.Map;

public interface CleanupCharactersService {
        void cleanUnicodeCharacters(CoreSession session, DocumentModel document, String[] types, String propertyName);
        Map<String, String> mapAndValidateConfusableCharacters(DocumentModelList characters);
}
