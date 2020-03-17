package ca.firstvoices.services;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.*;

import java.util.*;
import java.util.stream.Collectors;

public class CleanupCharactersServiceImpl extends AbstractService implements CleanupCharactersService {

    private static final Log log = LogFactory.getLog(CleanupCharactersService.class);
    private CoreSession session;
    private String[] types = {
            "FVPhrase",
            "FVWord",
    };

    @Override
    public void cleanConfusables(DocumentModel document) {
        session = document.getCoreSession();
        if (Arrays.stream(types).parallel().noneMatch(document.getDocumentType().toString()::contains)) return;

        DocumentModel dictionary = session.getDocument(document.getParentRef());
        DocumentModel dialect = session.getDocument(dictionary.getParentRef());
        DocumentModel alphabet = session.getDocument(new PathRef(dialect.getPathAsString() + "/Alphabet"));
        DocumentModelList characters = session.getChildren(alphabet.getRef());

        if (characters.size() == 0) return;

        String propertyValue = (String) document.getPropertyValue("dc:title");

        if (propertyValue != null) {
            try {
                Map<String, String> confusables = mapAndValidateConfusableCharacters(characters);
                String updatedPropertyValue = replaceConfusables(confusables, "", propertyValue);
                if (!updatedPropertyValue.equals(propertyValue)) {
                    document.setPropertyValue("dc:title", updatedPropertyValue);
                }

            } catch (NuxeoException e) {
                // TODO: HAVE BETTER ERROR HANDLING
                log.error("Error for dialect " + dialect.getPropertyValue("dc:title") + ": " + e);
            }
        }
    }

    @Override
    public Map<String, String> mapAndValidateConfusableCharacters(DocumentModelList characters) throws NuxeoException {
        Map<String, String> confusables = new HashMap<>();
        List<String> characterValues = characters.stream().map(c -> (String) c.getPropertyValue("dc:title")).collect(Collectors.toList());

        for (DocumentModel d : characters) {
            String[] confusableList = (String[]) d.getPropertyValue("confusable_characters");
            if (confusableList != null) {
                for (String confusableCharacter : confusableList) {
                    String characterTitle = (String) d.getPropertyValue("dc:title");
                    if (confusables.put(confusableCharacter, characterTitle) != null) {
                        throw new NuxeoException("Can't have confusable character " + confusableCharacter + " as it is mapped as a confusable character to another alphabet character.", 400);
                    }
                    if (confusables.containsKey(characterTitle)) {
                        throw new NuxeoException("Can't have confusable character " + confusableCharacter + " as it is mapped as a confusable character to another alphabet character.", 400);
                    }
                    if (characterValues.contains(confusableCharacter)) {
                        throw new NuxeoException("Can't have confusable character " + confusableCharacter + " as it is found in the dialect's alphabet.", 400);
                    }
                }
            }
        }
        return confusables;
    }

    private String replaceConfusables(Map<String, String> confusables, String current, String updatedPropertyValue) {
        if (updatedPropertyValue.length() == 0) {
            return current;
        }

        for (Map.Entry<String, String> entry : confusables.entrySet()) {
            String k = entry.getKey();
            String v = entry.getValue();
            if (updatedPropertyValue.startsWith(k)) {
                return replaceConfusables(confusables, current + v, updatedPropertyValue.substring(k.length()));
            }
        }

        char charAt = updatedPropertyValue.charAt(0);

        return replaceConfusables(confusables, current + charAt, updatedPropertyValue.substring(1));
    }

}
