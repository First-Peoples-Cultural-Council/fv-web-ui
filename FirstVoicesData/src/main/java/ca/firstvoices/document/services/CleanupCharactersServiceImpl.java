package ca.firstvoices.document.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public class CleanupCharactersServiceImpl implements CleanupCharactersService {

    @Override
    public void cleanUnicodeCharacters(CoreSession session, DocumentModel document, String propertyName) {
        String propertyValue = (String) document.getPropertyValue(propertyName);

        if (propertyValue != null) {
            String updatedPropertyValue = updatePropertyValue(propertyValue);
            if (updatedPropertyValue != propertyValue) {
                // We only want to save if we are updating the property value (otherwise it will trigger loop)
                session.saveDocument(document);
            }
        }
    }

    private String updatePropertyValue(String propertyValue) {
//        Actual implementation here:
        return propertyValue;
    }
}
