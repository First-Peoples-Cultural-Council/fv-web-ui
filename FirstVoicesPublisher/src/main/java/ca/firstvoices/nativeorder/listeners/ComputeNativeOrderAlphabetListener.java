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
 * Compute asset custom order when asset (Word/Phrase) modified or created.
 */

package ca.firstvoices.nativeorder.listeners;

import static ca.firstvoices.schemas.DialectTypesConstants.FV_CHARACTER;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;

/**
 * @author dyona
 */
public class ComputeNativeOrderAlphabetListener implements EventListener {

  @Override
  public void handleEvent(Event event) {

    if (!(event.getName().equals(DocumentEventTypes.DOCUMENT_CREATED)) && !(event.getName()
        .equals(DocumentEventTypes.DOCUMENT_UPDATED)) && !(event.getName()
        .equals("documentTrashed")) && !(event.getName().equals("documentUntrashed"))) {
      return;
    }

    if (!(event.getContext() instanceof DocumentEventContext)) {
      return;
    }
    DocumentEventContext ctx = (DocumentEventContext) event.getContext();
    DocumentModel doc = ctx.getSourceDocument();

    if (doc == null) {
      return;
    }

    // Handle language assets (Words and Phrases)
    if (doc.getType().equals(FV_CHARACTER) && !doc.isProxy()) {

      // Will always run when creating
      CoreSession session = doc.getCoreSession();
      DocumentModel alphabet = session.getParentDocument(doc.getRef());
      alphabet.setPropertyValue("custom_order_recompute_required", true);
      session.saveDocument(alphabet);
    }
  }
}
