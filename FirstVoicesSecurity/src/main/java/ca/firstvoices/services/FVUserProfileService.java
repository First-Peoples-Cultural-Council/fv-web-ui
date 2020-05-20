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

package ca.firstvoices.services;

import java.io.Serializable;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;

/**
 * Service for user profile related information
 *
 * @author Daniel Yona
 * @author Kristof Subryan
 */
public interface FVUserProfileService extends Serializable {

  /**
   * Gets the user dialects the user is a member of. Normally, this would be 1 dialect. For a user
   * who is part of `hebrew_recorders`, `hebrew` would be returned. There are some scenarios where
   * multiple dialects could be returned, for example, if a user is part of `hebrew_recorders` and
   * `spanish_members`.
   *
   * @param currentUser
   * @param session
   * @return List of FVDialect objects the user is a member of in some capacity
   */
  DocumentModelList getUserDialects(NuxeoPrincipal currentUser, CoreSession session);

  /**
   * Gets the path to redirect users to after login. This will usually be a dialect path.
   *
   * @param documentManager
   * @param currentUser
   * @param baseURL
   * @param defaultHome     - whether to return the home page by default if no match found, or empty
   *                        string
   * @return
   */
  String getDefaultDialectRedirectPath(CoreSession documentManager, NuxeoPrincipal currentUser,
      String baseURL, Boolean defaultHome);
}
