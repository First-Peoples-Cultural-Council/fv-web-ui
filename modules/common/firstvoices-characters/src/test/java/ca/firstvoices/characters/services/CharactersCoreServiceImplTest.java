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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import ca.firstvoices.characters.CharactersTestUtils;
import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import ca.firstvoices.testUtil.FirstVoicesDataFeature;
import java.util.ArrayList;
import org.junit.Before;
import org.junit.BeforeClass;
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
    "FirstVoicesCoreTests:OSGI-INF/nuxeo.conf.override.xml"
})
public class CharactersCoreServiceImplTest extends AbstractFirstVoicesDataTest {

  private final String[] orderedAlphabet =
      {"aa", "a", "b", "d", "e", "ee", "g", "g̱", "gw", "h", "hl", "i", "ii", "j", "k", "k'", "ḵ",
          "ḵ'", "kw", "kw'", "l", "Ì", "m", "m̓", "n", "n̓", "o", "oo", "p", "p'", "s", "t", "t'",
          "tl'", "ts", "ts'", "u", "uu", "w", "w̓", "x", "x̱", "xw", "y", "y̓", "'"};

  int alphabetSize = 0;

  CharactersCoreService cs = Framework
      .getService(CharactersCoreService.class);

  @BeforeClass
  public static void unregisterEvents() {
    // Remove ancestry listener
    // To help isolate testing to the service
    unregisterEvents(new String[]{"ancestryAssignmentListener"});
  }

  @Before
  public void setUp() {
    assertNotNull("Should have a valid session", session);

    DocumentModelList characters =
        CharactersTestUtils.createOrderedAlphabet(session, orderedAlphabet, alphabet.getPathAsString());

    alphabetSize = characters.size();

    // aa should be "calculated" as last
    DocumentModel firstChar = characters.get(0);
    firstChar.setPropertyValue("fv:custom_order", "z");
    session.saveDocument(firstChar);

    // ' should be "calculated" as first
    DocumentModel lastChar = characters.get(alphabetSize - 1);
    lastChar.setPropertyValue("fv:custom_order", "a");
    session.saveDocument(lastChar);

    session.save();
  }

  @Test
  public void canGetAlphabet() {
    DocumentModel alphabetFromDialect = cs.getAlphabet(session, dialect);
    DocumentModel alphabetFromDictionary = cs.getAlphabet(session, dictionary);

    assertEquals(alphabet.getId(), alphabetFromDialect.getId());
    assertEquals(alphabet.getId(), alphabetFromDictionary.getId());
  }

  @Test
  public void canGetCharactersWithDefaultOrder() {
    int alphabetSize = orderedAlphabet.length;

    DocumentModelList charactersInOrder = cs.getCharacters(session, alphabet);
    assertNotNull(charactersInOrder);

    // Note: `null` values show up first in fv:custom_order
    // so check between the last two values
    assertEquals(orderedAlphabet[alphabetSize - 1],
        charactersInOrder.get(alphabetSize - 2).getTitle());
    assertEquals(orderedAlphabet[0],
        charactersInOrder.get(alphabetSize - 1).getTitle());
  }

  @Test
  public void canGetCharactersWithArbitraryOrder() {
    DocumentModelList charactersInOrder = cs.getCharacters(session, alphabet,
        "dc:title");
    assertNotNull(charactersInOrder);

    // `'` should be 1st
    assertEquals(orderedAlphabet[alphabetSize-1],
        charactersInOrder.get(0).getTitle());

    // `b` should be 3rd
    assertEquals(orderedAlphabet[2],
        charactersInOrder.get(3).getTitle());
  }

  @Test
  public void canGetCustomOrderValues() {
    ArrayList<String> characterValues = cs.getCustomOrderValues(session, alphabet);
    assertNotNull(characterValues);

    assertTrue(characterValues.contains("a"));
    assertTrue(characterValues.contains("z"));
  }

  @Test
  public void shouldNotReturnTrashedChar() {
    DocumentModelList chars = cs.getCharacters(session, alphabet);
    session.removeDocument(chars.get(5).getRef());

    assertEquals(alphabetSize, chars.size());

    session.save();

    DocumentModelList charsAfterDelete = cs.getCharacters(session, alphabet);

    assertEquals(alphabetSize - 1, charsAfterDelete.size());
  }
}
