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

import static ca.firstvoices.characters.Constants.CLEAN_CONFUSABLES_JOB_ID;
import static ca.firstvoices.characters.Constants.COMPUTE_ORDER_JOB_ID;
import static org.nuxeo.ecm.core.api.event.DocumentEventTypes.ABOUT_TO_CREATE;
import static org.nuxeo.ecm.core.api.event.DocumentEventTypes.BEFORE_DOC_UPDATE;
import static org.nuxeo.ecm.core.api.event.DocumentEventTypes.DOCUMENT_CREATED;
import static org.nuxeo.ecm.core.api.trash.TrashService.DOCUMENT_TRASHED;
import static org.nuxeo.ecm.core.api.trash.TrashService.DOCUMENT_UNTRASHED;

import ca.firstvoices.characters.services.CleanupCharactersService;
import ca.firstvoices.core.io.utils.DialectUtils;
import ca.firstvoices.data.schemas.DialectTypesConstants;
import ca.firstvoices.maintenance.common.RequiredJobsUtils;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.RecoverableClientException;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.platform.web.common.exceptionhandling.ExceptionHelper;
import org.nuxeo.runtime.api.Framework;

/**
 * Listener will validate alphabet characters and queue custom order recompute, or cleanup of
 * confusables as needed
 */
public class CharacterListener implements EventListener {

  public static final String DISABLE_CHARACTER_LISTENER = "disableCharacterListener";
  private static final String DC_TITLE = "dc:title";
  private static final String CHAR_ORDER = "fvcharacter:alphabet_order";
  private static final String LC_CONFUSABLES = "fvcharacter:confusable_characters";
  private static final String UC_CONFUSABLES = "fvcharacter:upper_case_confusable_characters";
  private static final String UC_CHAR = "fvcharacter:upper_case_character";
  private static final String ACCEPTED_TYPE = DialectTypesConstants.FV_CHARACTER;
  protected EventContext eventCtx;
  protected DocumentEventContext docCtx;
  protected DocumentModel doc;
  CleanupCharactersService cleanupCharactersService = Framework
      .getService(CleanupCharactersService.class);

  /**
   * Specific criteria that must be true for this event to run
   *
   * @return whether the criteria was met or not
   */
  private boolean listenerCriteria(EventContext ctx, DocumentModel doc) {

    Boolean blockListener = (Boolean) ctx.getProperty(DISABLE_CHARACTER_LISTENER);

    if (Boolean.TRUE.equals(blockListener)) {
      return false;
    }

    return (doc != null && ACCEPTED_TYPE.equals(doc.getType())
        && !doc.isProxy() && !doc.isVersion());
  }

  @Override
  public void handleEvent(Event event) {
    eventCtx = event.getContext();
    docCtx = (DocumentEventContext) eventCtx;
    doc = docCtx.getSourceDocument();

    if (!(eventCtx instanceof DocumentEventContext) || !listenerCriteria(eventCtx, doc)) {
      return;
    }

    // Set of required jobs to set
    HashSet<String> requiredJobsToSet = new HashSet<>();

    switch (event.getName()) {
      case DOCUMENT_CREATED:

        if (cleanupCharactersService.hasConfusableCharacters(doc)) {
          // If confusables are defined upon creation, queue a cleanup
          requiredJobsToSet.add(CLEAN_CONFUSABLES_JOB_ID);
        }

        // Always queue an order recompute
        requiredJobsToSet.add(COMPUTE_ORDER_JOB_ID);

        break;
      case ABOUT_TO_CREATE:
        // Validate character ensuring only valid character entries are added
        validateCharacter(event, doc);
        break;
      case BEFORE_DOC_UPDATE:
        // Validate character ensuring only valid character entries are added
        validateCharacter(event, doc);

        if (confusablePropertyChanged(doc)) {
          // If confusables property changed, queue a cleanup
          requiredJobsToSet.add(CLEAN_CONFUSABLES_JOB_ID);
        }

        if (sortRelatedPropertyChanged(doc)) {
          // If sort order, title has changed, queue an order recompute
          requiredJobsToSet.add(COMPUTE_ORDER_JOB_ID);
        }
        break;

      case DOCUMENT_TRASHED:
      case DOCUMENT_UNTRASHED:
        // If a document is removed or restored, the sort order is impacted
        requiredJobsToSet.add(COMPUTE_ORDER_JOB_ID);
        break;

      default:
        // Do nothing
        break;
    }

    // Send event to add to required jobs
    if (!requiredJobsToSet.isEmpty()) {
      DocumentModel dialect = DialectUtils.getDialect(doc);
      RequiredJobsUtils.addToRequiredJobs(dialect, requiredJobsToSet);
    }
  }

  /**
   * Determines if a confusable has been added or changed
   */
  private boolean confusablePropertyChanged(DocumentModel characterDoc) {
    return characterDoc.getProperty(LC_CONFUSABLES).isDirty() || characterDoc
        .getProperty(UC_CONFUSABLES).isDirty();
  }

  /**
   * Determines if a field that impacts custom sort has changed
   */
  private boolean sortRelatedPropertyChanged(DocumentModel characterDoc) {
    return characterDoc.getProperty(DC_TITLE).isDirty() || characterDoc.getProperty(CHAR_ORDER)
        .isDirty() || characterDoc.getProperty(UC_CHAR).isDirty();
  }


  public void validateCharacter(Event event, DocumentModel characterDoc) {
    try {
      DocumentModelList characters = cleanupCharactersService.getCharacters(characterDoc);
      DocumentModel alphabet = cleanupCharactersService.getAlphabet(characterDoc);

      //All character documents except for the modified doc
      List<DocumentModel> otherCharacters = characters.stream()
          .filter(c -> !c.getId().equals(characterDoc.getId()))
          .collect(Collectors.toList());

      if (event.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE) || event.getName()
          .equals(DocumentEventTypes.ABOUT_TO_CREATE)) {

        // Ensures all characters are unique
        cleanupCharactersService.validateCharacters(otherCharacters, alphabet, characterDoc);

        // Ensures current character is valid
        cleanupCharactersService.validateConfusableCharacter(characterDoc, otherCharacters);
      }
    } catch (Exception exception) {
      event.markBubbleException();
      event.markRollBack();

      throw new NuxeoException(ExceptionHelper.unwrapException(new RecoverableClientException(
          "Bubbling exception by " + CharacterListener.class.getName(), exception.getMessage(),
          null)));
    }
  }
}