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

package ca.firstvoices.enrichers;

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;

import ca.firstvoices.operations.dialect.assets.services.RelationsService;
import javax.inject.Inject;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.nuxeo.directory.test.DirectoryFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.io.marshallers.json.AbstractJsonWriterTest;
import org.nuxeo.ecm.core.io.marshallers.json.JsonAssert;
import org.nuxeo.ecm.core.io.marshallers.json.document.DocumentModelJsonWriter;
import org.nuxeo.ecm.core.io.registry.context.RenderingContext;
import org.nuxeo.ecm.core.io.registry.context.RenderingContext.CtxBuilder;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.mockito.MockitoFeature;
import org.nuxeo.runtime.mockito.RuntimeService;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;

@RepositoryConfig(init = DefaultRepositoryInit.class)

@Features({CoreFeature.class, DirectoryFeature.class, MockitoFeature.class})
@Deploy("FirstVoicesNuxeo:OSGI-INF/extensions/ca.firstvoices.nuxeo.enrichers.xml")
@Deploy("FirstVoicesNuxeo.Test:OSGI-INF/extensions/fv-word-enricher-test-data.xml")
public class WordEnricherTest extends
    AbstractJsonWriterTest.Local<DocumentModelJsonWriter, DocumentModel> {

  @Mock
  @RuntimeService
  RelationsService relationsService;

  @Inject
  protected CoreSession session;
  DocumentModel word = null;

  public WordEnricherTest() {
    super(DocumentModelJsonWriter.class, DocumentModel.class);
  }

  @Before
  public void setUpTest() {
    // Create a new FVWord document
    word = session.createDocumentModel("/", "TestWord", FV_WORD);
    word = session.createDocument(word);
  }

  @Test
  public void testPartOfSpeech() throws Exception {

    Assert.assertNotNull(word);

    Mockito.when(relationsService.getRelations(session, word, FV_WORD)).thenReturn(null);

    word.setPropertyValue("fv-word:part_of_speech", "event_activity_verb_like_word");
    session.saveDocument(word);

    RenderingContext ctx = CtxBuilder.enrichDoc(WordEnricher.NAME).properties("fv-word").get();
    JsonAssert json = jsonAssert(word, ctx);

    json = json.has("contextParameters").isObject();
    json.properties(1);

    // Ensure word has been enricher (i.e. contextParamemers -> word is present)
    json = json.has(WordEnricher.NAME).isObject();

    // Ensure word has been enriched (i.e. id converted to label)
    json.has("part_of_speech").isEquals("Event/Activity (Verb-like word)");
  }
}
