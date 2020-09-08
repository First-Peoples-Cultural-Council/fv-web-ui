package ca.firstvoices.maintenance.listeners;


import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.contains;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import ca.firstvoices.core.io.utils.SessionUtils;
import ca.firstvoices.maintenance.Constants;
import ca.firstvoices.maintenance.common.CommonConstants;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import java.util.HashMap;
import java.util.Map;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.SystemPrincipal;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventService;
import org.nuxeo.ecm.core.event.impl.InlineEventContext;
import org.nuxeo.ecm.core.event.test.CapturingEventListener;
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
@Deploy({"FirstVoicesMaintenance", "FirstVoicesCoreTests:OSGI-INF/nuxeo.conf.override.xml"})
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-workspace.yaml"})
public class ExecuteRequiredJobsListenerTest extends AbstractTestDataCreatorTest {

  private static CapturingEventListener capturingEvents;

  @Mock
  @RuntimeService
  @Inject
  AutomationService automationService;

  @Captor
  private ArgumentCaptor<Map<String, Object>> argCaptor;

  @Inject
  EventService eventService;

  @Inject
  CoreSession session;

  static final String[] requiredJobsList =
      new String[]{"Test.Operation", "Test.Operation2", "Test.Operation3", "Test.Operation4"};

  DocumentModel dialect = null;

  @BeforeClass
  public static void setupCapturingListener() {
    // Setup capturing listener for subsequent add to required jobs events
    capturingEvents = new CapturingEventListener(
        Constants.EXECUTE_REQUIRED_JOBS_EVENT_ID);
  }

  @Before
  public void setUp() {
    assertNotNull("Required job listener registered", eventService.getEventListener("executeRequiredJobsListener"));
    dialect = session.getDocument(new IdRef(this.dataCreator.getReference("testDialect")));
    dialect.setPropertyValue(CommonConstants.REQUIRED_JOBS_FULL_FIELD, requiredJobsList);

    SessionUtils.saveDocumentWithoutEvents(session, dialect, true, null);
    session.save();
  }

  @Test
  public void testHandleEvent() throws OperationException {
    fireEvent();
    eventService.waitForAsyncCompletion();

    // one event should have been caught
    assertEquals(1, capturingEvents.getCapturedEventCount(Constants.EXECUTE_REQUIRED_JOBS_EVENT_ID));

    // Operations should have been executed exactly the allowed limit
    verify(automationService, times(ExecuteRequiredJobsListener.REQUIRED_JOB_LIMIT))
        .run(anyObject(), contains("Test.Operation"), argCaptor.capture());

    assertEquals("Work phase of job was executed", "work", argCaptor.getValue().get("phase"));
  }

  private void fireEvent() {
    EventContext ctx = new InlineEventContext(new SystemPrincipal(null), new HashMap<>());
    eventService.fireEvent(ctx.newEvent(Constants.EXECUTE_REQUIRED_JOBS_EVENT_ID));
  }
}