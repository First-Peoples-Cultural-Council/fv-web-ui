package ca.firstvoices.operations;

import ca.firstvoices.testUtil.MockStructureTestUtil;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.junit.Before;
import org.junit.Test;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.*;
import javax.inject.Inject;
import static org.junit.Assert.*;
import org.junit.After;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;

@RunWith(FeaturesRunner.class)
@Features({AutomationFeature.class, PlatformFeature.class, RuntimeFeature.class})

@Deploy({"FirstVoicesData",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.operations.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.services.xml",
    "org.nuxeo.ecm.platform",
    "org.nuxeo.ecm.platform.types.core",
    "org.nuxeo.ecm.platform.publisher.core",
    "org.nuxeo.ecm.platform.picture.core",
    "org.nuxeo.ecm.platform.rendition.core",
    "org.nuxeo.ecm.platform.video.core",
    "org.nuxeo.ecm.platform.audio.core",
    "org.nuxeo.ecm.automation.scripting",
    "FirstVoicesNuxeoPublisher.tests:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.schemas.ProxySchema.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.services.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.listeners.ProxyPublisherListener.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.nativeorder.services.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",
})
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})

public class CheckUnpublishedChangesTest extends MockStructureTestUtil {

  @Inject
  private CoreSession session;

  @Inject
  private AutomationService automationService;

  private DocumentModel dialectDoc;

  @Before
  public void setUp() throws Exception {
    assertNotNull("Should have a valid session", session);
    session.removeChildren(session.getRootDocument().getRef());
    session.save();

    dialectDoc = createDialectTree(session);
    dialectDoc.followTransition("Enable");
    session.saveDocument(dialectDoc);
  }

  @After
  public void cleanup() {
    session.removeChildren(session.getRootDocument().getRef());
    session.save();
  }

  @Test
  public void checkUnpublishedChangesTest() throws OperationException {
    OperationContext ctx = new OperationContext(session);

    /*
            Should return false as doc is not published yet.
         */
    ctx.setInput(dialectDoc);
    assertFalse((Boolean) automationService.run(ctx, CheckUnpublishedChanges.ID));

        /*
            Should still return false because the doc is not published.
         */
    dialectDoc.setPropertyValue("dc:title", "WordOneTest");
    dialectDoc = session.saveDocument(dialectDoc);
    ctx.setInput(dialectDoc);
    assertFalse((Boolean) automationService.run(ctx, CheckUnpublishedChanges.ID));

        /*
            Should return false because there are no changes since the publish.
         */
    dialectDoc.followTransition("Publish");
    dialectDoc = session.saveDocument(dialectDoc);
    ctx.setInput(dialectDoc);
    assertFalse((Boolean) automationService.run(ctx, CheckUnpublishedChanges.ID));

        /*
            Should return true because there are changes that have not been published.
         */
    dialectDoc.setPropertyValue("dc:title", "WordOneTestTwo");
    dialectDoc = session.saveDocument(dialectDoc);
    ctx.setInput(dialectDoc);
    assertTrue((Boolean) automationService.run(ctx, CheckUnpublishedChanges.ID));

        /*
            Should now return false because the changes have been published.
         */
    dialectDoc.followTransition("Republish");
    dialectDoc = session.saveDocument(dialectDoc);
    ctx.setInput(dialectDoc);
    assertFalse((Boolean) automationService.run(ctx, CheckUnpublishedChanges.ID));
  }

}
