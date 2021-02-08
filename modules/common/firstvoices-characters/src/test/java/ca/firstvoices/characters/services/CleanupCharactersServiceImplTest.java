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

package ca.firstvoices.characters.services;

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CHARACTER;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;
import static ca.firstvoices.testUtil.helpers.DocumentTestHelpers.createDocument;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import ca.firstvoices.characters.exceptions.FVCharacterInvalidException;
import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import ca.firstvoices.testUtil.FirstVoicesDataFeature;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({FirstVoicesDataFeature.class})
@Deploy({
    "FirstVoicesCharacters:OSGI-INF/services/charactersCore-contrib.xml",
    "FirstVoicesCharacters:OSGI-INF/services/customOrderCompute-contrib.xml",
    "FirstVoicesCharacters:OSGI-INF/services/cleanupCharacters-contrib.xml",
    "FirstVoicesCoreTests:OSGI-INF/nuxeo.conf.override.xml"
})
public class CleanupCharactersServiceImplTest extends AbstractFirstVoicesDataTest {

  CharactersCoreService charactersCoreService = Framework
      .getService(CharactersCoreService.class);

  CleanupCharactersService cleanupCharactersService = Framework
      .getService(CleanupCharactersService.class);

  CustomOrderComputeService customOrderComputeService = Framework
      .getService(CustomOrderComputeService.class);


  private Map<String, String[]> alphabetAndConfusableCharacters;

  @Before
  public void setUp() {
    assertNotNull("Should have a valid session", session);
    setupCharacters();
  }

  @After
  public void tearDown() {
    alphabetAndConfusableCharacters.clear();

    // Clean up characters after run
    for (DocumentModel character : session.getChildren(alphabet.getRef(), FV_CHARACTER)) {
      session.removeDocument(character.getRef());
    }

    // Remove properties from alphabet
    alphabet.setPropertyValue("fv-alphabet:ignored_characters", null);
    session.save();
  }

  @Test
  public void cleanConfusablesTest() {
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
  public void cleanConfusablesShouldRecalculateOrder() {
    String[] words = {"∀ᗄꓯ", "aaa"};
    List<DocumentModel> documentModels = createWords(words);

    String customOrder1 = String.valueOf(
        cleanupCharactersService.cleanConfusables(session, documentModels.get(0), false)
            .getPropertyValue("fv:custom_order"));
    String customOrder2 = String.valueOf(customOrderComputeService
        .computeAssetNativeOrderTranslation(session, documentModels.get(1), false, false)
        .getPropertyValue("fv:custom_order"));
    assertEquals(customOrder2, customOrder1);
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
      cleanupCharactersService.cleanConfusables(session, documentModel, false);
      String title = (String) documentModel.getPropertyValue("dc:title");
      assertEquals(correctWords[i], title);
    }

  }

  @Test(expected = FVCharacterInvalidException.class)
  public void validateConfusableCharactersThrowsExceptionWhenMappedConfusableToAlphabetCharacterTest() {
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
    alphabet.setPropertyValue("fv-alphabet:ignored_characters",
        Collections.singletonList("ח").toArray());
    session.saveDocument(alphabet);

    Set<String> collectedMap = cleanupCharactersService.getCharactersToSkipForDialect(dialect);

    // Should match characters created + confusables + ignored characters
    assertEquals(24, collectedMap.size());
  }

  private void setupCharacters() {
    alphabetAndConfusableCharacters = new HashMap<>();
    alphabetAndConfusableCharacters.put("a", new String[]{"∀", "ᗄ", "ꓯ"});
    alphabetAndConfusableCharacters.put("b", new String[]{"Ҍ", "ᑳ", "ɓ"});
    alphabetAndConfusableCharacters.put("c", new String[]{"ｃ", "ⅽ", "ℭ"});
    alphabetAndConfusableCharacters.put("\u1E48",
        new String[]{"\u004E\u0332", "\u004E\u0320", "\u004E\u005F", "\u004E\u0331"});
    createAlphabetWithConfusableCharacters(alphabetAndConfusableCharacters);

    // Add lowercase/uppercase confusables to map
    String lowerCaseCharacter = "y";
    String upperCaseCharacter = "Y";

    alphabetAndConfusableCharacters.put(lowerCaseCharacter, new String[]{"ŷ", "γ"});
    alphabetAndConfusableCharacters.put(upperCaseCharacter, new String[]{"Ŷ", "Υ"});

    createLetterWithLowerCaseUppercaseConfusableCharacters(lowerCaseCharacter, 4,
        upperCaseCharacter,
        alphabetAndConfusableCharacters.get(lowerCaseCharacter),
        alphabetAndConfusableCharacters.get(upperCaseCharacter));

    assertEquals(5, charactersCoreService.getCharacters(session, alphabet).size());
    assertEquals(17, cleanupCharactersService.getAllConfusables(alphabet).size());
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

  private void createAlphabetWithConfusableCharacters(Map<String, String[]> alphabetSet) {
    Iterator<Map.Entry<String, String[]>> it = alphabetSet.entrySet().iterator();
    int i = 0;
    while (it.hasNext()) {
      Map.Entry<String, String[]> pair = it.next();

      if (session.hasChild(alphabet.getRef(), pair.getKey())) {
        continue;
      }

      DocumentModel letterDoc = session
          .createDocumentModel(dialect.getPathAsString() + "/Alphabet", pair.getKey(),
              FV_CHARACTER);
      letterDoc.setPropertyValue("fvcharacter:alphabet_order", i);
      letterDoc.setPropertyValue("fvcharacter:confusable_characters", pair.getValue());
      createDocument(session, letterDoc);
      i++;
    }
  }

  private void createLetterWithLowerCaseUppercaseConfusableCharacters(String title, int order,
      String uChar, String[] confusableChars, String[] uConfusableChars) {

    if (session.hasChild(alphabet.getRef(), title)) {
      return;
    }

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
          .createDocumentModel(dictionary.getPathAsString(), word, FV_WORD);
      document.setPropertyValue("fv:reference", word);
      document = createDocument(session, document);
      documentModels.add(document);
    }
    return documentModels;
  }

  @Test
  public void getAllWordsPhrasesForConfusable() {
    ArrayList<String> wordsToCreate = new ArrayList<>();

    wordsToCreate.add("WordWithNoConfusables");
    wordsToCreate.add("JustPartOf\u004EAConfusable");

    for (String[] confusable : alphabetAndConfusableCharacters.values()) {
      wordsToCreate.add(String.format("word%sword", Arrays.toString(confusable)));
    }

    createWords(wordsToCreate.toArray(new String[0]));

    session.save();

    for (String confusable : cleanupCharactersService.getAllConfusables(alphabet)) {
      DocumentModelList words = cleanupCharactersService
          .getAllWordsPhrasesForConfusable(session, dictionary.getId(), confusable, 100);
      assertEquals("Confusable `" + confusable + "` not  found.", 1, words.size());
    }
  }
}
