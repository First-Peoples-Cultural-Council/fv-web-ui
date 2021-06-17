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

package ca.firstvoices.core.io.listeners;

import ca.firstvoices.core.io.services.AssignAncestorsService;
import ca.firstvoices.core.io.utils.SessionUtils;
import java.util.logging.Logger;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

/**
 * Listener to assign value to ancestry fields (fva:dialect, fva:language, fva:language_family)
 */
public class AncestryAssignmentListener implements EventListener {

  public static final String DISABLE_ANCESTRY_LISTENER = "disableAncestryListener";

  protected EventContext eventCtx;

  protected DocumentEventContext docCtx;

  protected DocumentModel doc;

  private static final Logger log = Logger
      .getLogger(AncestryAssignmentListener.class.getCanonicalName());

  private final AssignAncestorsService assignAncestorsService = Framework
      .getService(AssignAncestorsService.class);

  /**
   * Specific criteria that must be true for this event to run
   *
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

    if (!(eventCtx instanceof DocumentEventContext) || !listenerCriteria()) {
      return;
    }

    Boolean block = (Boolean) event.getContext().getProperty(DISABLE_ANCESTRY_LISTENER);
    if (Boolean.TRUE.equals(block)) {
      return;
    }

    try {
      // Disable event so other listeners don't fire for this system update
      SessionUtils.disableDefaultEvents(doc);

      // Assign ancestors; no need to save, since this is run before creation
      assignAncestorsService.assignAncestors(doc);
    } catch (Exception e) {
      // Fail silently so that we can still capture the asset being created
      log.severe("Failed during AncestryAssignmentListener listener;"
          + "document with Path " + doc.getPathAsString()
          + "| Exception:" + e.toString());
    } finally {
      // Renable default events for future runs
      SessionUtils.enableDefaultEvents(doc);
    }
  }
}
