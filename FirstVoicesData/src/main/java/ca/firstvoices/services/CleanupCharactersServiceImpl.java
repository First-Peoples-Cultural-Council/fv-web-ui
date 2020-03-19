package ca.firstvoices.services;

import ca.firstvoices.exceptions.FVCharacterInvalidException;
import org.nuxeo.ecm.core.api.*;

import java.util.*;
import java.util.stream.Collectors;

public class CleanupCharactersServiceImpl extends AbstractService implements CleanupCharactersService {

    private CoreSession session;
    private String[] types = {
            "FVPhrase",
            "FVWord",
    };

    @Override
    public DocumentModel cleanConfusables(DocumentModel document) {
        session = document.getCoreSession();
        if (Arrays.stream(types).parallel().noneMatch(document.getDocumentType().toString()::contains)) return document;

        DocumentModel dictionary = session.getDocument(document.getParentRef());
        DocumentModel dialect = session.getDocument(dictionary.getParentRef());
        DocumentModel alphabet = session.getDocument(new PathRef(dialect.getPathAsString() + "/Alphabet"));
        List<DocumentModel> characters = session.getChildren(alphabet.getRef());

        if (characters.size() == 0) return document;

        String propertyValue = (String) document.getPropertyValue("dc:title");

        characters = characters
                .stream()
                .filter(c-> !c.isTrashed())
                .map(c -> c.getId().equals(document.getId()) ? document : c)
                .collect(Collectors.toList());

        if (propertyValue != null) {
            Map<String, String> confusables = mapAndValidateConfusableCharacters(characters);
            String updatedPropertyValue = replaceConfusables(confusables, "", propertyValue);
            if (!updatedPropertyValue.equals(propertyValue)) {
                 document.setPropertyValue("dc:title", updatedPropertyValue);
                return document;
            }
        }

        return document;
    }

    @Override
    public Map<String, String> mapAndValidateConfusableCharacters(List<DocumentModel> characters) throws FVCharacterInvalidException {
        Map<String, String> confusables = new HashMap<>();
        List<String> characterValues = characters.stream().filter(c-> !c.isTrashed()).map(c -> (String) c.getPropertyValue("dc:title")).collect(Collectors.toList());

        for (DocumentModel d : characters) {
            String[] confusableList = (String[]) d.getPropertyValue("confusable_characters");
            if (confusableList != null) {
                for (String confusableCharacter : confusableList) {
                    String characterTitle = (String) d.getPropertyValue("dc:title");
                    if (confusables.put(confusableCharacter, characterTitle) != null) {
                        throw new FVCharacterInvalidException("Can't have confusable character " + confusableCharacter + " as it is mapped as a confusable character to another alphabet character.", 400);
                    }
                    if (confusables.containsKey(characterTitle)) {
                        throw new FVCharacterInvalidException("Can't have confusable character " + confusableCharacter + " as it is mapped as a confusable character to another alphabet character.", 400);
                    }
                    if (characterValues.contains(confusableCharacter)) {
                        throw new FVCharacterInvalidException("Can't have confusable character " + confusableCharacter + " as it is found in the dialect's alphabet.", 400);
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
