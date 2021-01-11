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

package ca.firstvoices.core.io.services;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import ca.firstvoices.tests.mocks.services.MockDialectService;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({PlatformFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.CLASS)
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-workspace.yaml"})
@Deploy({
    "FirstVoicesCoreIO:OSGI-INF/services/assignAncestors-contrib.xml",
    "FirstVoicesCoreIO:OSGI-INF/ca.firstvoices.listeners.xml"
})
public class AssignAncestorsTest extends AbstractTestDataCreatorTest {

  @Inject
  CoreSession session;

  @Inject
  MockDialectService mockDialectService;

  DocumentModel dialect = null;

  DocumentModel language = null;

  DocumentModel languageFamily = null;

  DocumentModelList words = null;

  @Before
  public void initTest() {
    session.save();

    dialect = dataCreator.getReference(session, "testDialect");
    language = dataCreator.getReference(session, "testLanguage");
    languageFamily = dataCreator.getReference(session, "testLanguageFamily");

    words = mockDialectService.generateFVWords(
        session, dialect.getPathAsString(), new String[]{"NewWord1"}, null);
  }

  @Test
  public void assignAncestors() {
    DocumentModel word1 = words.get(0);

    // Listener: Check that the child now has the correct UUIDs of the parent documents in it's properties
    assertEquals("Word should have ID of parent family property", languageFamily.getId(),
        word1.getPropertyValue("fva:family"));
    assertEquals("Word should have ID of parent language property", language.getId(),
        word1.getPropertyValue("fva:language"));
    assertEquals("Word should have ID of parent dialect property", dialect.getId(),
        word1.getPropertyValue("fva:dialect"));

    // Reset values

    word1.setPropertyValue("fva:family", null);
    word1.setPropertyValue("fva:language", null);
    word1.setPropertyValue("fva:dialect", null);

    session.saveDocument(word1);

    // Check that the child document does not have the parent document UUIDs in it's properties
    assertNull("Word should have no ID for parent family property",
        word1.getPropertyValue("fva:family"));
    assertNull("Word should have no ID for parent language property",
        word1.getPropertyValue("fva:language"));
    assertNull("Word should have no ID for parent dialect property",
        word1.getPropertyValue("fva:dialect"));

    // Run the service against the new child document
    AssignAncestorsService assignAncestorsService = Framework.getService(AssignAncestorsService.class);
    assignAncestorsService.assignAncestors(word1);

    session.saveDocument(word1);

    // Check that the values are set again via the service
    assertEquals("Word should have ID of parent family property", languageFamily.getId(),
        word1.getPropertyValue("fva:family"));
    assertEquals("Word should have ID of parent language property", language.getId(),
        word1.getPropertyValue("fva:language"));
    assertEquals("Word should have ID of parent dialect property", dialect.getId(),
        word1.getPropertyValue("fva:dialect"));
  }
}
