package ca.firstvoices.document.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public class CleanupCharactersServiceImpl implements CleanupCharactersService {

    @Override
    public void cleanUnicodeCharacters(CoreSession session, DocumentModel document) {
        // Do something here:

        String docTitle = document.getProperty("dc:title").toString();

        session.saveDocument(document);
    }
}
