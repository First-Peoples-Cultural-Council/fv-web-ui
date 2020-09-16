package ca.firstvoices.maintenance.listeners;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import ca.firstvoices.core.io.utils.PropertyUtils;
import ca.firstvoices.core.io.utils.SessionUtils;
import ca.firstvoices.maintenance.Constants;
import ca.firstvoices.maintenance.common.CommonConstants;
import ca.firstvoices.maintenance.common.RequiredJobsUtils;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import javax.inject.Inject;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventService;
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
public class ManageRequiredJobsListenerTest extends AbstractTestDataCreatorTest {

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
      new String[]{"Test.Operation"};

  DocumentModel dialect = null;

  @BeforeClass
  public static void setupCapturingListener() {
    // Setup capturing listener for subsequent add / execute required jobs events
    capturingEvents = new CapturingEventListener(
        CommonConstants.ADD_TO_REQUIRED_JOBS_EVENT_ID,
        CommonConstants.REMOVE_FROM_REQUIRED_JOBS_EVENT_ID,
        Constants.EXECUTE_REQUIRED_JOBS_QUEUED,
        Constants.EXECUTE_REQUIRED_JOBS_COMPLETE);
  }

  @Before
  public void setUp() {
    assertNotNull("Manage required job listener registered", eventService.getEventListener("manageRequiredJobsListener"));

    dialect = session.getDocument(new IdRef(this.dataCreator.getReference("testDialect")));
    dialect.setPropertyValue(CommonConstants.REQUIRED_JOBS_FULL_FIELD, requiredJobsList);

    SessionUtils.saveDocumentWithoutEvents(session, dialect, true, null);
  }

  @After
  public void tearDown() {
    capturingEvents.clear();
  }

  @Test
  public void shouldHandleAddJob() {
    String operationToAdd = "Test.Operation2";
    RequiredJobsUtils.addToRequiredJobs(dialect, operationToAdd);
    eventService.waitForAsyncCompletion();

    // one event should have been caught for adding
    assertEquals(1, capturingEvents.getCapturedEventCount(CommonConstants.ADD_TO_REQUIRED_JOBS_EVENT_ID));

    // event for adding should include operation to add
    HashSet<String> jobIds = getJobIds(capturingEvents, CommonConstants.ADD_TO_REQUIRED_JOBS_EVENT_ID);
    assertTrue("Add to required jobs event has operation to add", jobIds.contains(operationToAdd));

    // one event should have been caught once job queued
    assertEquals(1, capturingEvents.getCapturedEventCount(Constants.EXECUTE_REQUIRED_JOBS_QUEUED));
  }

  @Test
  public void shouldHandleRemoveJob() {
    String operationToRemove = "Test.Operation";

    List<String> requiredJobs = PropertyUtils
        .getValuesAsList(dialect, CommonConstants.REQUIRED_JOBS_FULL_FIELD);

    assertTrue("Required jobs contains before event " + operationToRemove, requiredJobs.contains(operationToRemove));

    RequiredJobsUtils.removeFromRequiredJobs(dialect, operationToRemove, true);
    eventService.waitForAsyncCompletion();

    // one event should have been caught for removing
    assertEquals(1, capturingEvents.getCapturedEventCount(CommonConstants.REMOVE_FROM_REQUIRED_JOBS_EVENT_ID));

    // event for removing should include operation to be removed
    HashSet<String> jobIds = getJobIds(capturingEvents, CommonConstants.REMOVE_FROM_REQUIRED_JOBS_EVENT_ID);
    assertTrue("Remove from required jobs does not have operation", jobIds.contains(operationToRemove));

    // one event should have been caught once job is complete
    assertEquals(1, capturingEvents.getCapturedEventCount(Constants.EXECUTE_REQUIRED_JOBS_COMPLETE));
  }

  @SuppressWarnings("unchecked")
  private HashSet<String> getJobIds(CapturingEventListener capturingEvents, String eventName) {
    if (capturingEvents.getLastCapturedEvent(eventName).isPresent()) {
      EventContext eventContext = capturingEvents.getLastCapturedEvent(eventName).get().getContext();
      return (HashSet<String>) eventContext.getProperty(ManageRequiredJobsListener.JOB_IDS_PROP);
    } else {
      return new HashSet<String>();
    }
  }
}