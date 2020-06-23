package ca.firstvoices.services;

import static ca.firstvoices.utils.CustomSecurityConstants.LANGUAGE_ADMINS_GROUP;
import static ca.firstvoices.utils.CustomSecurityConstants.RECORDERS_APPROVERS_GROUP;
import static ca.firstvoices.utils.CustomSecurityConstants.RECORDERS_GROUP;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import ca.firstvoices.security.tests.AbstractFVTest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;
import javax.inject.Inject;
import javax.security.auth.login.LoginException;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.directory.test.DirectoryFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.login.test.ClientLoginFeature;
import org.nuxeo.ecm.platform.task.Task;
import org.nuxeo.ecm.platform.task.TaskService;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.PartialDeploy;
import org.nuxeo.runtime.test.runner.TargetExtensions;

/**
 * @author david
 */
@RunWith(FeaturesRunner.class)
@Features({CoreFeature.class, DirectoryFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy("org.nuxeo.ecm.platform.content.template")
@Deploy("org.nuxeo.ecm.automation.core")
@Deploy("org.nuxeo.ecm.platform.task.api")
@Deploy("org.nuxeo.ecm.platform.task.core")
@Deploy("org.nuxeo.ecm.automation.server")
@Deploy("org.nuxeo.ecm.platform.usermanager")
@Deploy("org.nuxeo.ecm.platform.query.api")
@Deploy("org.nuxeo.ecm.platform.task.core")
@Deploy("org.nuxeo.ecm.platform.test:test-usermanagerimpl/directory-config.xml")
@Deploy({"FirstVoicesSecurity.tests:userservice-config.xml",
    "FVUserRegistration:OSGI-INF/extensions/ca.firstvoices.auth.xml",
    "FVUserRegistration:OSGI-INF/extensions/ca.firstvoices.user.xml",
    "org.nuxeo.ecm.user.registration",
    "org.nuxeo.ecm.user.registration.web:OSGI-INF/user-registration-contrib.xml",
    "org.nuxeo.ecm.user.invite",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.securitypolicies.groups.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.securitypolicies.lifecycle.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.services.gettasksforuser.xml",
    "FirstVoicesSecurity.tests:OSGI-INF.extensions/ca.firstvoices.fakestudio.xml"})
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})
public class GetTasksServiceTest extends AbstractFVTest {

  @Inject
  private GetTasksService service;

  @Inject
  private CoreSession session;

  @Inject
  protected TaskService taskService;

  @Inject
  ClientLoginFeature login;

  protected DocumentModel dialect;
  protected DocumentModel word;

  protected NuxeoPrincipal administrator;

  protected NuxeoPrincipal recorder;

  protected NuxeoPrincipal recorderWithApproval;

  protected NuxeoPrincipal languageAdmin;

  @Before
  public void setUp() {
    session.removeChildren(session.getRootDocument().getRef());

    createNewGroup(LANGUAGE_ADMINS_GROUP, "Language Administrators");
    createNewGroup(RECORDERS_GROUP, "Recorders");
    createNewGroup(RECORDERS_APPROVERS_GROUP, "Recorders With Approval");

    DocumentModel members = userManager.getGroupModel("members");
    Object existingSubGroups = members.getProperty("group", "subGroups");
    String existingSubGroupsString = existingSubGroups.toString();
    existingSubGroupsString = existingSubGroupsString
        .substring(1, existingSubGroupsString.length() - 1);
    List<String> newSubGroups;
    if (existingSubGroupsString.length() == 0) {
      newSubGroups = new ArrayList<>();
    } else {
      newSubGroups = new ArrayList<>(Arrays.asList(existingSubGroupsString.split(", ")));
    }
    newSubGroups.add(LANGUAGE_ADMINS_GROUP);
    newSubGroups.add(RECORDERS_GROUP);
    newSubGroups.add(RECORDERS_APPROVERS_GROUP);
    List<String> noDuplicates = newSubGroups.stream().distinct().collect(Collectors.toList());
    members.setProperty("group", "subGroups", noDuplicates);
    userManager.updateGroup(members);

    session.createDocument(session.createDocumentModel("/", "FV", "Domain"));
    session.createDocument(session.createDocumentModel("/FV/", "Workspaces", "WorkspaceRoot"));
    session.createDocument(session.createDocumentModel("/FV/Workspaces", "Data", "Workspace"));
    session.createDocument(
        session.createDocumentModel("/FV/Workspaces/Data", "Family", "FVLanguageFamily"));
    session.createDocument(
        session.createDocumentModel("/FV/Workspaces/Data/Family", "Language", "FVLanguage"));
    session.createDocument(
        session.createDocumentModel("/FV/Workspaces/Data/Family/Language", "Dialect", "FVDialect"));
    dialect = session.createDocument(session
        .createDocumentModel("/FV/Workspaces/Data/Family/Language/Dialect", "Dictionary",
            "FVDialect"));
    word = createWordorPhrase("Word", "FVWord", "fva:dialect", dialect.getId());
    session.save();

    createUserWithPassword("member@firstvoices.com", "Member", "Member", RECORDERS_GROUP);
    createUserWithPassword("member2@firstvoices.com", "Member2", "Member2",
        RECORDERS_APPROVERS_GROUP);
    createUserWithPassword("member3@firstvoices.com", "Member3", "Member3", LANGUAGE_ADMINS_GROUP);

    recorder = userManager.getPrincipal("member@firstvoices.com");
    assertNotNull(recorder);

    recorderWithApproval = userManager.getPrincipal("member2@firstvoices.com");
    assertNotNull(recorderWithApproval);

    languageAdmin = userManager.getPrincipal("member3@firstvoices.com");
    assertNotNull(languageAdmin);

    administrator = userManager.getPrincipal("Administrator");
    assertNotNull(administrator);
  }


  @After
  public void tearDown() {
    session.removeChildren(session.getRootDocument().getRef());
    session.save();
  }

  protected DocumentModel createWordorPhrase(String value, String typeName, String pv, String v) {
    DocumentModel document = session
        .createDocumentModel("/FV/Workspaces/Data/Family/Language/Dialect/Dictionary", value,
            typeName);
    if (pv != null) {
      document.setPropertyValue(pv, v);
    }

    document.setPropertyValue("dc:title", document.getName());
    DocumentModel newDoc = session.createDocument(document);
    session.save();

    return newDoc;
  }

  @Test
  public void testGetTaskForRecorder() throws LoginException {
    DocumentModel document = getDocument();
    assertNotNull(document);

    ArrayList<String> actors = new ArrayList<>(Arrays.asList(recorder.getName(), RECORDERS_GROUP));
    Calendar calendar = Calendar.getInstance();
    calendar.set(2006, Calendar.JULY, 6);
    calendar.set(Calendar.MILLISECOND, 0);

    taskService.createTask(session, languageAdmin, document, "Test Task Name", "test type",
        "test process id", actors, false, "test directive", "test comment", calendar.getTime(),
        null, null);
    session.save();
    List<Task> tasks = taskService.getTaskInstances(document, (NuxeoPrincipal) null, session);

    assertNotNull(tasks);
    assertEquals(1, tasks.size());

    login.login(recorder.getName());
    List<DocumentModel> list = service.getTasksForUser(session, recorder);
    Assert.assertEquals(1, list.size());
  }

  @Test
  public void testGetTaskForRecorderWithApproval() throws LoginException {
    DocumentModel document = getDocument();
    assertNotNull(document);

    ArrayList<String> actors = new ArrayList<>(
        Arrays.asList(recorder.getName(), RECORDERS_APPROVERS_GROUP));
    Calendar calendar = Calendar.getInstance();
    calendar.set(2006, Calendar.JULY, 6);
    calendar.set(Calendar.MILLISECOND, 0);

    taskService.createTask(session, languageAdmin, document, "Test Task Name", "test type",
        "test process id", actors, false, "test directive", "test comment", calendar.getTime(),
        null, null);
    session.save();
    List<Task> tasks = taskService.getTaskInstances(document, (NuxeoPrincipal) null, session);

    assertNotNull(tasks);
    assertEquals(1, tasks.size());

    login.login(recorderWithApproval.getName());
    List<DocumentModel> list = service.getTasksForUser(session, recorderWithApproval);
    Assert.assertEquals(1, list.size());
  }

  @Test
  public void testGetTaskForLanguageAdmin() throws LoginException {
    DocumentModel document = getDocument();
    assertNotNull(document);

    ArrayList<String> actors = new ArrayList<>(
        Arrays.asList(recorder.getName(), LANGUAGE_ADMINS_GROUP));
    Calendar calendar = Calendar.getInstance();
    calendar.set(2006, Calendar.JULY, 6);
    calendar.set(Calendar.MILLISECOND, 0);

    taskService.createTask(session, languageAdmin, document, "Test Task Name", "test type",
        "test process id", actors, false, "test directive", "test comment", calendar.getTime(),
        null, null);
    session.save();
    List<Task> tasks = taskService.getTaskInstances(document, (NuxeoPrincipal) null, session);

    assertNotNull(tasks);
    assertEquals(1, tasks.size());

    login.login(languageAdmin.getName());
    List<DocumentModel> list = service.getTasksForUser(session, languageAdmin);
    Assert.assertEquals(1, list.size());
  }

  protected DocumentModel getDocument() {
    DocumentModel model = session
        .createDocumentModel(session.getRootDocument().getPathAsString(), "1", "File");
    DocumentModel doc = session.createDocument(model);
    assertNotNull(doc);

    session.saveDocument(doc);
    session.save();
    return doc;
  }

}
