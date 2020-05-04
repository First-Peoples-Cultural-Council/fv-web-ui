package ca.firstvoices.services;

import java.util.List;
import java.util.Map;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public interface CleanupCharactersService {

        DocumentModel cleanConfusables(CoreSession session, DocumentModel document);

        Map<String, String> mapAndValidateConfusableCharacters(List<DocumentModel> characters);
}
