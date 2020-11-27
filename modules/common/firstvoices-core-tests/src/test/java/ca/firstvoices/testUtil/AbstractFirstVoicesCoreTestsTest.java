package ca.firstvoices.testUtil;

import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE_FAMILY;
import static ca.firstvoices.security.utils.CustomSecurityConstants.LANGUAGE_ADMINS_GROUP;
import static ca.firstvoices.security.utils.CustomSecurityConstants.RECORDERS_APPROVERS_GROUP;
import static ca.firstvoices.security.utils.CustomSecurityConstants.RECORDERS_GROUP;
import static org.junit.Assert.assertNotNull;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.EMAIL_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.FIRSTNAME_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.GROUPS_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.LASTNAME_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.USERNAME_COLUMN;

import ca.firstvoices.runner.FirstVoicesCoreTestsFeature;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.inject.Inject;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.core.api.CloseableCoreSession;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.CoreSessionService;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({FirstVoicesCoreTestsFeature.class})
public abstract class AbstractFirstVoicesCoreTestsTest {

  protected DocumentModel domain;
  protected DocumentModel workspaceRoot;
  protected DocumentModel workspace;
  protected DocumentModel languageFamily;
  protected DocumentModel language;
  protected Map<String, String> params;

  protected NuxeoPrincipal administrator;
  protected NuxeoPrincipal recorder;
  protected NuxeoPrincipal recorderWithApproval;
  protected NuxeoPrincipal languageAdmin;
  protected CloseableCoreSession userSession;

  @Inject
  protected CoreSession session;

  @Inject
  protected AutomationService automationService;

  @Inject
  protected UserManager userManager;

  @Before
  public void setUp() {
    createDomain();

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

  public void createDomain() {
    startFresh(session);

    domain = createDocument(session,
        session.createDocumentModel("/", "FV", "Domain"));
    workspaceRoot = createDocument(session,
        session.createDocumentModel("/FV", "Workspaces", "WorkspaceRoot"));
    workspace = createDocument(session,
        session.createDocumentModel("/FV/Workspaces", "Data", "Workspace"));
    languageFamily = createDocument(session,
        session
            .createDocumentModel("/FV/Workspaces/Data", "Test", FV_LANGUAGE_FAMILY));
    language = createDocument(session,
        session.createDocumentModel("/FV/Workspaces/Data/Test", "Test",
            FV_LANGUAGE));
  }

  public void startFresh(CoreSession session) {
    DocumentRef dRef = session.getRootDocument().getRef();
    DocumentModel defaultDomain = session.getDocument(dRef);

    DocumentModelList children = session.getChildren(defaultDomain.getRef());

    for (DocumentModel child : children) {
      recursiveRemove(session, child);
    }
  }

  private void recursiveRemove(CoreSession session, DocumentModel parent) {
    DocumentModelList children = session.getChildren(parent.getRef());

    for (DocumentModel child : children) {
      recursiveRemove(session, child);
    }

    session.removeDocument(parent.getRef());
    session.save();
  }

  public DocumentModel createDocument(CoreSession session, DocumentModel model) {
    model.setPropertyValue("dc:title", model.getName());
    DocumentModel newDoc = session.createDocument(model);
    session.save();

    return newDoc;
  }

  protected DocumentModel createUserWithPassword(String email, String lastName, String firstName,
      String... groups) {
    UserManager userManager = Framework.getService(UserManager.class);
    DocumentModel userModel = userManager.getBareUserModel();
    userModel.setPropertyValue(USERNAME_COLUMN, email);
    userModel.setPropertyValue(LASTNAME_COLUMN, lastName);
    userModel.setPropertyValue(FIRSTNAME_COLUMN, firstName);

    if (StringUtils.isNotBlank(email)) {
      userModel.setPropertyValue(EMAIL_COLUMN, email);
    }

    if (ArrayUtils.isNotEmpty(groups)) {
      userModel.setPropertyValue(GROUPS_COLUMN, groups);
    }

    userModel = userManager.createUser(userModel);
    return userModel;
  }

  protected void createNewGroup(String groupName, String groupLabel) {
    if (userManager.getGroup(groupName) == null) {
      DocumentModel newGroup = userManager.getBareGroupModel();
      newGroup.setProperty("group", "groupname", groupName);
      newGroup.setProperty("group", "grouplabel", groupLabel);
      userManager.createGroup(newGroup);
    }

  }

  public void setUser(NuxeoPrincipal user) {

    userSession = Framework.getService(CoreSessionService.class)
        .createCoreSession(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            user);
  }

  @After
  public void tearDown() {
    if (!(userSession == null)) {
      userSession.close();
    }
  }

}
