package ca.firstvoices;

import ca.firstvoices.nuxeo.enrichers.UnpublishedChangesEnricher;
import ca.firstvoices.EnricherTestUtil;
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
import org.nuxeo.runtime.test.runner.*;

import javax.inject.Inject;

import static org.junit.Assert.assertNotNull;


@RepositoryConfig(init = DefaultRepositoryInit.class)
@RunWith(FeaturesRunner.class)
@Features({ CoreFeature.class, DirectoryFeature.class, PlatformFeature.class, RuntimeFeature.class})

@Deploy("FirstVoicesNuxeo:OSGI-INF/extensions/ca.firstvoices.nuxeo.enrichers.xml")
@Deploy("FirstVoicesNuxeo.Test:OSGI-INF/extensions/fv-word-enricher-test-data.xml")

@Deploy({"FirstVoicesData",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.operations.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.services.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.schemas.ProxySchema.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.services.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.listeners.ProxyPublisherListener.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.nativeorder.services.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",
    "FirstVoicesNuxeo:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml",
    "org.nuxeo.ecm.platform",
    "org.nuxeo.ecm.platform.types.core",
    "org.nuxeo.ecm.platform.publisher.core",
    "org.nuxeo.ecm.platform.picture.core",
    "org.nuxeo.ecm.platform.rendition.core",
    "org.nuxeo.ecm.platform.video.core",
    "org.nuxeo.ecm.platform.audio.core",
    "org.nuxeo.ecm.automation.scripting",
})
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})

public class UnpublishedChangesEnricherTest extends AbstractJsonWriterTest .Local<DocumentModelJsonWriter, DocumentModel> {

    public UnpublishedChangesEnricherTest() {
        super(DocumentModelJsonWriter.class, DocumentModel.class);
    }
    
    @Inject
    private EnricherTestUtil testUtil;
    
    @Inject
    protected CoreSession session;

    DocumentModel dialectDoc;

    @Before
    public void setUpTest() throws Exception {
        /*
            Ensure a session exists, remove any existing docs, and create a fresh dialect tree.
         */
        assertNotNull("Should have a valid session", session);
        session.removeChildren(session.getRootDocument().getRef());
        session.save();
        
        dialectDoc = testUtil.createDialectTree(session);
        dialectDoc.followTransition("Enable");
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

        /*
            Run the enricher on the document and check that it returns the proper value.
         */
        RenderingContext ctx = RenderingContext.CtxBuilder.enrichDoc(UnpublishedChangesEnricher.NAME).properties("unpublished_changes_exist").get();
        JsonAssert json = jsonAssert(dialectDoc, ctx);
        json = json.has("contextParameters").isObject();
        json.properties(1);
        json = json.has(UnpublishedChangesEnricher.NAME).isObject();
        json.has("unpublished_changes_exist").isEquals(false);

        /*
            Publish the document and make sure the enricher still returns the correct value.
         */
        dialectDoc.followTransition("Publish");
        ctx = RenderingContext.CtxBuilder.enrichDoc(UnpublishedChangesEnricher.NAME).properties("unpublished_changes_exist").get();
        json = jsonAssert(dialectDoc, ctx);
        json = json.has("contextParameters").isObject();
        json.properties(1);
        json = json.has(UnpublishedChangesEnricher.NAME).isObject();
        json.has("unpublished_changes_exist").isEquals(false);

        /*
            Modify the workspaces document and make sure that the enricher returns unpublished_changes_exist = true
         */
        dialectDoc.setPropertyValue("dc:title", "WordOneTestTwo");
        dialectDoc = session.saveDocument(dialectDoc);
        ctx = RenderingContext.CtxBuilder.enrichDoc(UnpublishedChangesEnricher.NAME).properties("unpublished_changes_exist").get();
        json = jsonAssert(dialectDoc, ctx);
        json = json.has("contextParameters").isObject();
        json.properties(1);
        json = json.has(UnpublishedChangesEnricher.NAME).isObject();
        json.has("unpublished_changes_exist").isEquals(true);

        /*
            Republish the document and make sure the enricher now returns unpublished_changes_exist = false
         */
        dialectDoc.followTransition("Republish");
        ctx = RenderingContext.CtxBuilder.enrichDoc(UnpublishedChangesEnricher.NAME).properties("unpublished_changes_exist").get();
        json = jsonAssert(dialectDoc, ctx);
        json = json.has("contextParameters").isObject();
        json.properties(1);
        json = json.has(UnpublishedChangesEnricher.NAME).isObject();
        json.has("unpublished_changes_exist").isEquals(false);
    }
}
