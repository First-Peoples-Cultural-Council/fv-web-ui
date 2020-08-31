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

/**
 * Update the references documents to proxied one on the proxy
 */

package ca.firstvoices.publisher.listeners;

import static ca.firstvoices.data.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CATEGORY;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

/**
 * Listener to unpublish documents that have been deleted and to remove categories from words or
 * phrases if trashed.
 *
 * @author dyona
 */
public class DocumentDeletedUnpublishListener implements EventListener {

  protected FirstVoicesPublisherService service = Framework
      .getService(FirstVoicesPublisherService.class);

  @Override
  public void handleEvent(Event event) {
    EventContext ctx = event.getContext();
    if (!(ctx instanceof DocumentEventContext)) {
      return;
    }
    DocumentModel doc = ((DocumentEventContext) ctx).getSourceDocument();
    if (doc == null) {
      return;
    }

    // Only required if document is not proxy
    if (!doc.isProxy()) {
      CoreSession session = doc.getCoreSession();

      DocumentModelList proxies = session.getProxies(doc.getRef(), null);

      for (DocumentModel proxy : proxies) {
        if (PUBLISHED_STATE.equals(proxy.getCurrentLifeCycleState())) {
          service.unpublish(proxy);
        }
      }

      if (doc.getType().equals(FV_CATEGORY)) {
        service.removeTrashedCategoriesOrPhrasebooksFromWordsOrPhrases(session, doc);
      }
    }
  }
}
