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

import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.platform.audit.listener.StreamAuditEventListener;

/*
 * Overrides the default StreamAuditEventListener to skip logging login for Guest user
 */
public class OverwriteAuditEventListener extends StreamAuditEventListener {

  @Override
  public void handleEvent(Event event) {

    NuxeoPrincipal principal = event.getContext().getPrincipal();

    if (isGuest(principal) || isIgnoredEvent(event) || isIgnoredDocument(event)) {
      // Skip the audio log for these events
      return;
    }

    super.handleEvent(event);
  }

  /**
   * Do not log guest events in the audit log
   */
  private boolean isGuest(NuxeoPrincipal principal) {
    return principal == null || principal.isAnonymous() || "Guest".equals(principal.getName());
  }

  /**
   * Do not log download events
   * These are trigger on page load when "downloading" embedded assets
   */
  private boolean isIgnoredEvent(Event event) {

    return "download".equals(event.getName())
        || "lifecycle_transition_event".equals(event.getName())
        || "versionRemoved".equals(event.getName())
        || "documentProxyPublished".equals(event.getName())
        || "documentLocked".equals(event.getName())
        || "documentCheckedIn".equals(event.getName())
        || "documentUnlocked".equals(event.getName())
        || "documentCheckedOut".equals(event.getName())
        || "search".equals(event.getName())
        || "sectionContentPublished".equals(event.getName());
  }

  /**
   * Do not log download events
   * These are trigger on page load when "downloading" embedded assets
   */
  private boolean isIgnoredDocument(Event event) {
    EventContext ctx = event.getContext();

    if (ctx instanceof DocumentEventContext) {
      DocumentEventContext docCtx = (DocumentEventContext) ctx;
      DocumentModel document = docCtx.getSourceDocument();

      // Best not to log a null document
      // No need to audit versions and proxies, they are derived from workspace docs
      // DocumentRoutes are internal types that don't need logging
      return document == null || document.isVersion() || document.isProxy()
          || "DocumentRoute".equals(document.getType());
    }

    return false;
  }
}
