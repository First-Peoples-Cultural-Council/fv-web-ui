/*
 *
 *  *
 *  * Copyright 2020 First People's Cultural Council
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  * /
 *
 */

package ca.firstvoices.services;

import static ca.firstvoices.schemas.DialectTypesConstants.FV_CHARACTER;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_WORD;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import ca.firstvoices.exceptions.FVCharacterInvalidException;
import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

public class CleanupCharactersServiceImplTest extends AbstractFirstVoicesDataTest {

  private Map<String, String[]> alphabetAndConfusableCharacters;

  @Before
  public void setUp() {
    assertNotNull("Should have a valid session", session);
    createSetup(session);
  }

  @After
  public void tearDown() {
    alphabetAndConfusableCharacters.clear();
  }

  @Test
  public void cleanConfusablesTest() {
    setupCharacters();
    String[] words = {"∀ᗄꓯ", "Ҍᑳɓ", "ｃⅽℭ", "Ŷŷ γΥ"};
    String[] correctWords = {"aaa", "bbb", "ccc", "Yy yY"};
    List<DocumentModel> documentModels = createWords(words);
    for (int i = 0; i < documentModels.size(); i++) {
      DocumentModel documentModel = documentModels.get(i);
      cleanupCharactersService.cleanConfusables(session, documentModel, false);
      String title = (String) documentModel.getPropertyValue("dc:title");
      assertEquals(correctWords[i], title);
    }
  }

  @Test
  public void mapAndValidateConfusableUnicodeCharactersTest() {
    setupUnicodeCharacters();

    String[] words = {"ൟABC", "\u006F\u0D30\u006FABC", "CBAﷳ", "CBA\u006C\u0643\u0628\u0631",
        "ȾABC", "\u0054\u0338ABC"};
    String[] correctWords = {"ൟABC", "ൟABC", "CBAﷳ", "CBAﷳ", "ȾABC", "ȾABC"};
    List<DocumentModel> documentModels = createWords(words);
    for (int i = 0; i < documentModels.size(); i++) {
      DocumentModel documentModel = documentModels.get(i);
      assertEquals(true, documentModel.getPropertyValue("fv:update_confusables_required"));
      cleanupCharactersService.cleanConfusables(session, documentModel, false);
      String title = (String) documentModel.getPropertyValue("dc:title");
      assertEquals(correctWords[i], title);
      assertEquals(false, documentModel.getPropertyValue("fv:update_confusables_required"));
    }

  }

  @Test(expected = FVCharacterInvalidException.class)
  public void validateConfusableCharactersThrowsExceptionWhenMappedConfusableToAlphabetCharacterTest() {
    setupCharacters();
    alphabetAndConfusableCharacters.clear();
    alphabetAndConfusableCharacters.put("e", new String[]{"f"});
    alphabetAndConfusableCharacters.put("f", new String[]{"e"});
    createAlphabetWithConfusableCharacters(alphabetAndConfusableCharacters);
    DocumentModelList characters = session.getChildren(alphabet.getRef());
    for (DocumentModel doc : characters) {
      cleanupCharactersService.validateCharacters(characters, alphabet, doc);
    }

  }

  @Test(expected = FVCharacterInvalidException.class)
  public void validateConfusableCharactersThrowsExceptionWhenUppercaseConfusablesExistWithoutUppercaseCharacter() {
    setupCharacters();
    createLetterWithLowerCaseUppercaseConfusableCharacters("y", 4, "", new String[]{"ŷ", "γ"},
        new String[]{"Ŷ", "Υ"});
    DocumentModelList characters = session.getChildren(alphabet.getRef());
    for (DocumentModel doc : characters) {
      cleanupCharactersService.validateCharacters(characters, alphabet, doc);
    }
  }

  @Test(expected = FVCharacterInvalidException.class)
  public void validateCharactersInternally() {
    setupCharacters();
    session.createDocumentModel(alphabet.getPathAsString(), "a", FV_CHARACTER);

    DocumentModelList characters = session.getChildren(alphabet.getRef());
    for (DocumentModel doc : characters) {
      cleanupCharactersService.validateCharacters(characters, alphabet, doc);
    }
  }

  @Test(expected = FVCharacterInvalidException.class)
  public void validateIgnoredCharacters() {
    setupCharacters();

    List<String> testList = new ArrayList<>();
    testList.add("a");
    testList.add("b");

    alphabet.setPropertyValue("fv-alphabet:ignored_characters", (Serializable) testList);

    DocumentModelList characters = session.getChildren(alphabet.getRef());
    for (DocumentModel doc : characters) {
      cleanupCharactersService.validateCharacters(characters, alphabet, doc);
    }
  }

  @Test
  public void getCharactersToSkip() {
    setupCharacters();
    Set<String> collectedMap = cleanupCharactersService.getCharactersToSkipForDialect(dialect);
    assertEquals(18, collectedMap.size());
  }

  private void setupCharacters() {
    alphabetAndConfusableCharacters = new HashMap<>();
    alphabetAndConfusableCharacters.put("a", new String[]{"∀", "ᗄ", "ꓯ"});
    alphabetAndConfusableCharacters.put("b", new String[]{"Ҍ", "ᑳ", "ɓ"});
    alphabetAndConfusableCharacters.put("c", new String[]{"ｃ", "ⅽ", "ℭ"});
    createAlphabetWithConfusableCharacters(alphabetAndConfusableCharacters);
    createLetterWithLowerCaseUppercaseConfusableCharacters("y", 4, "Y", new String[]{"ŷ", "γ"},
        new String[]{"Ŷ", "Υ"});
  }

  private void setupUnicodeCharacters() {
    // The escaped unicode (\\) is expected input in the field when creating or updating character.
    alphabetAndConfusableCharacters = new HashMap<>();
    // In this example: ൟ (\u0D5F) can be confused with Composite Character oരo̸
    // (\u006F\u0D30\u006F)
    alphabetAndConfusableCharacters.put("ൟ", new String[]{"\\u006F\\u0D30\\u006F"});
    // In this example: ﷳ‎ (\uFDF3) can be confused with Composite Character lكبر
    // (\u006C\u0643\u0628\u0631)
    alphabetAndConfusableCharacters.put("ﷳ", new String[]{"\\u006C\\u0643\\u0628\\u0631"});
    // In this example: Ⱦ (\u023E) can be confused with Composite Character T̸ (\u0054\u0338)
    alphabetAndConfusableCharacters.put("Ⱦ", new String[]{"\\u0054\\u0338"});
    createAlphabetWithConfusableCharacters(alphabetAndConfusableCharacters);
  }

  private void createAlphabetWithConfusableCharacters(Map<String, String[]> alphabet) {
    Iterator it = alphabet.entrySet().iterator();
    int i = 0;
    while (it.hasNext()) {
      Map.Entry pair = (Map.Entry) it.next();
      DocumentModel letterDoc = session
          .createDocumentModel(dialect.getPathAsString() + "/Alphabet", (String) pair.getKey(),
              FV_CHARACTER);
      letterDoc.setPropertyValue("fvcharacter:alphabet_order", i);
      letterDoc.setPropertyValue("fvcharacter:confusable_characters", (String[]) pair.getValue());
      createDocument(session, letterDoc);
      i++;
    }
  }

  private void createLetterWithLowerCaseUppercaseConfusableCharacters(String title, int order,
      String uChar, String[] confusableChars, String[] uConfusableChars) {
    DocumentModel letterDoc = session
        .createDocumentModel(dialect.getPathAsString() + "/Alphabet", title, FV_CHARACTER);
    letterDoc.setPropertyValue("fvcharacter:alphabet_order", order);
    letterDoc.setPropertyValue("fvcharacter:upper_case_character", uChar);
    letterDoc.setPropertyValue("fvcharacter:confusable_characters", confusableChars);
    letterDoc.setPropertyValue("fvcharacter:upper_case_confusable_characters", uConfusableChars);
    createDocument(session, letterDoc);
  }


  private List<DocumentModel> createWords(String[] words) {
    List<DocumentModel> documentModels = new ArrayList<>();
    for (String word : words) {
      DocumentModel document = session
          .createDocumentModel(dialect.getPathAsString() + "/Dictionary", word, FV_WORD);
      document.setPropertyValue("fv:reference", word);
      document.setPropertyValue("fv:update_confusables_required", true);
      document = createDocument(session, document);
      documentModels.add(document);
    }
    return documentModels;
  }

}
