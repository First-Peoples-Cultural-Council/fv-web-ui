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
import static ca.firstvoices.testUtil.helpers.DocumentTestHelpers.createDocument;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import ca.firstvoices.runner.FirstVoicesCoreTestsFeature;
import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({FirstVoicesCoreTestsFeature.class})
@Deploy({"FirstVoicesCharacters:OSGI-INF/services/charactersCore-contrib.xml",
    "FirstVoicesCharacters:OSGI-INF/services/customOrderCompute-contrib.xml",
    "FirstVoicesCharacters:OSGI-INF/services/addConfusables-contrib.xml",
    "FirstVoicesCharacters:OSGI-INF/services/cleanupCharacters-contrib.xml"})
public class AddConfusablesServiceImplTest extends AbstractFirstVoicesDataTest {

  private final AddConfusablesService addConfusablesService =
      Framework.getService(AddConfusablesService.class);

  @Test
  public void addConfusablesTest() {
    String[] confusablesToAdd = {"￠", "ȼ"};

    assertNotNull("Dialect cannot be null", dialect);
    String path = dialect.getPathAsString();

    DocumentModel testConfusable =
        createDocument(session, session.createDocumentModel(path, "TestChar", FV_CHARACTER));
    testConfusable.setPropertyValue("dc:title", "¢");
    session.saveDocument(testConfusable);

    DocumentModel updated = session.saveDocument(addConfusablesService.updateConfusableCharacters(
        session,
        testConfusable,
        dialect,
        "¢",
        confusablesToAdd));

    String[] property = (String[]) updated.getPropertyValue("fvcharacter:confusable_characters");

    assertEquals(confusablesToAdd[0], property[0]);
    assertEquals(confusablesToAdd[1], property[1]);

    DocumentModel testConfusableUppercase =
        createDocument(session, session.createDocumentModel(path, "TestChar", FV_CHARACTER));
    testConfusableUppercase.setPropertyValue("fvcharacter:upper_case_character", "¢");

    session.saveDocument(testConfusableUppercase);

    updated = session.saveDocument(addConfusablesService.updateConfusableCharacters(session,
        testConfusableUppercase,
        dialect,
        "¢",
        confusablesToAdd));

    String[] uProperty =
        (String[]) updated.getPropertyValue("fvcharacter:upper_case_confusable_characters");

    assertEquals(confusablesToAdd[0], uProperty[0]);
    assertEquals(confusablesToAdd[1], uProperty[1]);
  }

  @Test
  public void getConfusablesFromOtherDialectsTest() {
    String[] expectedConfusables = new String[]{ "a", "b", "c", "q", "r" };
    String[] expectedUppercaseConfusables = new String[]{ "A", "B", "C", "Q", "R" };

    setupOtherDialects(session, expectedConfusables, expectedUppercaseConfusables);

    session.save();

    HashMap<String, HashSet<String>> confusables =
        addConfusablesService.getConfusablesFromAllDialects(session, dialect, false);

    HashMap<String, HashSet<String>> uppercaseConfusables =
        addConfusablesService.getConfusablesFromAllDialects(session, dialect, true);

    confusables.putAll(uppercaseConfusables);

    // Ensure all lowercase confusables are present for 't'
    for (String expectedConfusable : expectedConfusables) {
      assertTrue(confusables.get("t").contains(expectedConfusable));
    }

    for (String expectedConfusable : expectedUppercaseConfusables) {
      assertTrue(confusables.get("T").contains(expectedConfusable));
    }
  }

  @Test
  public void addConfusablesFromOtherDialectsTest() {
    String[] expectedConfusables = new String[]{ "a", "b", "c", "q", "r" };
    String[] expectedUppercaseConfusables = new String[]{ "A", "B", "C", "Q", "R" };

    setupOtherDialects(session, expectedConfusables, expectedUppercaseConfusables);

    // Create a character in dialect 1
    DocumentModel testChar1 =
        createDocument(session,
            session.createDocumentModel(alphabet.getPathAsString(), "TestChar1", FV_CHARACTER));
    testChar1.setPropertyValue("dc:title", "t");
    testChar1.setPropertyValue("fva:dialect", dialect.getId());
    testChar1.setPropertyValue("fvcharacter:upper_case_character", "T");
    session.saveDocument(testChar1);

    session.save();

    addConfusablesService.addConfusablesFromAllDialects(session, dialect);

    // Get character from dialect 1
    DocumentModel changedChar1 = session.getDocument(testChar1.getRef());
    String[] char1Confusables =
        (String[]) changedChar1.getPropertyValue("fvcharacter:confusable_characters");
    assertNotNull(char1Confusables);

    // Ensure all lowercase confusables are present
    for (String expectedConfusable : expectedConfusables) {
      assertTrue(Arrays.asList(char1Confusables).contains(expectedConfusable));
    }

    // Ensure all uppercase confusables are present
    String[] char1UCConfusables =
        (String[]) changedChar1.getPropertyValue("fvcharacter:upper_case_confusable_characters");
    assertNotNull(char1UCConfusables);

    for (String expectedConfusable : expectedUppercaseConfusables) {
      assertTrue(Arrays.asList(char1UCConfusables).contains(expectedConfusable));
    }
  }

  @Test
  public void ignoreConfusablesAlreadyUsed() {
    String[] confusablesToAdd = {"ā", "a̅", "ā", "ā", "a¯", "a‾"};

    String path = alphabet.getPathAsString();

    DocumentModel confusableWithUppercase =
        createDocument(session, session.createDocumentModel(path, "ā", FV_CHARACTER));
    confusableWithUppercase.setPropertyValue("dc:title", "ā");
    confusableWithUppercase.setPropertyValue("fvcharacter:upper_case_character", "a‾");
    session.saveDocument(confusableWithUppercase);

    DocumentModel addedConfusables =
        session.saveDocument(addConfusablesService.updateConfusableCharacters(session,
            confusableWithUppercase,
            dialect,
            "ā",
            confusablesToAdd));

    List<String> confusableList = Arrays.asList((String[]) addedConfusables.getPropertyValue(
        "fvcharacter:confusable_characters"));

    assertFalse(confusableList.contains("ā"));
    assertFalse(confusableList.contains("a‾"));

  }

  private void setupOtherDialects(CoreSession session,
      String[] expectedConfusables, String[] expectedUppercaseConfusables) {

    // Other dialect
    DocumentModel alphabet2 = dataCreator.getReference(session, "testAlphabet2");
    DocumentModel alphabet3 = dataCreator.getReference(session, "testAlphabet3");

    // Create a character with confusables
    DocumentModel testConfusable1 =
        createDocument(session,
            session.createDocumentModel(alphabet2.getPathAsString(), "TestChar2", FV_CHARACTER));

    testConfusable1.setPropertyValue("dc:title", "t");
    testConfusable1.setPropertyValue("fva:dialect",
        dataCreator.getReference(session, "testArchive2").getId());
    testConfusable1.setPropertyValue("fvcharacter:upper_case_character", "T");

    testConfusable1.setPropertyValue("fvcharacter:confusable_characters",
        Arrays.copyOfRange(expectedConfusables, 0, 2));
    testConfusable1.setPropertyValue("fvcharacter:upper_case_confusable_characters",
        Arrays.copyOfRange(expectedUppercaseConfusables, 0, 2));
    session.saveDocument(testConfusable1);

    // Create another character with confusables
    DocumentModel testConfusable2 =
        createDocument(session,
            session.createDocumentModel(alphabet3.getPathAsString(), "TestChar3", FV_CHARACTER));

    testConfusable2.setPropertyValue("dc:title", "t");
    testConfusable2.setPropertyValue("fva:dialect",
        dataCreator.getReference(session, "testArchive3").getId());

    testConfusable2.setPropertyValue("fvcharacter:upper_case_character", "T");

    testConfusable2.setPropertyValue("fvcharacter:confusable_characters",
        Arrays.copyOfRange(expectedConfusables, 2, expectedConfusables.length));
    testConfusable2.setPropertyValue("fvcharacter:upper_case_confusable_characters",
        Arrays.copyOfRange(expectedUppercaseConfusables, 2, expectedUppercaseConfusables.length));
    session.saveDocument(testConfusable2);
  }

}
