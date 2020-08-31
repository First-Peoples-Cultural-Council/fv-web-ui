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

package ca.firstvoices.characters.listeners;

import ca.firstvoices.characters.services.CleanupCharactersService;
import ca.firstvoices.data.schemas.DialectTypesConstants;
import java.util.Iterator;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.api.model.DocumentPart;
import org.nuxeo.ecm.core.api.model.Property;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;


public class ConfusableCleanupListener implements EventListener {


  public static final String DISABLE_CLEANUP_LISTENER = "disableConfusableCleanupListener";

  private final CleanupCharactersService cleanupCharactersService = Framework
      .getService(CleanupCharactersService.class);

  private CoreSession session;
  private EventContext ctx;
  private Event event;
  private DocumentModel document;

  @Override
  public void handleEvent(Event event) {
    this.event = event;
    ctx = this.event.getContext();

    Boolean block = (Boolean) event.getContext().getProperty(DISABLE_CLEANUP_LISTENER);
    if (Boolean.TRUE.equals(block)) {
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
      cleanupWordsAndPhrases();
    }
  }

  public void cleanupWordsAndPhrases() {
    if ((document.getType().equals(DialectTypesConstants.FV_WORD) || document.getType().equals(
        DialectTypesConstants.FV_PHRASE)) && !document
        .isProxy() && !document.isVersion()) {
      try {
        if (event.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {
          DocumentPart[] docParts = document.getParts();
          for (DocumentPart docPart : docParts) {
            Iterator<Property> dirtyChildrenIterator = docPart.getDirtyChildren();

            while (dirtyChildrenIterator.hasNext()) {
              Property property = dirtyChildrenIterator.next();
              String propertyName = property.getField().getName().toString();
              if (property.isDirty() && propertyName.equals("dc:title")) {
                cleanupCharactersService.cleanConfusables(session, document, false);
              }
            }
          }
        }
        if (event.getName().equals(DocumentEventTypes.ABOUT_TO_CREATE)) {
          cleanupCharactersService.cleanConfusables(session, document, false);
        }
      } catch (Exception exception) {
        event.markBubbleException();
        event.markRollBack();

        throw exception;
      }
    }
  }
}
