package ca.firstvoices.maintenance.listeners;


import static ca.firstvoices.data.lifecycle.Constants.REPUBLISH_STATE;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import ca.firstvoices.maintenance.Constants;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import java.util.HashMap;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.AbstractSession;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.SystemPrincipal;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventService;
import org.nuxeo.ecm.core.event.impl.InlineEventContext;
import org.nuxeo.ecm.core.event.test.CapturingEventListener;
import org.nuxeo.ecm.core.model.Document;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.mockito.MockitoFeature;
import org.nuxeo.runtime.mockito.RuntimeService;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({CoreFeature.class, AutomationFeature.class, MockitoFeature.class})
@RepositoryConfig(cleanup = Granularity.METHOD)
@Deploy({"FirstVoicesCoreIO","FirstVoicesData", "org.nuxeo.ecm.platform",
    "org.nuxeo.ecm.platform.commandline.executor", "org.nuxeo.ecm.platform.picture.core",
    "org.nuxeo.ecm.platform.rendition.core", "org.nuxeo.ecm.automation.scripting",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.services.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.templates.factories.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.services.xml",
    "FirstVoicesCoreTests:OSGI-INF/nuxeo.conf.override.xml",
    "org.nuxeo.ecm.platform.publisher.core",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.services.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.services.xml",
    "FirstVoicesMaintenance",
    "FirstVoicesCoreTests:OSGI-INF/nuxeo.conf.override.xml"})
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-workspace.yaml"})
public class ExecuteGlobalJobsListenerTest extends AbstractTestDataCreatorTest {

  private static CapturingEventListener capturingEvents;

  @Mock
  @RuntimeService
  @Inject
  FirstVoicesPublisherService fvPublisherService;

  @Inject
  EventService eventService;

  @Inject
  CoreSession session;

  DocumentModel dialect = null;

  @BeforeClass
  public static void setupCapturingListener() {
    // Setup capturing listener for subsequent add to required jobs events
    capturingEvents = new CapturingEventListener(
        Constants.EXECUTE_GLOBAL_JOBS_EVENT_ID);

    unregisterEvents(new String[]{
        "ancestryAssignmentListener",
        "ProxyPublishedListener",
        "bulkLifeCycleChangeListener"
    });
  }

  @Before
  public void setUp() {
    assertNotNull("Global job listener registered", eventService.getEventListener("executeGlobalJobsListener"));
    dialect = dataCreator.getReference(session, "testDialect");

    // Simulate dialect being stuck in republish
    // Do so by updating low level dialect
    Document lowLevelDoc =
        ((AbstractSession) session).getSession().getDocumentByUUID(dialect.getId());
    lowLevelDoc.setCurrentLifeCycleState(REPUBLISH_STATE);

    session.save();
  }

  @Test
  public void testHandleEvent() {
    fireEvent();
    eventService.waitForAsyncCompletion();

    // one event should have been caught
    assertEquals(1, capturingEvents.getCapturedEventCount(Constants.EXECUTE_GLOBAL_JOBS_EVENT_ID));

    // Republish should have been executed for the dialect
    verify(fvPublisherService, times(1))
        .republish(dialect);
  }

  private void fireEvent() {
    EventContext ctx = new InlineEventContext(new SystemPrincipal(null), new HashMap<>());
    eventService.fireEvent(ctx.newEvent(Constants.EXECUTE_GLOBAL_JOBS_EVENT_ID));
  }
}