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

import ca.firstvoices.characters.services.CleanupCharactersService;
import ca.firstvoices.core.io.services.AssignAncestorsService;
import java.io.Serializable;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.SystemPrincipal;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventBundle;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventProducer;
import org.nuxeo.ecm.core.event.PostCommitFilteringEventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.core.event.impl.InlineEventContext;
import org.nuxeo.runtime.api.Framework;

/**
 * Event will perform scheduled operations on an alphabet: 1. Adding confusable characters to the
 * alphabet 2. Cleaning those confusable characters in existing words and phrases This event
 * responds to a schedule defined in resources/OSGI-INF/ca.firstvoices.schedules.xml
 */
public class CharacterListener implements PostCommitFilteringEventListener {

  public static final String DISABLE_CHARACTER_LISTENER = "disableCharacterListener";

  private static final String DC_TITLE = "dc:title";

  private static final String CHAR_ORDER = "fvcharacter:alphabet_order";
  private static final String LC_CONFUSABLES = "fvcharacter:confusable_characters";
  private static final String UC_CONFUSABLES = "fvcharacter:upper_case_confusable_characters";

  private static final String CHARACTER_TYPE = "FVCharacter";

  CleanupCharactersService cleanupCharactersService = Framework
      .getService(CleanupCharactersService.class);

  @Override
  public void handleEvent(EventBundle events) {
    for (Event event : events) {

      EventContext ctx = event.getContext();

      if (!(ctx instanceof DocumentEventContext)) {
        return;
      }

      DocumentModel characterDoc = ((DocumentEventContext) ctx).getSourceDocument();

      // Only apply to live workspace characters
      if (!CHARACTER_TYPE.equals(characterDoc.getType()) || characterDoc.isTrashed() || characterDoc
          .isProxy() || characterDoc.isVersion()) {
        return;
      }

      AssignAncestorsService ancestorsService = Framework
          .getService(AssignAncestorsService.class);

      DocumentModel dialect = ancestorsService.getDialect(characterDoc);

      // Set of required jobs to set
      HashSet<String> requiredJobsToSet = new HashSet<>();

      if (event.getName().equals(DOCUMENT_CREATED)) {

        if (cleanupCharactersService.hasConfusableCharacters(characterDoc)) {
          // If confusables are defined upon creation, queue a cleanup
          requiredJobsToSet.add(CLEAN_CONFUSABLES_JOB_ID);
        }

        // Always queue an order recompute
        requiredJobsToSet.add(COMPUTE_ORDER_JOB_ID);

      } else if (event.getName().equals(ABOUT_TO_CREATE)) {
        // Validate character ensuring only valid character entries are added
        validateCharacter(event, characterDoc);
      } else if (event.getName().equals(BEFORE_DOC_UPDATE)) {

        // Validate character ensuring only valid character entries are added
        validateCharacter(event, characterDoc);

        if (confusablePropertyChanged(characterDoc)) {
          // If confusables property changed, queue a cleanup
          requiredJobsToSet.add(CLEAN_CONFUSABLES_JOB_ID);
        }

        if (sortRelatedPropertyChanged(characterDoc)) {
          // If sort order, title has changed, queue an order recompute
          requiredJobsToSet.add(COMPUTE_ORDER_JOB_ID);
        }
      }

      // Send event to add to required jobs
      if (!requiredJobsToSet.isEmpty()) {
        sendEvent("addToRequiredJobs", requiredJobsToSet);
      }

      // This should be in an alphabet listener
      //If doc is alphabet, do another operation for ignored characters
      //      if (characterDoc.getDocumentType().getName().equals(DialectTypesConstants.FV_ALPHABET)
      //          && !characterDoc.isProxy()
      //          && !characterDoc.isVersion()) {
      //        try {
      //
      //          //only test on update, not creation as characters will not exist during creation
      //          if (event.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {
      //            DocumentModelList characters =
      //            cleanupCharactersService.getCharacters(characterDoc);
      //            DocumentModel alphabet = cleanupCharactersService.getAlphabet(characterDoc);
      //            cleanupCharactersService.validateAlphabetIgnoredCharacters(
      //            characters, alphabet);
      //
      //          }
      //
      //        } catch (Exception exception) {
      //          event.markBubbleException();
      //          event.markRollBack();
      //          throw exception;
      //        }
      //
      //      }

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
        .isDirty();
  }


  public void validateCharacter(Event event, DocumentModel characterDoc) {
    try {
      DocumentModelList characters = cleanupCharactersService.getCharacters(characterDoc);
      DocumentModel alphabet = cleanupCharactersService.getAlphabet(characterDoc);

      if (event.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {
        //All character documents except for the modified doc
        List<DocumentModel> filteredCharacters = characters.stream()
            .filter(c -> !c.getId().equals(characterDoc.getId()))
            .collect(Collectors.toList());
        cleanupCharactersService.validateCharacters(filteredCharacters, alphabet, characterDoc);
      }

      if (event.getName().equals(DocumentEventTypes.ABOUT_TO_CREATE)) {
        cleanupCharactersService.validateCharacters(characters, alphabet, characterDoc);

      }

    } catch (Exception exception) {
      event.markBubbleException();
      event.markRollBack();
      throw exception;
    }
  }

  @Override
  public boolean acceptEvent(Event event) {
    EventContext ctx = event.getContext();

    // Event conditions to not accept event
    if (!(ctx instanceof DocumentEventContext)) {
      return false;
    }

    Boolean blockListener = (Boolean) event.getContext().getProperty(DISABLE_CHARACTER_LISTENER);

    if (Boolean.TRUE.equals(blockListener)) {
      return false;
    }

    // Document conditions to not accept event
    DocumentModel doc = ((DocumentEventContext) ctx).getSourceDocument();

    if (doc == null) {
      return false;
    }

    return (DOCUMENT_CREATED.equals(event.getName()) || BEFORE_DOC_UPDATE.equals(event.getName()))
        && CHARACTER_TYPE.equals(doc.getType());
  }

  // This is sent for audit purposes at the moment
  // In the future Listeners could catch these events to send emails, and turn on features
  private void sendEvent(String eventId, Set<String> jobIds) {
    Map<String, Serializable> eventProperties = new HashMap<>();
    eventProperties.put("jobIds", (Serializable) jobIds);

    EventContext ctx = new InlineEventContext(new SystemPrincipal(null), eventProperties);
    Framework.getService(EventProducer.class).fireEvent(ctx.newEvent(eventId));
  }

}