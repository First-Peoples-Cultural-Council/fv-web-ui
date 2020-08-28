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

import org.nuxeo.ecm.collections.api.CollectionConstants;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.versioning.VersioningService;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.platform.dublincore.listener.DublinCoreListener;

/**
 * Listener to assign value to ancestry fields (fva:dialect, fva:language, fva:language_family)
 */
public class AbstractSyncListener {

  protected EventContext eventCtx;

  protected DocumentEventContext docCtx;

  protected DocumentModel doc;

  protected boolean defaultEventCriteria() {
    return (eventCtx instanceof DocumentEventContext);
  }

  public static void disableDefaultEvents(final DocumentModel doc) {
    doc.putContextData(DublinCoreListener.DISABLE_DUBLINCORE_LISTENER, true);
    doc.putContextData(CollectionConstants.DISABLE_NOTIFICATION_SERVICE, true);
    doc.putContextData(CollectionConstants.DISABLE_AUDIT_LOGGER, true);
    doc.putContextData(VersioningService.DISABLE_AUTO_CHECKOUT, true);
  }

  public static void enableDefaultEvents(final DocumentModel doc) {
    doc.putContextData(DublinCoreListener.DISABLE_DUBLINCORE_LISTENER, null);
    doc.putContextData(CollectionConstants.DISABLE_NOTIFICATION_SERVICE, null);
    doc.putContextData(CollectionConstants.DISABLE_AUDIT_LOGGER, null);
    doc.putContextData(VersioningService.DISABLE_AUTO_CHECKOUT, null);
  }
}
