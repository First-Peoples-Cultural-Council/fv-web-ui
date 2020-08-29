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

import ca.firstvoices.core.io.services.SanitizeDocumentService;
import ca.firstvoices.data.schemas.DialectTypesConstants;
import javax.inject.Inject;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;


public class FVDocumentListener implements EventListener {


  public static final String DISABLE_FVDOCUMENT_LISTENER = "disableFVDocumentListener";

  private CoreSession session;
  private EventContext ctx;
  private Event event;
  private DocumentModel document;

  @Inject
  SanitizeDocumentService sanitizeDocumentService = Framework
      .getService(SanitizeDocumentService.class);

  @Override
  public void handleEvent(Event event) {
    this.event = event;
    ctx = this.event.getContext();

    Boolean block = (Boolean) event.getContext().getProperty(DISABLE_FVDOCUMENT_LISTENER);
    if (Boolean.TRUE.equals(block)) {
      // ignore the event - we are blocked by the caller
      return;
    }

    if (!(ctx instanceof DocumentEventContext)) {
      return;
    }

    session = ctx.getCoreSession();
    document = ((DocumentEventContext) ctx).getSourceDocument();
    if (document == null || document.isImmutable()) {
      return;
    }

    if (event.getName().equals(DocumentEventTypes.ABOUT_TO_CREATE) || event.getName()
        .equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {
      sanitizeWord();
    }
  }

  public void sanitizeWord() {
    if ((document.getType().equals(DialectTypesConstants.FV_WORD) || document.getType().equals(
        DialectTypesConstants.FV_PHRASE)) && !document
        .isProxy() && !document.isVersion()) {
      sanitizeDocumentService.sanitizeDocument(session, document);
    }
  }

  protected void rollBackEvent(Event event) {
    event.markBubbleException();
    event.markRollBack();
  }

}
