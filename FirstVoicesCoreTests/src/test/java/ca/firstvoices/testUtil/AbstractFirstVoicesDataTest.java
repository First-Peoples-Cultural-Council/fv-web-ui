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

package ca.firstvoices.testUtil;

import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import javax.inject.Inject;
import org.junit.Before;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.usermanager.UserManager;

@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-language.yaml"})
public abstract class AbstractFirstVoicesDataTest extends AbstractTestDataCreatorTest {

  protected DocumentModel languageFamily;
  protected DocumentModel language;
  protected DocumentModel dialect;
  protected DocumentModel dictionary;
  protected DocumentModel alphabet;

  @Inject protected AutomationService automationService;

  @Inject protected UserManager userManager;

  @Inject protected CoreSession session;

  @Before
  public void resolveReferences() {
    languageFamily = dataCreator.getReference(session, "testLanguageFamily");
    language = dataCreator.getReference(session, "testLanguage");
    dialect = dataCreator.getReference(session, "testArchive");
    dictionary = dataCreator.getReference(session, "testDictionary");
    alphabet = dataCreator.getReference(session, "testAlphabet");
  }


}
