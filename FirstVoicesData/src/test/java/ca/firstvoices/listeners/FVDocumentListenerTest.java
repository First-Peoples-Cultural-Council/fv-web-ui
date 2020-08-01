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

package ca.firstvoices.listeners;

import static ca.firstvoices.schemas.DialectTypesConstants.FV_CHARACTER;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_WORD;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import ca.firstvoices.exceptions.FVCharacterInvalidException;
import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import org.junit.Test;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.runtime.test.runner.Deploy;

@Deploy("FirstVoicesData:OSGI-INF/ca.firstvoices.listeners.xml")
public class FVDocumentListenerTest extends AbstractFirstVoicesDataTest {

  @Test
  public void testListener() {
    // Get the DocumentModels for each of the parent documents
    DocumentModel languageFamily = session.getDocument(new PathRef("/FV/Family"));
    assertNotNull("Language family cannot be null", languageFamily);
    DocumentModel language = session.getDocument(new PathRef("/FV/Family/Language"));
    assertNotNull("Language cannot be null", language);
    assertNotNull("Dialect cannot be null", dialect);
    assertNotNull("Dictionary cannot be null", dictionary);

    // Create a new word & phrase document
    DocumentModel TestWord = createDocument(session, session
        .createDocumentModel("/FV/Family/Language/Dialect/Dictionary", " Test Word ", FV_WORD));
    DocumentModel TestPhrase = createDocument(session, session
        .createDocumentModel("/FV/Family/Language/Dialect/Dictionary", "  Test Phrase  ",
            FV_PHRASE));

    assertNotNull(TestWord);
    assertNotNull(TestPhrase);

    assertEquals(TestWord.getTitle(), " Test Word ");
    assertEquals(TestPhrase.getTitle(), "  Test Phrase  ");

    TestWord = session.getDocument(TestWord.getRef());
    TestPhrase = session.getDocument(TestPhrase.getRef());

    assertEquals("Word should have ID of parent family property", languageFamily.getId(),
        TestWord.getPropertyValue("fva:family"));
    assertEquals("Word should have ID of parent language property", language.getId(),
        TestWord.getPropertyValue("fva:language"));
    assertEquals("Word should have ID of parent dialect property", dialect.getId(),
        TestWord.getPropertyValue("fva:dialect"));

    assertEquals("Test Word", TestWord.getTitle());
    assertEquals("Test Phrase", TestPhrase.getTitle());

  }

  @Test(expected = FVCharacterInvalidException.class)
  public void internalCharacterValidationTest() {
    DocumentModel letterDoc = session
        .createDocumentModel(alphabet.getPathAsString(), "a", FV_CHARACTER);
    letterDoc.setPropertyValue("fvcharacter:alphabet_order", 1);
    letterDoc
        .setPropertyValue("fvcharacter:upper_case_character", "a".toUpperCase());
    letterDoc
        .setPropertyValue("fvcharacter:confusable_characters", new String[]{"a", "b"});
    createDocument(session, letterDoc);
  }

  @Test(expected = FVCharacterInvalidException.class)
  public void ignoredCharacterValidationTest() {

    int i = 1;
    for (char c = 'a'; c <= 'z'; c++) {
      DocumentModel letterDoc = session
          .createDocumentModel(alphabet.getPathAsString(), String.valueOf(c), FV_CHARACTER);
      letterDoc.setPropertyValue("fvcharacter:alphabet_order", i);
      letterDoc
          .setPropertyValue("fvcharacter:upper_case_character", String.valueOf(c).toUpperCase());
      createDocument(session, letterDoc);
      i++;
    }

    List<String> testList = new ArrayList<>();
    testList.add("a");
    testList.add("b");

    alphabet.setPropertyValue("fv-alphabet:ignored_characters", (Serializable) testList);
    session.saveDocument(alphabet);
  }

  @Test
  public void ignoredCharacterTest() {
    //Test that ignored characters are properly set.
    //Order recompute is tested in FirstVoicesNativeOrderTest

    int i = 1;
    for (char c = 'a'; c <= 'z'; c++) {
      DocumentModel letterDoc = session
          .createDocumentModel(alphabet.getPathAsString(), String.valueOf(c), FV_CHARACTER);
      letterDoc.setPropertyValue("fvcharacter:alphabet_order", i);
      letterDoc
          .setPropertyValue("fvcharacter:upper_case_character", String.valueOf(c).toUpperCase());
      createDocument(session, letterDoc);
      i++;
    }

    List<String> testList = new ArrayList<>();
    testList.add("+");
    testList.add("&&");
    testList.add("-");
    testList.add("-^");

    alphabet.setPropertyValue("fv-alphabet:ignored_characters", (Serializable) testList);
    session.saveDocument(alphabet);

    String[] ignoredCharacters = (String[]) alphabet
        .getPropertyValue("fv-alphabet:ignored_characters");
    assertEquals(4, ignoredCharacters.length);

  }

  @Test(expected = FVCharacterInvalidException.class)
  public void confusableCharacterValidationTest() {

    int i = 1;
    for (char c = 'a'; c <= 'z'; c++) {
      DocumentModel letterDoc = session
          .createDocumentModel(alphabet.getPathAsString(), String.valueOf(c), FV_CHARACTER);
      letterDoc.setPropertyValue("fvcharacter:alphabet_order", i);
      letterDoc
          .setPropertyValue("fvcharacter:upper_case_character", String.valueOf(c).toUpperCase());
      createDocument(session, letterDoc);
      i++;
    }

    List<String> testList = new ArrayList<>();
    testList.add("a");
    testList.add("b");

    DocumentModel d = session.getChildren(alphabet.getRef()).get(0);
    d.setPropertyValue("fvcharacter:confusable_characters", (Serializable) testList);
    session.saveDocument(d);
  }

  @Test(expected = FVCharacterInvalidException.class)
  public void upperConfusableCharacterValidationTest() {

    int i = 1;
    for (char c = 'a'; c <= 'z'; c++) {
      DocumentModel letterDoc = session
          .createDocumentModel(alphabet.getPathAsString(), String.valueOf(c), FV_CHARACTER);
      letterDoc.setPropertyValue("fvcharacter:alphabet_order", i);
      letterDoc
          .setPropertyValue("fvcharacter:upper_case_character", String.valueOf(c).toUpperCase());
      createDocument(session, letterDoc);
      i++;
    }

    List<String> testList = new ArrayList<>();
    testList.add("a");
    testList.add("b");

    DocumentModel d = session.getChildren(alphabet.getRef()).get(0);
    d.setPropertyValue("fvcharacter:upper_case_confusable_characters", (Serializable) testList);
    session.saveDocument(d);
  }
}