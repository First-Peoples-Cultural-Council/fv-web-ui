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

package ca.firstvoices.security.listeners;

import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.platform.audit.listener.StreamAuditEventListener;

/*
 * Overrides the default StreamAuditEventListener to skip logging login for Guest user
 */
public class FVStreamAuditEventListener extends StreamAuditEventListener {

  @Override
  public void handleEvent(Event event) {

    NuxeoPrincipal principal = event.getContext().getPrincipal();
    if ((principal == null || principal.isAnonymous() || "Guest".equals(principal.getName()))
        && "loginSuccess".equals(event.getName())) {
      return;
    }
    super.handleEvent(event);
  }

}
