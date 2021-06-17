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

package ca.firstvoices.publisher.listeners;

import static ca.firstvoices.data.lifecycle.Constants.PUBLISH_TRANSITION;
import static org.nuxeo.ecm.core.api.event.DocumentEventTypes.DOCUMENT_CREATED;

import ca.firstvoices.core.io.utils.DialectUtils;
import ca.firstvoices.core.io.utils.StateUtils;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;

/**
 * Will automatically publish if document context is provided
 * This is intended for new created documents, and is set in AutoPublishJsonInterceptor
 */
public class AutoPublishListener implements EventListener {

  @Override
  public void handleEvent(Event event) {
    EventContext ctx = event.getContext();

    if (!(ctx instanceof DocumentEventContext)) {
      return;
    }

    DocumentModel doc = ((DocumentEventContext) ctx).getSourceDocument();

    if (DOCUMENT_CREATED.equals(event.getName()) && doc != null) {
      if (doc.getContextData().isEmpty()) {
        return;
      }

      if (doc.getContextData("fv-publish") == null
          || !Boolean.parseBoolean(doc.getContextData("fv-publish").toString())) {
        return;
      }

      // Skip proxies, versions and trashed docs
      if (doc.isProxy() || doc.isVersion() || doc.isTrashed()) {
        return;
      }

      DocumentModel dialect = DialectUtils.getDialect(doc);

      if (!StateUtils.isPublished(dialect)) {
        return;
      }

      StateUtils.followTransitionIfAllowed(doc, PUBLISH_TRANSITION);
    }
  }
}
