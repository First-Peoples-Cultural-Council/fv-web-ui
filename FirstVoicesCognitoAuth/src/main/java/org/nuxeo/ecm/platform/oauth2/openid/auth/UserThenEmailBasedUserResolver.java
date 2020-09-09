/*
 * (C) Copyright 2006-2013 Nuxeo SA (http://nuxeo.com/) and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Contributors:
 *     Nelson Silva <nelson.silva@inevo.pt> - initial API and implementation
 *     Nuxeo
 */

package org.nuxeo.ecm.platform.oauth2.openid.auth;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.platform.oauth2.openid.OpenIDConnectProvider;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;

public class UserThenEmailBasedUserResolver extends UserResolver {

  private static final Log log = LogFactory.getLog(UserThenEmailBasedUserResolver.class);

  public UserThenEmailBasedUserResolver(OpenIDConnectProvider provider) {
    super(provider);
  }

  @Override
  public String findNuxeoUser(OpenIDUserInfo userInfo) {

    try {
      UserManager userManager = Framework.getService(UserManager.class);

      //try username first

      Map<String, Serializable> query = new HashMap<>();
      query.put(userManager.getUserIdField(), ((CognitoUserInfo) userInfo).getUsername());
      DocumentModelList users = Framework.doPrivileged(() -> userManager.searchUsers(query, null));

      if (users.isEmpty()) {
        //fallback to email
        log.warn("No user found for id " + ((CognitoUserInfo) userInfo).getUsername() + ", "
            + "falling back to email search");
        Map<String, Serializable> query2 = new HashMap<>();
        query2.put(userManager.getUserEmailField(), userInfo.getEmail());
        users = Framework.doPrivileged(() -> userManager.searchUsers(query2, null));

        if (users.isEmpty()) {
          //沒有人

          //check the configuration. We could create a user now.
          String username = ((CognitoUserInfo) userInfo).getUsername();

          log.warn("About to create the user " + username);

          DocumentModel nuxeoUser = this.createNuxeoUser(username);
          ArrayList<String> groups = new ArrayList<>();
          groups.add("members");
          nuxeoUser.setProperty("user", "groups", groups);
          nuxeoUser = updateUserInfo(nuxeoUser, userInfo);
          log.warn(nuxeoUser.toString());

          return (String) nuxeoUser.getPropertyValue(userManager.getUserIdField());
        }
      }

      DocumentModel user = users.get(0);
      return (String) user.getPropertyValue(userManager.getUserIdField());

    } catch (NuxeoException e) {
      log.error("Error while search user in UserManager using email " + userInfo.getEmail(), e);
      return null;
    }
  }

  @Override
  public DocumentModel updateUserInfo(DocumentModel user, OpenIDUserInfo userInfo) {
    try {
      UserManager userManager = Framework.getService(UserManager.class);
      user.setPropertyValue(userManager.getUserEmailField(), userInfo.getEmail());

      Framework.doPrivileged(() -> userManager.updateUser(user));
    } catch (NuxeoException e) {
      log.error("Error while search user in UserManager using email " + userInfo.getEmail(), e);
      return null;
    }
    return user;
  }

}
