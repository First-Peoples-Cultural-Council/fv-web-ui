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

package ca.firstvoices.listeners;

import ca.firstvoices.services.AssignAncestorsService;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

/**
 * Listener to assign value to ancestry fields (fva:dialect, fva:language, fva:language_family)
 */
public class AncestryAssignmentListener extends AbstractSyncListener implements EventListener {

  private final AssignAncestorsService assignAncestorsService = Framework
      .getService(AssignAncestorsService.class);

  /**
   * Specific criteria that must be true for this event to run
   * @return whether the criteria was met or not
   */
  private boolean listenerCriteria() {
    return (doc != null && !doc.isProxy() && !doc.isVersion() && doc.hasSchema("fvancestry"));
  }

  @Override
  public void handleEvent(Event event) {

    eventCtx = event.getContext();
    docCtx = (DocumentEventContext) eventCtx;
    doc = docCtx.getSourceDocument();

    if (!defaultEventCriteria() || !listenerCriteria()) {
      return;
    }

    CoreInstance.doPrivileged(doc.getRepositoryName(), (CoreSession session) -> {

      // Disable event so other listeners don't fire for this system update
      disableDefaultEvents(doc);

      // Assign ancestors; saving is done in service
      assignAncestorsService.assignAncestors(session, doc);

      // Renable default events for future runs
      enableDefaultEvents(doc);
    });
  }
}
