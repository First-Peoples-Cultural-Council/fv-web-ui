/*
 *
 *  *
 *  * Copyright 2020 First People's Cultural Council
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  * /
 *
 */

package ca.firstvoices.tests.mocks.operations;

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CATEGORIES;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_LINKS;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_RESOURCES;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.EMAIL_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.GROUPS_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.PASSWORD_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.SCHEMA_NAME;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.USERNAME_COLUMN;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.impl.ACLImpl;
import org.nuxeo.ecm.core.api.security.impl.ACPImpl;
import org.nuxeo.ecm.platform.usermanager.UserManager;

/**
 *
 */
@Operation(id = InitialDatabaseSetup.ID, category = Constants.CAT_DOCUMENT, label =
    "FVInitialDatabaseSetup", description =
    "This operation is used to setup the initial FirstVoices backend for development.  "
        + "It can be run multiple times without issues. Please ensure you have your environment "
        + "variables set for CYPRESS_FV_USERNAME and CYPRESS_FV_PASSWORD as these will create an"
        + " admin " + "account for you.")
public class InitialDatabaseSetup {

  public static final String ID = "Document.InitialDatabaseSetup";

  public static final String SCHEMA_PUBLISHING = "publishing";

  public static final String SECTIONS_PROPERTY_NAME = "publish:sections";
  public static final String WORKSPACES_SITE = "/FV/Workspaces/Site";
  public static final String WORKSPACES_SHARED_DATA = "/FV/Workspaces/SharedData";
  // Environment variables for the admin account that will be created.
  private static final String CYPRESS_FV_USERNAME = System.getenv("CYPRESS_FV_USERNAME");
  private static final String CYPRESS_FV_PASSWORD = System.getenv("CYPRESS_FV_PASSWORD");
  private static final String FV_WORKSPACES = "/FV/Workspaces";
  private static final String FV_SECTIONS = "/FV/sections";

  @Context
  protected CoreSession session;

  @Context
  protected UserManager userManager;

  /*
    Create the proper folder structure.
 */
  @OperationMethod
  public void run() {

    createNewDocument("Site", "Workspace", FV_WORKSPACES);
    createNewDocument("Site", "Section", FV_SECTIONS);
    createNewDocument("Resources", FV_RESOURCES, WORKSPACES_SITE);
    createNewDocument("Pages", "Folder", WORKSPACES_SITE + "/Resources");
    createNewDocument("Shared Categories", FV_CATEGORIES, WORKSPACES_SHARED_DATA);
    createNewDocument("Shared Links", FV_LINKS, WORKSPACES_SHARED_DATA);
    createNewDocument("Shared Resources", FV_RESOURCES, WORKSPACES_SHARED_DATA);

    /*
        Create the user groups.
     */
    createNewGroup("language_administrators", "Language Administrators");
    createNewGroup("recorders", "Recorders");
    createNewGroup("recorders_with_approval", "Recorders With Approval");
            
    /*
        Add new user groups as subgroups of group "members" and keep any existing
        subgroups.
     */
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
    newSubGroups.add("language_administrators");
    newSubGroups.add("recorders");
    newSubGroups.add("recorders_with_approval");
    List<String> noDuplicates = newSubGroups.stream().distinct().collect(Collectors.toList());
    members.setProperty("group", "subGroups", noDuplicates);
    userManager.updateGroup(members);

    /*
        Setup permissions.
     */
    DocumentModel root = session.getDocument(new PathRef("/"));
    ACPImpl acp = new ACPImpl();
    ACLImpl acl = new ACLImpl("ACL.LOCAL_ACL");
    acp.addACL(acl);
    ACE ace = new ACE("members", "Read", true);
    acl.add(ace);
    root.setACP(acp, false);

    DocumentModel sections = session.getDocument(new PathRef(FV_SECTIONS));
    ACPImpl acpTwo = new ACPImpl();
    ACLImpl aclTwo = new ACLImpl("ACL.LOCAL_ACL");
    acpTwo.addACL(aclTwo);
    ACE aceTwo = new ACE("Guest", "Read", true);
    aclTwo.add(aceTwo);
    sections.setACP(acpTwo, false);
    /*
    Setup publication targets.
    */
    DocumentModel target = session.getDocument(new PathRef(FV_SECTIONS + "/Data"));
    String targetSectionId = target.getId();
    DocumentModel sourceDoc = session.getDocument(new PathRef(FV_WORKSPACES + "/Data"));
    addSection(targetSectionId, sourceDoc);

    target = session.getDocument(new PathRef(FV_SECTIONS + "/SharedData"));
    targetSectionId = target.getId();
    sourceDoc = session.getDocument(new PathRef(WORKSPACES_SHARED_DATA));
    addSection(targetSectionId, sourceDoc);

    target = session.getDocument(new PathRef(FV_SECTIONS + "/Site"));
    targetSectionId = target.getId();
    sourceDoc = session.getDocument(new PathRef(WORKSPACES_SITE));
    addSection(targetSectionId, sourceDoc);

    /*
        Create admin user.
     */
    if ((CYPRESS_FV_USERNAME != null || CYPRESS_FV_PASSWORD != null)
        && userManager.getUserModel(CYPRESS_FV_USERNAME) == null) {
      String[] groups = {"administrators"};
      DocumentModel userDoc = userManager.getBareUserModel();
      userDoc.setProperty(SCHEMA_NAME, USERNAME_COLUMN, CYPRESS_FV_USERNAME);
      userDoc.setProperty(SCHEMA_NAME, PASSWORD_COLUMN, CYPRESS_FV_PASSWORD);
      userDoc.setPropertyValue(GROUPS_COLUMN, groups);
      userDoc.setProperty(SCHEMA_NAME, EMAIL_COLUMN, "@.");
      userManager.createUser(userDoc);
    }
  }

  /*
      Helper method to set a publication target for a document.
   */
  private void addSection(String targetSectionId, DocumentModel sourceDocument) {

    if (targetSectionId != null && sourceDocument.hasSchema(SCHEMA_PUBLISHING)) {
      String[] sectionIdsArray = (String[]) sourceDocument.getPropertyValue(SECTIONS_PROPERTY_NAME);

      List<String> sectionIdsList = new ArrayList<>();

      if (sectionIdsArray != null && sectionIdsArray.length > 0) {
        sectionIdsList = Arrays.asList(sectionIdsArray);
        // make it resizable
        sectionIdsList = new ArrayList<>(sectionIdsList);
      }

      sectionIdsList.add(targetSectionId);
      String[] sectionIdsListIn = new String[sectionIdsList.size()];
      sectionIdsList.toArray(sectionIdsListIn);

      sourceDocument.setPropertyValue(SECTIONS_PROPERTY_NAME, sectionIdsListIn);
      session.saveDocument(sourceDocument);
      session.save();
    }
  }

  /*
      Helper method to create the folder structure if it doesn't exist already
   */
  private void createNewDocument(String name, String type, String parentPath) {
    if (!session.exists(new PathRef(parentPath + "/" + name))) {
      DocumentModel newDoc = session.createDocumentModel(parentPath, name, type);
      newDoc.setPropertyValue("dc:title", name);
      newDoc = session.createDocument(newDoc);
      session.saveDocument(newDoc);
    }
  }

  /*
      Helper method to create the user groups
   */
  private void createNewGroup(String groupName, String groupLabel) {
    if (userManager.getGroup(groupName) == null) {
      DocumentModel newGroup = userManager.getBareGroupModel();
      newGroup.setProperty("group", "groupname", groupName);
      newGroup.setProperty("group", "grouplabel", groupLabel);
      userManager.createGroup(newGroup);
    }

  }

}
