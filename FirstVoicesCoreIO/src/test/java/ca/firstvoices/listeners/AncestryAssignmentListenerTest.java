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

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import javax.inject.Inject;
import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;

@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-language.yaml"})
@Ignore
public class AncestryAssignmentListenerTest extends AbstractTestDataCreatorTest {

  @Inject
  CoreSession session;

  @Test
  public void testListener() {
    DocumentModel dictionary = session.getChild(new IdRef(this.dataCreator.getReference("testArchive")), "Dictionary");

    DocumentModel word1 = session
            .createDocumentModel(dictionary.getPathAsString(), "Word 1", FV_WORD);

    word1.setPropertyValue("dc:title", word1.getName());

    session.createDocument(word1);
    session.save();

    assertNotNull(word1);

    // Ensure fva values are populated
    assertEquals("Word should have ID of parent family property", this.dataCreator.getReference("testLanguageFamily"),
        word1.getPropertyValue("fva:family"));
    assertEquals("Word should have ID of parent language property", this.dataCreator.getReference("testLanguage"),
        word1.getPropertyValue("fva:language"));
    Assert.assertEquals("Word should have ID of parent dialect property", this.dataCreator.getReference("testArchive"),
        word1.getPropertyValue("fva:dialect"));
  }
}