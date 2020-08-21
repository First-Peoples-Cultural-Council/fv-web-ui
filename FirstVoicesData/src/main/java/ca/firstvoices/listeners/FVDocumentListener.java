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

package ca.firstvoices.listeners;

import static ca.firstvoices.schemas.DialectTypesConstants.FV_ALPHABET;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_CHARACTER;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_WORD;

import ca.firstvoices.services.CleanupCharactersService;
import ca.firstvoices.services.SanitizeDocumentService;
import ca.firstvoices.workers.AddConfusablesToAlphabetWorker;
import ca.firstvoices.workers.CleanConfusablesForDictionaryWorker;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.api.model.DocumentPart;
import org.nuxeo.ecm.core.api.model.Property;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;


public class FVDocumentListener implements EventListener {


  public static final String DISABLE_FVDOCUMENT_LISTENER = "disableFVDocumentListener";

  protected SanitizeDocumentService sanitizeDocumentService = Framework
      .getService(SanitizeDocumentService.class);
  private CoreSession session;
  private final CleanupCharactersService cleanupCharactersService = Framework
      .getService(CleanupCharactersService.class);
  private EventContext ctx;
  private Event event;
  private DocumentModel document;

  @Override
  public void handleEvent(Event event) {
    this.event = event;
    ctx = this.event.getContext();

    Boolean block = (Boolean) event.getContext().getProperty(DISABLE_FVDOCUMENT_LISTENER);
    if (Boolean.TRUE.equals(block)) {
      // ignore the event - we are blocked by the caller
      return;
    }

    // computeAlphabetProcesses is not an instance of DocumentEventContext and does not carry a
    // session.
    if (event.getName().equals("computeAlphabetProcesses")) {
      CoreInstance
          .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
              session -> {
                addConfusableCharactersToAlphabets(session);
                cleanConfusablesFromWordsAndPhrases();
              });
    }

    if (!(ctx instanceof DocumentEventContext)) {
      return;
    }


    session = ctx.getCoreSession();
    document = ((DocumentEventContext) ctx).getSourceDocument();
    if (document == null || document.isImmutable()) {
      return;
    }

    if (event.getName().equals(DocumentEventTypes.ABOUT_TO_CREATE)) {
      cleanupWordsAndPhrases();
      validateCharacter(document);
      sanitizeWord();
    }

    // Cleanup words and phrases unless update was triggered within CleanupCharacterService
    if (event.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {
      if (Boolean.TRUE
          .equals(document.getContextData("clean_confusables_update"))) {
        cleanupWordsAndPhrases();
      }
      validateCharacter(document);

      sanitizeWord();
    }
  }

  public void cleanupWordsAndPhrases() {
    if ((document.getType().equals(FV_WORD) || document.getType().equals(FV_PHRASE)) && !document
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
        rollBackEvent(event);
        throw exception;
      }
    }
  }

  public void sanitizeWord() {
    if ((document.getType().equals(FV_WORD) || document.getType().equals(FV_PHRASE)) && !document
        .isProxy() && !document.isVersion()) {
      sanitizeDocumentService.sanitizeDocument(session, document);
    }
  }

  public void validateCharacter(DocumentModel characterDoc) {
    if (characterDoc.getDocumentType().getName().equals(FV_CHARACTER) && !characterDoc.isProxy()
        && !characterDoc.isVersion()) {
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
        rollBackEvent(event);
        throw exception;
      }
    }

    //If doc is alphabet, do another operation for ignored characters
    if (characterDoc.getDocumentType().getName().equals(FV_ALPHABET) && !characterDoc.isProxy()
        && !characterDoc.isVersion()) {
      try {

        //only test on update, not creation as characters will not exist during creation
        if (event.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {
          DocumentModelList characters = cleanupCharactersService.getCharacters(characterDoc);
          DocumentModel alphabet = cleanupCharactersService.getAlphabet(characterDoc);
          cleanupCharactersService.validateAlphabetIgnoredCharacters(characters, alphabet);

        }

      } catch (Exception exception) {
        rollBackEvent(event);
        throw exception;
      }

    }
  }

  // This adds confusable characters to any alphabet WHERE
  // fv-alphabet:update_confusables_required = 1
  private void addConfusableCharactersToAlphabets(CoreSession session) {
    String query = "SELECT * FROM FVAlphabet WHERE fv-alphabet:update_confusables_required = 1 "
        + "AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";
    // Only process 100 documents at a time
    DocumentModelList alphabets = session.query(query, 100);

    if (alphabets != null && alphabets.size() > 0) {
      WorkManager workManager = Framework.getService(WorkManager.class);
      for (DocumentModel alphabet : alphabets) {
        DocumentModel dialect = session.getParentDocument(alphabet.getRef());

        AddConfusablesToAlphabetWorker worker = new AddConfusablesToAlphabetWorker(dialect.getRef(),
            alphabet.getRef());

        workManager.schedule(worker);
      }
    }
  }

  private void cleanConfusablesFromWordsAndPhrases() {
    // Process 100 cleanups on words/phrases within worker
    WorkManager workManager = Framework.getService(WorkManager.class);
    CleanConfusablesForDictionaryWorker worker = new CleanConfusablesForDictionaryWorker();
    workManager.schedule(worker);
  }

  protected void rollBackEvent(Event event) {
    event.markBubbleException();
    event.markRollBack();
  }

}
