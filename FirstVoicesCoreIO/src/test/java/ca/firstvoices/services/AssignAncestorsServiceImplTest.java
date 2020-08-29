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

import static org.junit.Assert.assertNotNull;

import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import javax.inject.Inject;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({PlatformFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.CLASS)
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-language.yaml"})
@Ignore
public class AssignAncestorsServiceImplTest extends AbstractTestDataCreatorTest {

  @Inject
  CoreSession session;

  @Test
  public void assignAncestors() {

    DocumentModel dialect = session.getDocument(new IdRef(this.dataCreator.getReference("testArchive")));
    DocumentModel language = session.getDocument(new IdRef(this.dataCreator.getReference("testLanguage")));
    DocumentModel languageFamily = session.getDocument(new IdRef(this.dataCreator.getReference("testLanguageFamily")));

    // Get the DocumentModels for each of the parent documents
    assertNotNull("Language family cannot be null", languageFamily);
    assertNotNull("Language cannot be null", language);
    assertNotNull("Dialect cannot be null", dialect);

    // Create a new child document
    //    DocumentModel TestWord = createDocument(session,
    //        session.createDocumentModel("/FV/Family/Language/Dialect", "TestLink", FV_LINKS));
    //
    //    // Check that the child document does not have the parent document UUIDs in it's properties
    //    assertNull("Word should have no ID for parent family property",
    //        TestWord.getPropertyValue("fva:family"));
    //    assertNull("Word should have no ID for parent language property",
    //        TestWord.getPropertyValue("fva:language"));
    //    assertNull("Word should have no ID for parent dialect property",
    //        TestWord.getPropertyValue("fva:dialect"));
    //
    //    // Run the service against the new child document
    //    assignAncestorsService.assignAncestors(TestWord);
    //
    //    // Check that the child now has the correct UUIDs of the parent documents in it's properties
    //    Assert.assertEquals("Word should have ID of parent family property", languageFamily.getId(),
    //        TestWord.getPropertyValue("fva:family"));
    //    Assert.assertEquals("Word should have ID of parent language property", language.getId(),
    //        TestWord.getPropertyValue("fva:language"));
    //    Assert.assertEquals("Word should have ID of parent dialect property", dialect.getId(),
    //        TestWord.getPropertyValue("fva:dialect"));
  }
}
