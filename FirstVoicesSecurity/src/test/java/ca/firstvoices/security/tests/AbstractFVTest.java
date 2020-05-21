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

package ca.firstvoices.security.tests;

import static org.nuxeo.ecm.platform.usermanager.GroupConfig.DEFAULT_ID_FIELD;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.EMAIL_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.FIRSTNAME_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.GROUPS_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.LASTNAME_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.USERNAME_COLUMN;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;

public abstract class AbstractFVTest {

  public DocumentModel createGroup(String group) {
    UserManager userManager = Framework.getService(UserManager.class);
    DocumentModel groupModel = userManager.getBareGroupModel();
    groupModel.setPropertyValue(DEFAULT_ID_FIELD, group);
    groupModel = userManager.createGroup(groupModel);
    return groupModel;
  }

  public DocumentModel createUserWithPassword(String email, String lastName, String firstName,
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

  public void setACL(DocumentModel doc, String username, String permission) {
    ACP acp = doc.getACP();
    ACL acl = acp.getOrCreateACL(ACL.LOCAL_ACL);
    //acl.clear();
    acl.add(new ACE(username, permission, true));
    acp.addACL(acl);
    doc.setACP(acp, true);
  }

}
