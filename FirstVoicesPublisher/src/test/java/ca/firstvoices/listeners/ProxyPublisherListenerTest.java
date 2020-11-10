package ca.firstvoices.listeners;

import static ca.firstvoices.data.lifecycle.Constants.ENABLED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISH_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.REPUBLISH_STATE;
import static ca.firstvoices.data.lifecycle.Constants.REPUBLISH_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.UNPUBLISH_TRANSITION;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import ca.firstvoices.data.schemas.DialectTypesConstants;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import ca.firstvoices.tests.mocks.services.MockDialectService;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import javax.inject.Inject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.LifeCycleConstants;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventBundle;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventService;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.core.event.impl.EventBundleImpl;
import org.nuxeo.ecm.core.event.impl.EventListenerDescriptor;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({CoreFeature.class})
@RepositoryConfig(cleanup = Granularity.METHOD)
@Deploy({"org.nuxeo.ecm.platform.publisher.core", "FirstVoicesCoreIO",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.services.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.listeners.xml",
    "FirstVoicesNuxeoPublisher.tests:OSGI-INF/extensions/fv-publisher-disable-listeners.xml"})
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-workspace.yaml"})
public class ProxyPublisherListenerTest extends AbstractTestDataCreatorTest {

  private static final String EVENT_NAME = "lifecycle_transition_event";

  @Inject CoreSession session;

  @Inject EventService eventService;

  /*
     Note: You should be able to mock publisher service as per
     org.nuxeo.ecm.platform.dublincore.listener.DublinCoreListenerTest
     to verify interactions, however not sure why that is not working.
     Something to look into with future versions of Mockito / Nuxeo

  //@Mock
  //@RuntimeService
  */
  @Inject protected FirstVoicesPublisherService fvPublisherService;

  @Inject protected MockDialectService mockDialectService;

  DocumentModel dialect = null;

  @Before
  public void setup() {
    EventListenerDescriptor eventListenerDescriptor =
        eventService.getEventListener("ProxyPublishedListener");

    assertNotNull("Proxy publisher listener registered", eventListenerDescriptor);

    // Testing for a dialect is enough as we are only focusing on ensuring the listener
    // fires and makes it to the right service method. Service methods are tested in the
    // PublisherServiceTest class. Ideally this would be done with a mock (see note above)
    dialect = dataCreator.getReference(session, "testDialect");
  }

  @After
  public void tearDown() {
    // Remove all proxies
    DocumentModelList allProxies = session.query("SELECT * FROM Document WHERE ecm:isProxy = 1");

    for (DocumentModel proxyDoc : allProxies) {
      if (session.exists(proxyDoc.getRef())) {
        session.removeDocument(proxyDoc.getRef());
      }
    }
  }

  @Test
  public void shouldHandlePublishTransitionEvent() {
    fireEvent(session, PUBLISH_TRANSITION, ENABLED_STATE, PUBLISHED_STATE, dialect);
    assertNotNull(fvPublisherService.getPublication(session, dialect.getRef()));
  }

  @Test
  public void shouldHandleUnpublishTransitionEvent() {
    fireEvent(session, UNPUBLISH_TRANSITION, PUBLISHED_STATE, ENABLED_STATE, dialect);
    assertNull(fvPublisherService.getPublication(session, dialect.getRef()));
  }

  @Test
  public void shouldHandleRepublishTransitionEvent() {
    // Follow transition (won't affect children)
    dialect.followTransition(PUBLISH_TRANSITION);
    // Create proxy for dialect so that children can be acted on
    fvPublisherService.publish(session, dialect);

    DocumentModel dialectChild =
        session.getChild(dialect.getRef(), DialectTypesConstants.FV_DICTIONARY_NAME);

    // Should start off as not published
    assertNotEquals(PUBLISHED_STATE,
        session.getDocument(dialectChild.getRef()).getCurrentLifeCycleState());

    fireEvent(session, REPUBLISH_TRANSITION, PUBLISHED_STATE, REPUBLISH_STATE, dialectChild);

    // After republishing, state should be set to publish
    assertEquals(PUBLISHED_STATE,
        session.getDocument(dialectChild.getRef()).getCurrentLifeCycleState());
  }

  private void fireEvent(CoreSession session,
                         String transition,
                         String from,
                         String to,
                         DocumentModel doc) {
    Map<String, Serializable> eventOptions = new HashMap<>();
    eventOptions.put(LifeCycleConstants.TRANSTION_EVENT_OPTION_FROM, from);
    eventOptions.put(LifeCycleConstants.TRANSTION_EVENT_OPTION_TO, to);
    eventOptions.put(LifeCycleConstants.TRANSTION_EVENT_OPTION_TRANSITION, transition);

    EventContext ctx = new DocumentEventContext(session, session.getPrincipal(), doc);
    ctx.setProperties(eventOptions);

    Event event = ctx.newEvent(EVENT_NAME);
    EventBundle eventBundle = new EventBundleImpl();
    eventBundle.push(event);

    eventService.fireEventBundleSync(eventBundle);
  }
}
