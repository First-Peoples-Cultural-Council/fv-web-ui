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
import static ca.firstvoices.schemas.DialectTypesConstants.FV_AUDIO;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_BOOK;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_BOOKS;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_BOOK_ENTRY;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_CATEGORIES;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_CATEGORY;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_CHARACTER;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_CONTRIBUTOR;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_CONTRIBUTORS;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_DICTIONARY;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_GALLERY;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_LINK;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_LINKS;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_PICTURE;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_PORTAL;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_RESOURCES;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_VIDEO;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_WORD;
import static ca.firstvoices.schemas.DomainTypesConstants.FV_DIALECT;
import static ca.firstvoices.schemas.DomainTypesConstants.FV_LANGUAGE;
import static ca.firstvoices.schemas.DomainTypesConstants.FV_LANGUAGE_FAMILY;

import ca.firstvoices.services.AssignAncestorsService;
import ca.firstvoices.services.CleanupCharactersService;
import ca.firstvoices.services.SanitizeDocumentService;
import ca.firstvoices.workers.AddConfusablesToAlphabetWorker;
import ca.firstvoices.workers.CleanConfusablesForWordsAndPhrasesWorker;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
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
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;


public class FVDocumentListener extends AbstractFirstVoicesDataListener {

  protected SanitizeDocumentService sanitizeDocumentService = Framework
      .getService(SanitizeDocumentService.class);
  private CoreSession session;
  private final AssignAncestorsService assignAncestorsService = Framework
      .getService(AssignAncestorsService.class);
  private final CleanupCharactersService cleanupCharactersService = Framework
      .getService(CleanupCharactersService.class);
  private EventContext ctx;
  private Event event;
  private DocumentModel document;

  @Override
  public void handleEvent(Event event) {
    this.event = event;
    ctx = this.event.getContext();

    // computeAlphabetProcesses is not an instance of DocumentEventContext and does not carry a
    // session.
    if (event.getName().equals("computeAlphabetProcesses")) {
      CoreInstance
          .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
              session -> {
                addConfusableCharactersToAlphabets(session);
                cleanConfusablesFromWordsAndPhrases(session);
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
      validateCharacter();
    }

    if (event.getName().equals(DocumentEventTypes.DOCUMENT_CREATED)) {
      assignAncestors();
    }

    if (event.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {
      cleanupWordsAndPhrases();
      validateCharacter();
    }

    if (event.getName().equals(DocumentEventTypes.DOCUMENT_UPDATED)) {
      sanitizeWord();
    }

  }

  public void assignAncestors() {
    String[] types = { FV_ALPHABET, FV_AUDIO, FV_BOOK, FV_BOOK_ENTRY, FV_BOOKS, FV_CATEGORIES,
        FV_CATEGORY, FV_CHARACTER, FV_CONTRIBUTOR, FV_CONTRIBUTORS, FV_DIALECT, FV_DICTIONARY,
        FV_GALLERY, FV_LANGUAGE, FV_LANGUAGE_FAMILY, FV_LINK, FV_LINKS, FV_PHRASE, FV_PICTURE,
        FV_PORTAL, FV_RESOURCES, FV_VIDEO, FV_WORD };

    if (Arrays.stream(types).parallel()
        .noneMatch(document.getDocumentType().toString()::contains)) {
      return;
    }

    assignAncestorsService.assignAncestors(session, document);
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

  public void validateCharacter() {
    if (document.getDocumentType().getName().equals(FV_CHARACTER) && !document.isProxy()
        && !document.isVersion()) {
      try {
        DocumentModelList characters = getCharacters(document);
        DocumentModel alphabet = getAlphabet(document);

        if (event.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {
          //All character documents except for the modified doc
          List<DocumentModel> filteredCharacters = characters.stream()
              .filter(c -> !c.getId().equals(document.getId()))
              .collect(Collectors.toList());
          cleanupCharactersService.validateCharacters(filteredCharacters, alphabet, document);
        }

        if (event.getName().equals(DocumentEventTypes.ABOUT_TO_CREATE)) {
          cleanupCharactersService.validateCharacters(characters, alphabet, document);

        }

      } catch (Exception exception) {
        rollBackEvent(event);
        throw exception;
      }
    }

    //If doc is alphabet, do another operation for ignored characters
    if (document.getDocumentType().getName().equals(FV_ALPHABET) && !document.isProxy()
        && !document.isVersion()) {
      try {

        //only test on update, not creation as characters will not exist during creation
        if (event.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {
          DocumentModelList characters = getCharacters(document);
          DocumentModel alphabet = getAlphabet(document);
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

  private void cleanConfusablesFromWordsAndPhrases(CoreSession session) {
    String wordPhraseQuery = "SELECT * FROM FVWord, FVPhrase WHERE fv:update_confusables_required"
        + " = 1 AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";
    DocumentModelList wordsAndPhrases = session.query(wordPhraseQuery, 100);

    Map<String, Boolean> requiresUpdate = new HashMap<>();

    if (wordsAndPhrases.size() > 0) {

      WorkManager workManager = Framework.getService(WorkManager.class);
      for (DocumentModel documentModel : wordsAndPhrases) {

        String dialect = (String) documentModel.getPropertyValue("fva:dialect");

        // Cache whether or not the alphabet requires update
        Boolean alphabetRequiresUpdate;
        if (requiresUpdate.containsKey(dialect)) {
          alphabetRequiresUpdate = requiresUpdate.get(dialect);
        } else {
          alphabetRequiresUpdate = (Boolean) getAlphabet(documentModel)
              .getPropertyValue("fv-alphabet:update_confusables_required");
          if (alphabetRequiresUpdate == null) {
            alphabetRequiresUpdate = false;
          }
          requiresUpdate.put(dialect, alphabetRequiresUpdate);
        }

        if (alphabetRequiresUpdate.equals(false)) {
          CleanConfusablesForWordsAndPhrasesWorker worker =
              new CleanConfusablesForWordsAndPhrasesWorker(
              documentModel.getRef());
          workManager.schedule(worker);
        }
      }
    }
  }

}
