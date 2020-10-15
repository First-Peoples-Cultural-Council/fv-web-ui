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
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CATEGORY;

import ca.firstvoices.core.io.utils.DialectUtils;
import ca.firstvoices.core.io.utils.StateUtils;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;

//  TODO: MOVE THIS LOGIC TO OPERATIONS MODULE AND REMOVE RELIANCE ON LISTENER
public class PublishNewCategoryListener implements EventListener {

  @Override
  public void handleEvent(Event event) {
    EventContext ctx = event.getContext();
    if (!(ctx instanceof DocumentEventContext)) {
      return;
    }
    DocumentModel doc = ((DocumentEventContext) ctx).getSourceDocument();
    if (doc != null) {

      // Skip proxies and versions
      if (doc.isProxy() || doc.isVersion()) {
        return;
      }

      if (!doc.getType().equals(FV_CATEGORY)) {
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
