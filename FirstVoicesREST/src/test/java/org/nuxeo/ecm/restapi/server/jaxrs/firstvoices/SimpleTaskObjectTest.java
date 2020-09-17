package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import static ca.firstvoices.data.lifecycle.Constants.ENABLED_STATE;
import static ca.firstvoices.visibility.Constants.MEMBERS;
import static ca.firstvoices.visibility.Constants.PUBLIC;
import static ca.firstvoices.visibility.Constants.TEAM;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import com.fasterxml.jackson.databind.JsonNode;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.WebResource.Builder;
import com.sun.jersey.core.util.MultivaluedMapImpl;
import java.io.IOException;
import java.util.Collections;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import javax.inject.Inject;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.ecm.platform.task.Task;
import org.nuxeo.ecm.platform.task.TaskConstants;
import org.nuxeo.ecm.platform.task.TaskService;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.platform.usermanager.exceptions.UserAlreadyExistsException;
import org.nuxeo.ecm.restapi.test.BaseTest;
import org.nuxeo.ecm.restapi.test.RestServerFeature;
import org.nuxeo.jaxrs.test.CloseableClientResponse;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.PartialDeploy;
import org.nuxeo.runtime.test.runner.TargetExtensions;
import org.nuxeo.runtime.transaction.TransactionHelper;

@RunWith(FeaturesRunner.class)
@Features({RestServerFeature.class, PlatformFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)

@Deploy("org.nuxeo.binary.metadata")
@Deploy("org.nuxeo.ecm.platform.url.core")
@Deploy("org.nuxeo.ecm.platform.types.api")
@Deploy("org.nuxeo.ecm.platform.types.core")
@Deploy("org.nuxeo.ecm.platform.webapp.types")
@Deploy("org.nuxeo.ecm.platform.publisher.core")
@Deploy("org.nuxeo.ecm.platform.task.core")
@Deploy("org.nuxeo.ecm.platform.routing.core")
@Deploy("org.nuxeo.ecm.platform.audit:OSGI-INF/core-type-contrib.xml")
@Deploy("org.nuxeo.ecm.platform.userworkspace.api")
@Deploy("org.nuxeo.ecm.platform.userworkspace.types")
@Deploy("org.nuxeo.ecm.platform.userworkspace.core")
@Deploy("FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.auth.xml")
@Deploy("FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml")
@Deploy("FirstVoicesOperations:OSGI-INF/dialect/visibility/visibility-services.xml")
@Deploy({"FirstVoicesCoreIO", "FirstVoicesREST", "FirstVoicesRESTPageProviders",
    "FirstVoicesNuxeoPublisher"})
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})
public class SimpleTaskObjectTest extends BaseTest {

  @Inject
  protected TaskService taskService;

  @Inject
  protected AutomationService automationService;

  @Inject
  protected CoreSession session;

  @Inject
  protected UserManager userManager;
  DocumentModel workspaceDialect;
  private DocumentModelList words = new DocumentModelListImpl();
  private NuxeoPrincipal recorder_user;
  private NuxeoPrincipal la_1_user;
  private NuxeoPrincipal la_2_user;

  public void createDialectTree(CoreSession session)
      throws OperationException {
    session.removeChildren(session.getRootDocument().getRef());
    session.save();

    session.createDocument(session.createDocumentModel("/", "FV", "Domain"));
    session.createDocument(session.createDocumentModel("/FV", "Workspaces", "WorkspaceRoot"));
    session.createDocument(session.createDocumentModel("/FV/Workspaces", "Data", "Workspace"));

    DocumentModel workspaceLanguageFamily = session.createDocument(
        session.createDocumentModel("/FV/Workspaces/Data", "Family", "FVLanguageFamily")
    );

    session.saveDocument(workspaceLanguageFamily);

    session.createDocument(
        session.createDocumentModel("/FV/Workspaces/Data/Family", "Language", "FVLanguage")
    );

    workspaceDialect = session.createDocument(
        session.createDocumentModel("/FV/Workspaces/Data/Family/Language", "Dialect", "FVDialect")
    );
    workspaceDialect = session.saveDocument(workspaceDialect);

    // User operation to create groups for dialect
    OperationContext ctx = new OperationContext(session);
    ctx.setInput(workspaceDialect);
    automationService.run(ctx, "FVDialectRegularDocumentPermissions");
  }

  public void createUsers(CoreSession session) throws InterruptedException {
    recorder_user = createUser(session, "recorder_user", "dialect_recorders");
    assertNotNull(recorder_user);

    la_1_user = createUser(session, "language_admin_1", "dialect_language_administrators");
    la_2_user = createUser(session, "language_admin_2", "dialect_language_administrators");
    assertNotNull(la_1_user);
    assertNotNull(la_2_user);
    session.save();

    TransactionHelper.commitOrRollbackTransaction();

    Framework.getService(WorkManager.class).awaitCompletion(10L, TimeUnit.SECONDS);
  }

  public void createWords(CoreSession session, int wordLimit) {

    // Always start a transaction if one isn't available for the test
    if (!TransactionHelper.isTransactionActive()) {
      TransactionHelper.startTransaction();
    }

    for (int i = 0; i < wordLimit; ++i) {
      // Create one word
      DocumentModel word = session.createDocument(
          session.createDocumentModel(
              "/FV/Workspaces/Data/Family/Language/Dialect/Dictionary",
              "TestWord" + i,
              "FVWord"));

      word.setPropertyValue("dc:title", "Word" + i);
      session.saveDocument(word);

      words.add(word);
    }

    session.save();
    TransactionHelper.commitOrRollbackTransaction();
  }

  public void createTasks(CoreSession session) {

    // Always start a transaction if one isn't available for the test
    if (!TransactionHelper.isTransactionActive()) {
      TransactionHelper.startTransaction();
    }

    for (DocumentModel word : words) {
      assertEquals(Status.CREATED.getStatusCode(), requestReview(word.getId()).getStatus());
    }

    session.save();
    TransactionHelper.commitOrRollbackTransaction();
  }

  @Before
  public void setUp() throws InterruptedException, OperationException {
    createDialectTree(session);
    createUsers(session);

    createWords(session, 5);
    assertEquals(5, words.size());

    createTasks(session);

    // Always start a transaction if one isn't available for the test
    if (!TransactionHelper.isTransactionActive()) {
      TransactionHelper.startTransaction();
    }

    assertEquals(5, taskService.getAllCurrentTaskInstances(session, null).size());
  }

  @Test
  public void testSimpleTaskDetails() {
    // TODO: Test using language admin accounts. Currently getting a 403 error
    this.service = getServiceFor("Administrator", "Administrator");
    Optional<Task> task1 = taskService.getAllCurrentTaskInstances(session, null).stream().findAny();
    assertTrue(task1.isPresent());

    try (CloseableClientResponse response = getResponse(RequestType.GET,
        String.format("simpleTask/%s", task1.get().getId()))) {
      assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
      JsonNode jsonNode = mapper.readTree(response.getEntityInputStream());
      assertEquals(task1.get().getId(), jsonNode.get("uid").asText());
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  @Test
  public void testSimpleTaskList() throws IOException {
    // TODO: Test using language admin accounts. Currently getting a 403 error
    this.service = getServiceFor("Administrator", "Administrator");

    try (CloseableClientResponse response = getResponse(RequestType.GET, "simpleTask")) {
      assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
      JsonNode jsonNode = mapper.readTree(response.getEntityInputStream());
      assertEquals(words.size(), jsonNode.get("entries").size());

    }
  }

  @Test
  public void testSimpleTaskListExcludeDelegatedTasks() throws IOException {
    // TODO: Test using language admin accounts. Currently getting a 403 error
    this.service = getServiceFor("Administrator", "Administrator");

    Optional<Task> task1 = taskService.getAllCurrentTaskInstances(session, null).stream().findAny();
    assertTrue(task1.isPresent());

    // Delegate first task
    taskService
        .delegateTask(session, task1.get().getId(), Collections.singletonList("recorder_test"), "");
    session.save();
    TransactionHelper.commitOrRollbackTransaction();

    try (CloseableClientResponse response = getResponse(RequestType.GET, "simpleTask")) {
      assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
      JsonNode jsonNode = mapper.readTree(response.getEntityInputStream());
      assertEquals(words.size() - 1, jsonNode.get("entries").size());
    }

    MultivaluedMap<String, String> queryParams = new MultivaluedMapImpl();
    queryParams.putSingle("excludeDelegatedTasks", "false");

    try (CloseableClientResponse response = getResponse(RequestType.GET, "simpleTask",
        queryParams)) {
      assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
      JsonNode jsonNode = mapper.readTree(response.getEntityInputStream());
      assertEquals(words.size(), jsonNode.get("entries").size());
    }
  }

  @Test
  public void testApproval() {
    Optional<Task> task1 = taskService.getAllCurrentTaskInstances(session, null).stream().findAny();
    assertTrue(task1.isPresent());

    // TODO: Test using language admin accounts. Currently getting a 403 error
    WebResource wr = getServiceFor(
        getRestApiUrl() + String.format("simpleTask/%s/approve", task1.get().getId()),
        "Administrator", "Administrator");

    // Attempt unsupported visibility (`birds`)
    try (CloseableClientResponse response = CloseableClientResponse
        .of(wr.queryParam("requestedVisibility", "birds").getRequestBuilder()
            .put(ClientResponse.class))) {
      assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    // Try with supported visibility (`members`)
    try (CloseableClientResponse response = CloseableClientResponse
        .of(wr.queryParam("requestedVisibility", MEMBERS).getRequestBuilder()
            .put(ClientResponse.class))) {
      assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());

      // Commit changes to session so we get task changes
      session.save();

      Task taskAfterChange = taskService.getTask(session, task1.get().getId());

      // Confirm task is ended
      assertEquals(TaskConstants.TASK_ENDED_LIFE_CYCLE_STATE,
          taskAfterChange.getDocument().getCurrentLifeCycleState());

      // Confirm comments are available
      String expectedComment = String.format("Approved with a visibility change from '%s' to '%s'",
          TEAM, MEMBERS);
      assertTrue(taskAfterChange.getComments().stream()
          .anyMatch((comment) -> expectedComment.equals(comment.getText())));

      // Confirm word is in the right state
      DocumentModel word1 = session
          .getDocument(new IdRef(taskAfterChange.getTargetDocumentsIds().get(0)));
      assertEquals(ENABLED_STATE, word1.getCurrentLifeCycleState());
    }
  }

  @Test
  public void testRequestChanges() {
    Optional<Task> task1 = taskService.getAllCurrentTaskInstances(session, null).stream().findAny();
    assertTrue(task1.isPresent());

    // TODO: Test using language admin accounts. Currently getting a 403 error
    WebResource wr = getServiceFor(
        getRestApiUrl() + String.format("simpleTask/%s/requestChanges", task1.get().getId()),
        "Administrator", "Administrator");

    Builder builder = wr.queryParam("sendEmail", "1").accept(MediaType.TEXT_PLAIN)
        .type(MediaType.APPLICATION_JSON);

    String expectedComment = "Please make these changes.";

    String body = "{"
        + "\"approvedVisibility\": \"" + PUBLIC + "\","
        + "\"comment\": \"" + expectedComment + "\""
        + "}";

    try (CloseableClientResponse response = CloseableClientResponse
        .of(builder.post(ClientResponse.class, body))) {
      assertEquals(Status.OK.getStatusCode(), response.getStatus());

      // Commit changes to session so we get task changes
      session.save();

      Task taskAfterChange = taskService.getTask(session, task1.get().getId());

      // Confirm task is delegated to recorder group
      assertTrue(taskAfterChange.getDelegatedActors().contains("dialect_recorders"));

      // Confirm correct comment is available
      assertTrue(taskAfterChange.getComments().stream().anyMatch(
          comment -> expectedComment.equals(comment.getText())));

      // Confirm approved visibility is set in nt:directive
      assertEquals(PUBLIC, taskAfterChange.getDirective());
    }
  }

  @Test
  public void testIgnore() {
    Optional<Task> task1 = taskService.getAllCurrentTaskInstances(session, null).stream().findAny();
    assertTrue(task1.isPresent());

    // TODO: Test using language admin accounts. Currently getting a 403 error
    this.service = getServiceFor("Administrator", "Administrator");

    try (CloseableClientResponse response = getResponse(RequestType.PUT,
        String.format("simpleTask/%s/ignore", task1.get().getId()))) {
      assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());

      // Commit changes to session so we get task changes
      session.save();

      Task taskAfterChange = taskService.getTask(session, task1.get().getId());

      // Confirm task is ended
      assertEquals(TaskConstants.TASK_ENDED_LIFE_CYCLE_STATE,
          taskAfterChange.getDocument().getCurrentLifeCycleState());
    }
  }

  @Test
  public void testRequestReview() {
    Optional<Task> task1 = taskService.getAllCurrentTaskInstances(session, null).stream().findAny();
    assertTrue(task1.isPresent());

    String wordId = task1.get().getTargetDocumentsIds().stream().findFirst().orElse(null);
    assertNotNull(wordId);

    // We already have a task created, so first response should be CONFLICT
    assertEquals(Response.Status.CONFLICT.getStatusCode(), requestReview(wordId).getStatus());

    // Delete task and try again
    taskService.deleteTask(session, task1.get().getId());
    TransactionHelper.commitOrRollbackTransaction();

    // Start a new transaction for next portion of test
    TransactionHelper.startTransaction();

    assertEquals(Response.Status.CREATED.getStatusCode(), requestReview(wordId).getStatus());

    // Get newly created task
    DocumentModel word = session.getDocument(new IdRef(wordId));
    Task newTask = taskService.getTaskInstances(word, (NuxeoPrincipal) null, session).stream()
        .findFirst().orElse(null);

    // Check requested visibility
    assertNotNull(newTask);
    assertEquals(TEAM, newTask.getDirective());
    assertTrue(newTask.getComments().stream()
        .anyMatch(comment -> comment.getText().equals("Recorder says hello. Please review.")));
  }

  private CloseableClientResponse requestReview(String wordId) {

    // TODO: Create tasks using the recorder accounts
    WebResource wr = getServiceFor(
        getRestApiUrl() + "simpleTask/requestReview",
        "Administrator", "Administrator");

    Builder builder = wr.accept(MediaType.TEXT_PLAIN).type(MediaType.APPLICATION_JSON);

    String comment = "Recorder says hello. Please review.";

    String body = "{"
        + "\"docId\": \"" + wordId + "\","
        + "\"requestedVisibility\": \"" + TEAM + "\","
        + "\"comment\": \"" + comment + "\""
        + "}";

    try (CloseableClientResponse response = CloseableClientResponse
        .of(builder.post(ClientResponse.class, body))) {
      return response;
    }
  }

  protected NuxeoPrincipal createUser(CoreSession session, String username, String group) {
    DocumentModel user = userManager.getBareUserModel();
    user.setPropertyValue("user:username", username);
    user.setPropertyValue("user:groups", new String[]{group});
    try {
      userManager.createUser(user);
    } catch (UserAlreadyExistsException e) {
      // do nothing
    } finally {
      session.save();
    }
    return userManager.getPrincipal(username);
  }

}
