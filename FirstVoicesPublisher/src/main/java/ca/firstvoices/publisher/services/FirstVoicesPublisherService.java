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

package ca.firstvoices.publisher.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;

public interface FirstVoicesPublisherService {

  /**
   * Will transition the life cycle state on the dialect, dialect children and grand-children
   **
   * For types that have `Publish` defined in `noRecursionForTransitions` (e.g. `FVDictionary`):
   * Documents in the `Enabled` state will transition; `New` and `Disabled` will not.
   * This is handled by the FVCore -> `transitionChildren` service
   **
   * For other types (e.g. `FVCategories`):
   * `BulkLifeCycleChangeListener` will attempt to transition all the child docs to `Published`
   **
   * Important Note: proxies are not created as part of this method.
   * That is done via the `publish` method.
   *
   * @param session session to act within
   * @param dialect the dialect to transition life cycle state on
   */
  void transitionDialectToPublished(CoreSession session, DocumentModel dialect);

  /**
   * Will route a document to the correct method for removing proxies.
   * See implementation for details
   */
  void unpublish(DocumentModel doc);

  /**
   * Will create proxies for the relevant document
   * See implementation for details
   */
  DocumentModel publish(CoreSession session, DocumentModel doc);

  /**
   * Overwrites proxies for existing published documents.
   * Will transition doc back to the Published if allowed
   * Invoked via a listener after a republish transition
   * @param doc the document to republish
   */
  void republish(DocumentModel doc);

  /**
   * Gets a proxy for the provided workspace document ref
   * @param session to act within
   * @param docRef reference of the document to get proxy for
   * @return proxy (i.e. document in sections) or null if not proxy exists
   */
  DocumentModel getPublication(CoreSession session, DocumentRef docRef);
}
