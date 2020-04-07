package ca.firstvoices.services;

import ca.firstvoices.exceptions.FVCharacterInvalidException;
import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

import java.util.*;

import static org.junit.Assert.*;

public class CleanupCharactersServiceImplTest extends AbstractFirstVoicesDataTest {

    private DocumentModel dialect;

    private Map<String, String[]> alphabetAndConfusableCharacters;

    @Before
    public void setUp() throws Exception {
        assertNotNull("Should have a valid session", session);
        createSetup(session);
        dialect = getCurrentDialect();
        alphabetAndConfusableCharacters = new HashMap<>();
        alphabetAndConfusableCharacters.put("a", new String[] {"∀", "ᗄ", "ꓯ"});
        alphabetAndConfusableCharacters.put("b", new String[] {"Ҍ", "ᑳ", "ɓ"});
        alphabetAndConfusableCharacters.put("c", new String[] {"ｃ", "ⅽ", "ℭ"});
        createAlphabetWithConfusableCharacters(alphabetAndConfusableCharacters);
        createLetterWithLowerCaseUppercaseConfusableCharacters("y", 4, "Y", new String[]{"ŷ", "γ"}, new String[]{"Ŷ", "Υ"});
    }
    //
    @After public void tearDown() {
        alphabetAndConfusableCharacters.clear();
    }

    @Test
    public void cleanConfusablesTest() {
        String[] words = {"∀ᗄꓯ","Ҍᑳɓ","ｃⅽℭ", "Ŷŷ γΥ"};
        String[] correctWords = {"aaa", "bbb", "ccc", "Yy yY"};
        List<DocumentModel> documentModels = createWords(words);
        for (int i = 0; i < documentModels.size(); i++) {
            DocumentModel documentModel = documentModels.get(i);
            DocumentModel updatedDocument = cleanupCharactersService.cleanConfusables(documentModel);
            String title = (String) updatedDocument.getPropertyValue("dc:title");
            assertEquals(correctWords[i], title);
        }
    }

    @Test
    public void mapAndValidateConfusableCharactersTest() {
        DocumentModelList characters = session.getChildren(getAlphabetDoc().getRef());
        Map<String, String> charMap = cleanupCharactersService.mapAndValidateConfusableCharacters(characters);
        assertEquals(13, charMap.size());
        for (Map.Entry<String, String> pair : charMap.entrySet()) {
            if ("∀".equals(pair.getKey())) {
                assertEquals("a", pair.getValue());
            } else if ("ᑳ".equals(pair.getKey())) {
                assertEquals("b", pair.getValue());
            } else if ("ɓ".equals(pair.getKey())) {
                assertEquals("b", pair.getValue());
            } else if ("ｃ".equals(pair.getKey())) {
                assertEquals("c", pair.getValue());
            } else if ("ᗄ".equals(pair.getKey())) {
                assertEquals("a", pair.getValue());
            } else if ("Ҍ".equals(pair.getKey())) {
                assertEquals("b", pair.getValue());
            } else if ("ⅽ".equals(pair.getKey())) {
                assertEquals("c", pair.getValue());
            } else if ("ℭ".equals(pair.getKey())) {
                assertEquals("c", pair.getValue());
            } else if ("ꓯ".equals(pair.getKey())) {
                assertEquals("a", pair.getValue());
            } else if("ŷ".equals(pair.getKey()) ||"γ".equals(pair.getKey())){
                assertEquals("y", pair.getValue());
            } else if("Ŷ".equals(pair.getKey()) ||"Υ".equals(pair.getKey())){
                assertEquals("Y", pair.getValue());
            } else {
                fail();
            }
        }
        
    }

    @Test(expected = FVCharacterInvalidException.class)
    public void mapAndValidateConfusableCharactersThrowsExceptionWhenMappedConfusableToAlphabetCharacterTest() {
        alphabetAndConfusableCharacters.clear();
        alphabetAndConfusableCharacters.put("e", new String[] {"f"});
        alphabetAndConfusableCharacters.put("f", new String[] {"e"});
        createAlphabetWithConfusableCharacters(alphabetAndConfusableCharacters);
        DocumentModelList characters = session.getChildren(getAlphabetDoc().getRef());
        cleanupCharactersService.mapAndValidateConfusableCharacters(characters);
    }

    @Test(expected = FVCharacterInvalidException.class)
    public void mapAndValidateConfusableCharactersThrowsExceptionWhenUppercaseConfusablesExistWithoutUppercaseCharacter() {
        createLetterWithLowerCaseUppercaseConfusableCharacters("y", 4, "", new String[]{"ŷ", "γ"}, new String[]{"Ŷ", "Υ"});
        DocumentModelList characters = session.getChildren(getAlphabetDoc().getRef());
        cleanupCharactersService.mapAndValidateConfusableCharacters(characters);
    }

    private void createAlphabetWithConfusableCharacters(Map<String, String[]> alphabet) {
        Iterator it = alphabet.entrySet().iterator();
        int i = 0;
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry)it.next();
            DocumentModel letterDoc = session.createDocumentModel(dialect.getPathAsString() + "/Alphabet", (String) pair.getKey(), "FVCharacter");
            letterDoc.setPropertyValue("fvcharacter:alphabet_order", i);
            letterDoc.setPropertyValue("fvcharacter:confusable_characters", (String[]) pair.getValue());
            createDocument(session, letterDoc);
            i++;
        }
    }

    private void createLetterWithLowerCaseUppercaseConfusableCharacters(
        String title, int alphabet_order, String upper_case, String[] confusable_characters, String[] upper_case_confusable_characters
    ) {
        DocumentModel letterDoc = session.createDocumentModel(dialect.getPathAsString() + "/Alphabet", (String) title, "FVCharacter");
        letterDoc.setPropertyValue("fvcharacter:alphabet_order", alphabet_order);
        letterDoc.setPropertyValue("fvcharacter:upper_case_character", upper_case);
        letterDoc.setPropertyValue("fvcharacter:confusable_characters", confusable_characters);
        letterDoc.setPropertyValue("fvcharacter:upper_case_confusable_characters", upper_case_confusable_characters);
        createDocument(session, letterDoc);
    }
 

    private  List<DocumentModel> createWords(String[] words) {
        List<DocumentModel> documentModels = new ArrayList<>();
        for (int i = 0; i < words.length; i++) {
            DocumentModel document = session.createDocumentModel(dialect.getPathAsString() + "/Dictionary", words[i], "FVWord");
            document.setPropertyValue("fv:reference", words[i]);
            document = createDocument(session, document);
            documentModels.add(document);
        }
        return documentModels;
    }

}
