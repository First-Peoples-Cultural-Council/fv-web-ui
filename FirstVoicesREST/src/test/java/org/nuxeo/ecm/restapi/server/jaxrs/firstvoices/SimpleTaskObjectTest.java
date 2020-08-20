package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Calendar;
import java.util.List;
import java.util.concurrent.TimeUnit;
import javax.inject.Inject;
import javax.security.auth.login.LoginException;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.client.jaxrs.impl.HttpAutomationClient;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.ecm.platform.task.Task;
import org.nuxeo.ecm.platform.task.TaskService;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.platform.usermanager.exceptions.UserAlreadyExistsException;
import org.nuxeo.ecm.restapi.test.BaseTest;
import org.nuxeo.ecm.restapi.test.RestServerFeature;
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
@Deploy("FirstVoicesData:OSGI-INF/ca.firstvoices.listeners.xml")
@Deploy("FirstVoicesData:OSGI-INF/ca.firstvoices.operations.xml")
@Deploy("FirstVoicesData:OSGI-INF/ca.firstvoices.io.xml")
@Deploy("FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml")
@Deploy({"FirstVoicesREST", "FirstVoicesRESTPageProviders", "FirstVoicesNuxeoPublisher"})
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

  private String word1Id;
  private String word2Id;
  private String taskId1;

  DocumentModel workspaceDialect;

  public void createDialectTree(CoreSession session) throws InterruptedException, OperationException {
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

    // Create one word
    DocumentModel word1 = session.createDocument(
        session.createDocumentModel(
            "/FV/Workspaces/Data/Family/Language/Dialect/Dictionary",
            "TestWord",
            "FVWord")
    );
    word1.setPropertyValue("dc:title", "Word1");
    session.saveDocument(word1);
    word1Id = word1.getId();

    // Create another word
    DocumentModel word2 = session.createDocument(
        session.createDocumentModel(
            "/FV/Workspaces/Data/Family/Language/Dialect/Dictionary",
            "TestWord2",
            "FVWord")
    );
    word2.setPropertyValue("dc:title", "Word2");
    session.saveDocument(word2);
    word2Id = word2.getId();

    session.save();

    // User operation to create groups for dialect
    OperationContext ctx = new OperationContext(session);
    ctx.setInput(workspaceDialect);
    automationService.run(ctx, "FVDialectRegularDocumentPermissions");
  }

  public void createUsers(CoreSession session) throws InterruptedException, LoginException {
    NuxeoPrincipal recorder_user = createUser(session,"recorder_user", "dialect_recorders");
    assertNotNull(recorder_user);

    // Create task
    ArrayList<String> actors = new ArrayList<>(Arrays.asList("administrators", "dialect_language_administrators"));
    Calendar calendar = Calendar.getInstance();
    calendar.set(2006, Calendar.JULY, 6);
    calendar.set(Calendar.MILLISECOND, 0);

    List<Task> tasks = taskService.createTask(session, recorder_user, session.getDocument(new IdRef(word1Id)), "Test Task Name", "test type",
        "test process id", actors, false, "test directive", "", calendar.getTime(), null, null);


    tasks.addAll(taskService.createTask(session, recorder_user, session.getDocument(new IdRef(word2Id)), "Test Task Name 2", "test type",
        "test process id", actors, false, "test directive", "", calendar.getTime(), null, null));
    taskId1 = tasks.get(0).getId();

    session.save();

    TransactionHelper.commitOrRollbackTransaction();
    Framework.getService(WorkManager.class).awaitCompletion(10L, TimeUnit.SECONDS);
  }

  @Before
  public void setUp() throws InterruptedException, OperationException, LoginException {
    createDialectTree(session);
    createUsers(session);
  }

  @Test
  public void testSimpleTaskDetails() throws IOException {
    final String url = String.format("http://localhost:%s/api/v1/simpleTask/%s",
        servletContainerFeature.getPort(),
        taskId1);

    validateRESTResponse(url, (node, response) -> {
      assertEquals("Unexpected status code", 200, response.getStatusLine().getStatusCode());
      assertEquals(taskId1, node.get("uid").asText());
    });
  }

  @Test
  public void testSimpleTaskList() throws IOException {
    final String url = String.format(
        "http://localhost:%s/api/v1/simpleTask",
        servletContainerFeature.getPort()
    );

    validateRESTResponse(url, (node, response) -> {
      assertEquals("Unexpected status code", 200, response.getStatusLine().getStatusCode());
      assertEquals("Expect two results", 2, node.get("entries").size());
    });
  }



  protected NuxeoPrincipal createUser(CoreSession session, String username, String group) throws LoginException {
    DocumentModel user = userManager.getBareUserModel();
    user.setPropertyValue("user:username", username);
    user.setPropertyValue("user:groups", new String[] { group });
    try {
      userManager.createUser(user);
    } catch (UserAlreadyExistsException e) {
      // do nothing
    } finally {
      session.save();
    }
    return userManager.getPrincipal(username);
  }

  private void validateRESTResponse(String url, RESTRequestValidator validator) throws IOException {
    HttpClient client = new HttpAutomationClient(url).http();
    HttpGet request = new HttpGet(url);
    String auth = Base64.getEncoder()
        .encodeToString("Administrator:Administrator".getBytes(Charset.defaultCharset()));
    request.setHeader("Authorization", "Basic " + auth);
    HttpResponse response = client.execute(request);
    String body = IOUtils.toString(
        response.getEntity().getContent(),
        StandardCharsets.UTF_8.name()
    );
    JsonNode node = mapper.readTree(body);
    validator.validateResponse(node, response);
  }

  interface RESTRequestValidator {
    void validateResponse(JsonNode node, HttpResponse response);
  }
}
