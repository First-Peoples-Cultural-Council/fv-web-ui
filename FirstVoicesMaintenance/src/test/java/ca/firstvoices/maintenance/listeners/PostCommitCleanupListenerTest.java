package ca.firstvoices.maintenance.listeners;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyLong;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import java.io.Serializable;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.api.impl.DocumentModelImpl;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventService;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.query.api.AbstractPageProvider;
import org.nuxeo.ecm.platform.query.api.PageProviderService;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.mockito.MockitoFeature;
import org.nuxeo.runtime.mockito.RuntimeService;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.transaction.TransactionHelper;

@RunWith(FeaturesRunner.class)
@Features({CoreFeature.class, AutomationFeature.class, MockitoFeature.class})
@RepositoryConfig(cleanup = Granularity.METHOD)
@Deploy({
    "FirstVoicesMaintenance",
    "FirstVoicesCoreTests:OSGI-INF/nuxeo.conf.override.xml"
})
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-language.yaml"})
public class PostCommitCleanupListenerTest extends AbstractTestDataCreatorTest {

  private static final String eventName = "postCommitCleanupListener";
  // This is a fake task that would be returned by the page provider
  MockDocumentModel fakeTask;
  @Mock
  @RuntimeService
  PageProviderService pageProviderService;

  @Inject
  CoreSession session;

  @Inject
  EventService eventService;

  @Inject
  UserManager userManager;

  DocumentModel word = null;

  private static CoreSession getNonAdminCoreSession() {
    CoreSession session = mock(CoreSession.class);
    UserManager userManager = Framework.getService(UserManager.class);
    when(session.getPrincipal()).thenReturn(userManager.getPrincipal("testUser"));
    return session;
  }

  @Before
  public void setUp() {
    assertNotNull("Post commit cleanup listener registered",
        eventService.getEventListener(eventName));
    word = session.getDocument(new IdRef(this.dataCreator.getReference("testWord1")));

    // Create a regular user
    DocumentModel userModel = userManager.getBareUserModel();
    String schemaName = userManager.getUserSchemaName();
    userModel.setProperty(schemaName, "username", "testUser");
    userManager.createUser(userModel);
    session.save();

    // Return a fake page provider defined above instead of the actual page provider
    // Note: Need to use DoReturn for generics
    // See: https://dzone.com/articles/mocking-method-with-wildcard-generic-return-type
    doReturn(new FakePageProvider<DocumentModelList>()).when(pageProviderService)
        .getPageProvider(eq(PostCommitCleanupListener.GET_ALL_OPEN_TASKS_FOR_DOCUMENT), eq(null),
            eq(null), anyLong(), any(), eq(word.getId()));

    fakeTask = new MockDocumentModel("TaskDoc");
  }

  @Test
  public void shouldHandleNonAdminEvent() {
    // Ensure transition starts off as not run
    assertFalse(fakeTask.transitionRan);

    // Fire event as non-system admin user
    EventContext ctx = new DocumentEventContext(getNonAdminCoreSession(),
        getNonAdminCoreSession().getPrincipal(), word);
    eventService.fireEvent(ctx.newEvent(DocumentEventTypes.DOCUMENT_UPDATED));

    // Commit and wait for event to complete
    TransactionHelper.commitOrRollbackTransaction();
    eventService.waitForAsyncCompletion();

    // Ensure transition ran
    assertTrue(fakeTask.transitionRan);
  }

  @Test
  public void shouldNotHandleNonCoreTypeEvent() {
    // Ensure transition starts off as not run
    assertFalse(fakeTask.transitionRan);

    // Fire event as non-system admin user on dialect
    DocumentModel dialect = session
        .getDocument(new IdRef(this.dataCreator.getReference("testArchive")));

    EventContext ctx = new DocumentEventContext(session, session.getPrincipal(), dialect);
    eventService.fireEvent(ctx.newEvent(DocumentEventTypes.DOCUMENT_UPDATED));

    // Commit and wait for event to complete
    TransactionHelper.commitOrRollbackTransaction();
    eventService.waitForAsyncCompletion();

    // Ensure transition is still not run
    assertFalse(fakeTask.transitionRan);
  }

  @Test
  public void shouldNotHandleAdminEvent() {
    // Ensure transition starts off as not run
    assertFalse(fakeTask.transitionRan);

    // Fire event as non-system admin user
    EventContext ctx = new DocumentEventContext(session, session.getPrincipal(), word);
    eventService.fireEvent(ctx.newEvent(DocumentEventTypes.DOCUMENT_UPDATED));

    // Commit and wait for event to complete
    TransactionHelper.commitOrRollbackTransaction();
    eventService.waitForAsyncCompletion();

    // Ensure transition is still not run
    assertFalse(fakeTask.transitionRan);
  }

  /**
   * Fake document model to mimic transitions
   */
  public static class MockDocumentModel extends DocumentModelImpl {

    private static final long serialVersionUID = 1L;
    protected String uid;
    protected boolean transitionRan;

    public MockDocumentModel(String uid) {
      this.uid = uid;
      this.transitionRan = false;
    }

    @Override
    public boolean followTransition(final String transition) {
      transitionRan = true;
      return true;
    }

    @Override
    public Collection<String> getAllowedStateTransitions() {
      return Collections.singletonList("cancel");
    }
  }

  /**
   * Fake page provider to mimic `GET_ALL_OPEN_TASKS_FOR_DOCUMENT`
   *
   * @param <T>
   */
  public class FakePageProvider<T extends Serializable> extends AbstractPageProvider<T> {

    private static final long serialVersionUID = 1L;

    @Override
    @SuppressWarnings("unchecked")
    public List<T> getCurrentPage() {
      DocumentModelList list = new DocumentModelListImpl();
      list.add(fakeTask);

      return (List<T>) list;
    }

  }

}