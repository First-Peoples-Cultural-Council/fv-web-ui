/*
 *
 * Copyright 2020 First People's Cultural Council
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * /
 */

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
    }

    @After public void tearDown() {
        alphabetAndConfusableCharacters.clear();
    }

    @Test
    public void cleanConfusablesTest() {
        String[] words = {"∀ᗄꓯ","Ҍᑳɓ","ｃⅽℭ"};
        String[] correctWords = {"aaa", "bbb", "ccc"};
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
        assertEquals(9, charMap.size());
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
