package ca.firstvoices;

import ca.firstvoices.nuxeo.enrichers.WordEnricher;
import org.junit.Before;
import org.junit.Test;
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
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;

import javax.inject.Inject;

@RepositoryConfig(init = DefaultRepositoryInit.class)

@Features({ CoreFeature.class, DirectoryFeature.class})

@Deploy("FirstVoicesNuxeo:OSGI-INF/extensions/ca.firstvoices.nuxeo.enrichers.xml")
@Deploy("FirstVoicesNuxeo.Test:OSGI-INF/extensions/fv-word-enricher-test-data.xml")
public class WordEnricherTest extends AbstractJsonWriterTest.Local<DocumentModelJsonWriter, DocumentModel>{

  public WordEnricherTest(){
    super(DocumentModelJsonWriter.class, DocumentModel.class);
  }

  @Inject
  private EnricherTestUtil testUtil;

  @Inject
  protected CoreSession session;

  DocumentModel word = null;

  @Before
  public void setUpTest() {
    // Create a new FVWord document
    word = session.createDocumentModel("/", "TestWord", "FVWord");
    word = session.createDocument(word);
  }

  @Test
  public void testPartOfSpeech() throws Exception {

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