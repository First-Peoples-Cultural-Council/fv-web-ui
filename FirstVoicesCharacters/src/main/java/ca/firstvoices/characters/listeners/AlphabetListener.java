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

import ca.firstvoices.characters.Constants;
import ca.firstvoices.characters.services.CleanupCharactersService;
import ca.firstvoices.data.schemas.DialectTypesConstants;
import ca.firstvoices.data.utils.DialectUtils;
import ca.firstvoices.maintenance.common.RequiredJobsUtils;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

/**
 * Listener will validate ignored characters on an alphabet Will queue an order recompute if ignored
 * characters have changed
 */
public class AlphabetListener implements EventListener {

  public static final String DISABLE_ALPHABET_LISTENER = "disableAlphabetListener";
  private static final String IGNORED_CHARS = "fv-alphabet:ignored_characters";
  private final CleanupCharactersService cleanupCharactersService = Framework
      .getService(CleanupCharactersService.class);

  @Override
  public void handleEvent(Event event) {
    EventContext ctx = event.getContext();

    Boolean block = (Boolean) event.getContext().getProperty(DISABLE_ALPHABET_LISTENER);
    if (Boolean.TRUE.equals(block)) {
      return;
    }

    if (!(ctx instanceof DocumentEventContext)) {
      return;
    }

    DocumentModel document = ((DocumentEventContext) ctx).getSourceDocument();
    if (document == null || document.isImmutable() || !DialectTypesConstants.FV_ALPHABET.equals(
        document.getType())) {
      return;
    }

    if ((event.getName().equals(DocumentEventTypes.ABOUT_TO_CREATE) || event.getName()
        .equals(DocumentEventTypes.BEFORE_DOC_UPDATE))) {

      // Validation for ignored characters
      DocumentModelList characters = cleanupCharactersService.getCharacters(document);

      // Will throw exception if ignore characters are not valid
      cleanupCharactersService.validateAlphabetIgnoredCharacters(characters, document);

      if (document.getProperty(IGNORED_CHARS).isDirty()) {
        // Queue custom order recompute if ignored characters changed
        RequiredJobsUtils
            .addToRequiredJobs(DialectUtils.getDialect(document), Constants.COMPUTE_ORDER_JOB_ID);
      }
    }
  }
}
