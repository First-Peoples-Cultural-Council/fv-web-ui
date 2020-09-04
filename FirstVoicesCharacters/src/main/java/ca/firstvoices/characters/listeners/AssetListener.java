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
import ca.firstvoices.characters.services.CustomOrderComputeService;
import ca.firstvoices.characters.services.SanitizeDocumentService;
import ca.firstvoices.data.schemas.DialectTypesConstants;
import java.util.logging.Logger;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

/**
 * Handles character related operations (e.g. cleanup, custom order) before saving currently applies
 * to a word or phrase
 */
public class AssetListener implements EventListener {

  public static final String DISABLE_CHAR_ASSET_LISTENER = "disableCharacterAssetListener";

  private static final Logger log = Logger.getLogger(AssetListener.class.getCanonicalName());

  private final SanitizeDocumentService sanitizeDocumentService = Framework
      .getService(SanitizeDocumentService.class);

  private final CleanupCharactersService cleanupCharactersService = Framework
      .getService(CleanupCharactersService.class);

  private final CustomOrderComputeService customOrderComputeService = Framework
      .getService(CustomOrderComputeService.class);

  @Override
  public void handleEvent(Event event) {
    EventContext ctx = event.getContext();

    Boolean block = (Boolean) event.getContext().getProperty(DISABLE_CHAR_ASSET_LISTENER);
    if (Boolean.TRUE.equals(block)) {
      return;
    }

    if (!(ctx instanceof DocumentEventContext)) {
      return;
    }

    CoreSession session = ctx.getCoreSession();
    DocumentModel document = ((DocumentEventContext) ctx).getSourceDocument();
    if (document == null || document.isImmutable()) {
      return;
    }

    // Only apply to word and phrase
    if (!document.getType().equals(DialectTypesConstants.FV_WORD) && !document.getType().equals(
        DialectTypesConstants.FV_PHRASE)) {
      return;
    }

    if ((DocumentEventTypes.BEFORE_DOC_UPDATE.equals(event.getName()) && document
        .getProperty("dc:title").isDirty()) || DocumentEventTypes.ABOUT_TO_CREATE
        .equals(event.getName())) {
      try {
        document = sanitizeDocumentService.sanitizeDocument(session, document);
        document = cleanupCharactersService.cleanConfusables(session, document, false);
        customOrderComputeService
            .computeAssetNativeOrderTranslation(ctx.getCoreSession(), document, false, false);
      } catch (Exception e) {
        // Fail silently so that we can still capture the asset being created
        log.severe("Failed during listener; document with Path " + document.getPathAsString()
            + "| Exception:" + e.toString());
      }
    }
  }
}
