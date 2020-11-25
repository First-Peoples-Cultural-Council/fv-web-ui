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

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;
import static ca.firstvoices.testUtil.helpers.DocumentTestHelpers.createDocument;
import static org.junit.Assert.assertEquals;
import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import ca.firstvoices.testUtil.FirstVoicesDataFeature;
import javax.inject.Inject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({FirstVoicesDataFeature.class})
@Deploy({"FirstVoicesCharacters:OSGI-INF/services/sanitizeDocument-contrib.xml"})
public class SanitizeDocumentServiceImplTest extends AbstractFirstVoicesDataTest {

  @Inject protected SanitizeDocumentService sanitizeDocumentService;

  @Test
  public void trimWhitespaceTest() {

    DocumentModel testWord = createDocument(session,
        session.createDocumentModel(dictionary.getPathAsString(), " Test Word  ", FV_WORD));
    DocumentModel testPhrase = createDocument(session,
        session.createDocumentModel(dictionary.getPathAsString(), " Test Phrase  ", FV_PHRASE));

    sanitizeDocumentService.sanitizeDocument(session, testWord);
    sanitizeDocumentService.sanitizeDocument(session, testPhrase);

    assertEquals("Test Word", testWord.getTitle());
    assertEquals("Test Phrase", testPhrase.getTitle());

  }

}
