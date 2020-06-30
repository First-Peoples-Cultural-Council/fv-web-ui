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
import static org.junit.Assert.assertNotNull;

import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.core.api.DocumentModel;

public class AddConfusablesServiceImplTest extends AbstractFirstVoicesDataTest {

  @Test
  public void addConfusablesTest() {
    String[] confusablesToAdd = {"￠", "ȼ"};

    assertNotNull("Dialect cannot be null", dialect);
    String path = dialect.getPathAsString();

    DocumentModel testConfusable = createDocument(session,
        session.createDocumentModel(path, "TestChar", FV_CHARACTER));
    testConfusable.setPropertyValue("dc:title", "¢");
    session.saveDocument(testConfusable);

    DocumentModel updated = session.saveDocument(addConfusablesService
        .updateConfusableCharacters(session, testConfusable, dialect, "¢", confusablesToAdd));

    String[] property = (String[]) updated.getPropertyValue("fvcharacter:confusable_characters");

    Assert.assertTrue(property[0].equals(confusablesToAdd[0]));
    Assert.assertTrue(property[1].equals(confusablesToAdd[1]));

    DocumentModel testConfusableUppercase = createDocument(session,
        session.createDocumentModel(path, "TestChar", FV_CHARACTER));
    testConfusableUppercase.setPropertyValue("fvcharacter:upper_case_character", "¢");

    session.saveDocument(testConfusableUppercase);

    updated = session.saveDocument(addConfusablesService
        .updateConfusableCharacters(session, testConfusableUppercase, dialect, "¢",
            confusablesToAdd));

    String[] uProperty = (String[]) updated
        .getPropertyValue("fvcharacter:upper_case_confusable_characters");

    Assert.assertTrue(uProperty[0].equals(confusablesToAdd[0]));
    Assert.assertTrue(uProperty[1].equals(confusablesToAdd[1]));
  }

}
