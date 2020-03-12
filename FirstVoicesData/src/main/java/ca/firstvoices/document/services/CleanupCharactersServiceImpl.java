package ca.firstvoices.document.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import java.util.Map;

public class CleanupCharactersServiceImpl implements CleanupCharactersService {

    @Override
    public void cleanUnicodeCharacters(CoreSession session, DocumentModel document, Map<String, String> confusables, String propertyName) {
        String propertyValue = (String) document.getPropertyValue(propertyName);

        if (propertyValue != null) {
            String updatedPropertyValue = checkConfusables( confusables, "", propertyValue);
            if (!updatedPropertyValue.equals(propertyValue)) {
                // We only want to save if we are updating the property value (otherwise it will trigger loop)
                document.setPropertyValue(propertyName, updatedPropertyValue);
                session.saveDocument(document);
            }
        }
    }

    private String checkConfusables(Map<String, String> confusables, String current, String updatedPropertyValue) {
        if (updatedPropertyValue.length() == 0) {
            return current;
        }

        for (Map.Entry<String, String> entry : confusables.entrySet()) {
            String k = entry.getKey();
            String v = entry.getValue();
            if (updatedPropertyValue.startsWith(k)) {
                return checkConfusables( confusables,current + v, updatedPropertyValue.substring(k.length()));
            }
        }

        char charAt = updatedPropertyValue.charAt(0);

        return checkConfusables( confusables, current + charAt, updatedPropertyValue.substring(1));
    }

}
