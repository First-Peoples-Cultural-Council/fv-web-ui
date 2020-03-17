package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

import java.util.Map;

public interface CleanupCharactersService {
        DocumentModel cleanConfusables(DocumentModel document);
        Map<String, String> mapAndValidateConfusableCharacters(DocumentModelList characters);
}
