package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.List;
import java.util.Map;

public interface CleanupCharactersService {
        DocumentModel cleanConfusables(DocumentModel document);
        Map<String, String> mapAndValidateConfusableCharacters(List<DocumentModel> characters);
}
