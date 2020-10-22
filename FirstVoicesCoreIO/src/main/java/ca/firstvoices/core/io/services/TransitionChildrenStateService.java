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

package ca.firstvoices.core.io.services;

import org.nuxeo.ecm.core.api.DocumentModel;

public interface TransitionChildrenStateService {

  /**
   * Will transition all direct children of a parent Folderish document
   * Inspired by org.nuxeo.ecm.core.lifecycle.event.BulkLifeCycleChangeListener
   * But specific for FirstVoices transitioning logic
   * @param transition the transition to follow
   * @param affectedState the state of children to transition; or null, for all children
   * @param doc the parent document
   */
  void transitionChildren(String transition, String affectedState, DocumentModel doc);
}
