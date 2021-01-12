package ca.firstvoices.tests.mocks.services;

import static org.nuxeo.ecm.platform.usermanager.UserConfig.EMAIL_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.FIRSTNAME_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.GROUPS_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.PASSWORD_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.SCHEMA_NAME;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.USERNAME_COLUMN;

import java.util.HashSet;
import java.util.List;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.NuxeoGroup;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.platform.usermanager.UserManager;

public class MockUserServiceImpl implements MockUserService {

  @Override
  public void generateUsersForDialect(CoreSession session, UserManager userManager, PathRef path) {
    DocumentModel dialect = session.getDocument(path);

    generateUserDocAtAccessLevel(userManager, dialect, "members");
    generateUserDocAtAccessLevel(userManager, dialect,"recorders");
    generateUserDocAtAccessLevel(userManager, dialect,"recorders_with_approval");
    generateUserDocAtAccessLevel(userManager, dialect,"language_administrators");
  }

  @Override
  public void generateUsersForDialects(CoreSession session, UserManager userManager) {
    DocumentModelList mockDialects = session.query(
        "SELECT * FROM FVDialect WHERE ecm:path STARTSWITH '/FV/Workspaces/Data/Test/Test/'");
    for (DocumentModel dialect : mockDialects) {
      generateUsersForDialect(session, userManager, new PathRef(dialect.getPathAsString()));
    }

  }

  @Override
  public void removeUsersAndGroupsForDialect(CoreSession session, UserManager userManager,
      String dialectName) {
    DocumentModelList usersToRemove = userManager.searchUsers(dialectName);

    HashSet<String> groups = new HashSet<>();

    for (DocumentModel user : usersToRemove) {
      if ("Guest".equals(user.getTitle())) {
        // Skip Guest user
        continue;
      }

      // Add to groups to be removed
      List<String> groupNames = userManager.getPrincipal(user.getId()).getGroups();
      if (groupNames != null && !groupNames.isEmpty()) {
        groups.addAll(groupNames);
      }

      // Remove user
      userManager.deleteUser(user);
    }

    // Remove all groups if they exist
    for (String groupName : groups) {
      NuxeoGroup group = userManager.getGroup(groupName);
      if (group != null) {
        userManager.deleteGroup(groupName);
      }
    }
  }

  @Override
  public void removeUsersAndGroupsForDialects(CoreSession session, UserManager userManager) {
    DocumentModelList mockDialects = session.query(
        "SELECT * FROM FVDialect WHERE ecm:path STARTSWITH '/FV/Workspaces/Data/Test/Test/'");
    for (DocumentModel dialect : mockDialects) {
      removeUsersAndGroupsForDialect(session, userManager, dialect.getName());
    }

  }

  private void generateUserDocAtAccessLevel(UserManager userManager, DocumentModel dialect,
      String accessLevel) {

    String username = dialect.getName() + "_" + accessLevel;

    DocumentModelList results = userManager.searchGroups(username);
    String groupId = results.get(0).getId();
    List<String> existingUsers = userManager.getUsersInGroup(groupId);
    if (existingUsers.isEmpty()) {
      String[] groups = {groupId};
      DocumentModel userDoc = userManager.getBareUserModel();
      userDoc.setProperty(SCHEMA_NAME, USERNAME_COLUMN, username);
      userDoc.setProperty(SCHEMA_NAME, PASSWORD_COLUMN, username);
      userDoc.setProperty(SCHEMA_NAME, FIRSTNAME_COLUMN, username);
      userDoc.setPropertyValue(GROUPS_COLUMN, groups);
      userDoc.setProperty(SCHEMA_NAME, EMAIL_COLUMN, "@.");

      userManager.createUser(userDoc);
    }
  }
}