package ca.firstvoices.operations;

import static ca.firstvoices.utils.CustomSecurityConstants.LANGUAGE_ADMINS_GROUP;
import static ca.firstvoices.utils.CustomSecurityConstants.RECORDERS_APPROVERS_GROUP;
import static ca.firstvoices.utils.CustomSecurityConstants.RECORDERS_GROUP;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import ca.firstvoices.security.tests.AbstractFVTest;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;
import javax.inject.Inject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.directory.test.DirectoryFeature;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CloseableCoreSession;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.CoreSessionService;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.comment.api.Comment;
import org.nuxeo.ecm.platform.comment.api.CommentImpl;
import org.nuxeo.ecm.platform.comment.api.CommentManager;
import org.nuxeo.ecm.platform.task.Task;
import org.nuxeo.ecm.platform.task.TaskService;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.PartialDeploy;
import org.nuxeo.runtime.test.runner.TargetExtensions;

/**
 * @author david
 */
@RunWith(FeaturesRunner.class)
@Features({CoreFeature.class, AutomationFeature.class, DirectoryFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy("org.nuxeo.ecm.platform.content.template")
@Deploy("org.nuxeo.ecm.automation.core")
@Deploy("org.nuxeo.ecm.platform.task.api")
@Deploy("org.nuxeo.ecm.platform.comment.api")
@Deploy("org.nuxeo.ecm.platform.query.api")
@Deploy("org.nuxeo.ecm.platform.comment")
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
public class GetTasksForUserGroupOperationTest extends AbstractFVTest {

  @Inject
  protected TaskService taskService;
  protected DocumentModel dialect;
  protected DocumentModel word;
  protected NuxeoPrincipal administrator;
  protected NuxeoPrincipal recorder;
  protected NuxeoPrincipal recorderWithApproval;
  protected NuxeoPrincipal languageAdmin;
  @Inject
  AutomationService automationService;
  @Inject
  private CoreSession session;
  @Inject
  CommentManager commentManager;

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
  public void getTasksWithComments() throws OperationException {
    DocumentModel document = getDocument();
    assertNotNull(document);

    ArrayList<String> actors = new ArrayList<>(Arrays.asList(recorder.getName(), RECORDERS_GROUP));
    Calendar calendar = Calendar.getInstance();
    calendar.set(2006, Calendar.JULY, 6);
    calendar.set(Calendar.MILLISECOND, 0);

    taskService.createTask(session, languageAdmin, document, "Test Task Name", "test type",
        "test process id", actors, false, "test directive", "", calendar.getTime(), null, null);
    session.save();

    List<Task> tasks = taskService.getTaskInstances(document, (NuxeoPrincipal) null, session);

    tasks.forEach(task -> {
      Comment comment1 = new CommentImpl();
      comment1.setParentId(task.getId());
      comment1.setAuthor(recorder.getName());
      comment1.setText("Comment 1");
      comment1.setCreationDate(Instant.now());
      comment1.setModificationDate(Instant.now());
      commentManager.createComment(session, comment1);

      Comment comment2 = new CommentImpl();
      comment2.setParentId(task.getId());
      comment2.setAuthor(recorder.getName());
      comment2.setText("Comment 2");
      comment2.setCreationDate(Instant.now());
      comment2.setModificationDate(Instant.now());
      commentManager.createComment(session, comment2);

      session.save();
    });

    assertNotNull(tasks);
    assertEquals(1, tasks.size());

    CloseableCoreSession userSession = Framework.getService(CoreSessionService.class)
        .createCoreSession(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            languageAdmin);

    OperationContext ctx = new OperationContext(session);
    Blob list = (Blob) automationService.run(ctx, GetTasksForUserGroupOperation.ID);

    //    Assert.assertEquals(1, list.size());

    userSession.close();
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
