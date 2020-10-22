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

import static ca.firstvoices.data.lifecycle.Constants.ENABLE_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISH_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.REPUBLISH_TRANSITION;
import static org.junit.Assert.assertNotNull;

import ca.firstvoices.nuxeo.enrichers.UnpublishedChangesEnricher;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import javax.inject.Inject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.directory.test.DirectoryFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.io.marshallers.json.AbstractJsonWriterTest;
import org.nuxeo.ecm.core.io.marshallers.json.JsonAssert;
import org.nuxeo.ecm.core.io.marshallers.json.document.DocumentModelJsonWriter;
import org.nuxeo.ecm.core.io.registry.context.RenderingContext;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.PartialDeploy;
import org.nuxeo.runtime.test.runner.RuntimeFeature;
import org.nuxeo.runtime.test.runner.TargetExtensions;


@RepositoryConfig(init = DefaultRepositoryInit.class)
@RunWith(FeaturesRunner.class)
@Features({CoreFeature.class, DirectoryFeature.class, PlatformFeature.class, RuntimeFeature.class})

@Deploy("FirstVoicesNuxeo:OSGI-INF/extensions/ca.firstvoices.nuxeo.enrichers.xml")
@Deploy("FirstVoicesNuxeo.Test:OSGI-INF/extensions/fv-word-enricher-test-data.xml")

@Deploy({"FirstVoicesData",
    "FirstVoicesCoreIO",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.operations.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.services.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.schemas.ProxySchema.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.services.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.listeners.xml",
    "FirstVoicesCharacters:OSGI-INF/services/customOrderCompute-contrib.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",
    "FirstVoicesNuxeo:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml", "org.nuxeo.ecm.platform",
    "org.nuxeo.ecm.platform.types.core", "org.nuxeo.ecm.platform.publisher.core",
    "org.nuxeo.ecm.platform.picture.core", "org.nuxeo.ecm.platform.rendition.core",
    "org.nuxeo.ecm.platform.video.core", "org.nuxeo.ecm.platform.audio.core",
    "org.nuxeo.ecm.automation.scripting",})
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})

public class UnpublishedChangesEnricherTest extends
    AbstractJsonWriterTest.Local<DocumentModelJsonWriter, DocumentModel> {

  @Inject
  protected CoreSession session;

  DocumentModel dialectDoc;

  @Inject
  protected EnricherTestUtil testUtil;

  @Inject
  protected FirstVoicesPublisherService fvPublisherService;

  public UnpublishedChangesEnricherTest() {
    super(DocumentModelJsonWriter.class, DocumentModel.class);
  }

  @Before
  public void setUpTest() {
        /*
            Ensure a session exists, remove any existing docs, and create a fresh dialect tree.
         */
    assertNotNull("Should have a valid session", session);
    session.removeChildren(session.getRootDocument().getRef());
    session.save();

    dialectDoc = testUtil.createDialectTree(session);
    dialectDoc.followTransition(ENABLE_TRANSITION);
  }

  @After
  public void cleanup() {
        /*
            Cleanup all created docs.
         */
    session.removeChildren(session.getRootDocument().getRef());
    session.save();
  }

  @Test
  public void testUnpublishedChanges() throws Exception {

    assertNotNull(dialectDoc);

        /*
            Run the enricher on the document and check that it returns the proper value.
         */
    RenderingContext ctx = RenderingContext.CtxBuilder.enrichDoc(UnpublishedChangesEnricher.NAME)
        .properties("unpublished_changes_exist").get();
    JsonAssert json = jsonAssert(dialectDoc, ctx);
    json = json.has("contextParameters").isObject();
    json.properties(1);
    json = json.has(UnpublishedChangesEnricher.NAME).isObject();
    json.has("unpublished_changes_exist").isEquals(false);

        /*
            Publish the document and make sure the enricher still returns the correct value.
         */
    dialectDoc.followTransition(PUBLISH_TRANSITION);
    fvPublisherService.publish(session, dialectDoc);

    ctx = RenderingContext.CtxBuilder.enrichDoc(UnpublishedChangesEnricher.NAME)
        .properties("unpublished_changes_exist").get();
    json = jsonAssert(dialectDoc, ctx);
    json = json.has("contextParameters").isObject();
    json.properties(1);
    json = json.has(UnpublishedChangesEnricher.NAME).isObject();
    json.has("unpublished_changes_exist").isEquals(false);

        /*
            Modify the workspaces document and make sure that the enricher returns
            unpublished_changes_exist = true
         */
    dialectDoc.setPropertyValue("dc:title", "WordOneTestTwo");
    dialectDoc = session.saveDocument(dialectDoc);
    ctx = RenderingContext.CtxBuilder.enrichDoc(UnpublishedChangesEnricher.NAME)
        .properties("unpublished_changes_exist").get();
    json = jsonAssert(dialectDoc, ctx);
    json = json.has("contextParameters").isObject();
    json.properties(1);
    json = json.has(UnpublishedChangesEnricher.NAME).isObject();
    json.has("unpublished_changes_exist").isEquals(true);

        /*
            Republish the document and make sure the enricher now returns
            unpublished_changes_exist = false
         */
    dialectDoc.followTransition(REPUBLISH_TRANSITION);
    fvPublisherService.publish(session, dialectDoc);

    ctx = RenderingContext.CtxBuilder.enrichDoc(UnpublishedChangesEnricher.NAME)
        .properties("unpublished_changes_exist").get();
    json = jsonAssert(dialectDoc, ctx);
    json = json.has("contextParameters").isObject();
    json.properties(1);
    json = json.has(UnpublishedChangesEnricher.NAME).isObject();
    json.has("unpublished_changes_exist").isEquals(false);
  }
}
