package ca.firstvoices.listeners;

import ca.firstvoices.services.AssignAncestorsService;
import ca.firstvoices.services.CleanupCharactersService;
import ca.firstvoices.services.SanitizeDocumentService;
import ca.firstvoices.workers.AddConfusablesToAlphabetWorker;
import ca.firstvoices.workers.CleanConfusablesForWordsAndPhrasesWorker;
import java.util.ArrayList;
import java.util.Arrays;
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
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;


public class FVDocumentListener extends AbstractFirstVoicesDataListener {

  private CoreSession session;
  private AssignAncestorsService assignAncestorsService = Framework
      .getService(AssignAncestorsService.class);
  protected SanitizeDocumentService sanitizeDocumentService = Framework
      .getService(SanitizeDocumentService.class);
  private CleanupCharactersService cleanupCharactersService = Framework
      .getService(CleanupCharactersService.class);
  private EventContext ctx;
  private Event e;
  private DocumentModel document;

  @Override
  public void handleEvent(Event event) {
    e = event;
    ctx = e.getContext();

  // computeAlphabetProcesses is not an instance of DocumentEventContext and does not carry a session.
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
    String[] types = {
        "FVAlphabet",
        "FVAudio",
        "FVBook",
        "FVBookEntry",
        "FVBooks",
        "FVCategories",
        "FVCategory",
        "FVCharacter",
        "FVContributor",
        "FVContributors",
        "FVDialect",
        "FVDictionary",
        "FVGallery",
        "FVLanguage",
        "FVLanguageFamily",
        "FVLink",
        "FVLinks",
        "FVPhrase",
        "FVPicture",
        "FVPortal",
        "FVResources",
        "FVVideo",
        "FVWord",
    };

    if (!Arrays.stream(types).parallel()
        .anyMatch(document.getDocumentType().toString()::contains)) {
      return;
    }

    assignAncestorsService.assignAncestors(session, document);
  }

  public void cleanupWordsAndPhrases() {
    if ((document.getType().equals("FVWord") || document.getType().equals("FVPhrase")) && !document
        .isProxy() && !document.isVersion()) {
      try {
        if (e.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {
          DocumentPart[] docParts = document.getParts();
          for (DocumentPart docPart : docParts) {
            Iterator<Property> dirtyChildrenIterator = docPart.getDirtyChildren();

            while (dirtyChildrenIterator.hasNext()) {
              Property property = dirtyChildrenIterator.next();
              String propertyName = property.getField().getName().toString();
              if (property.isDirty() && propertyName.equals("dc:title")) {
                cleanupCharactersService.cleanConfusables(session, document);
              }
            }
          }
        }
        if (e.getName().equals(DocumentEventTypes.ABOUT_TO_CREATE)) {
          cleanupCharactersService.cleanConfusables(session, document);
        }
      } catch (Exception exception) {
        rollBackEvent(e);
        throw exception;
      }
    }
  }

  public void sanitizeWord() {
    if ((document.getType().equals("FVWord") || document.getType().equals("FVPhrase"))
        && !document.isProxy() && !document.isVersion()) {
      sanitizeDocumentService.sanitizeDocument(session, document);
    }
  }

  public void validateCharacter() {
    if (document.getDocumentType().getName().equals("FVCharacter") && !document.isProxy() && !document.isVersion()) {
      try {
        DocumentModelList characters = getCharacters(document);

        if (e.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {
          List<DocumentModel> results = characters.stream().map(
              c -> c.getId().equals(document.getId()) ? document : c).collect(Collectors.toList());
          cleanupCharactersService.mapAndValidateConfusableCharacters(results);
        }

        if (e.getName().equals(DocumentEventTypes.ABOUT_TO_CREATE)) {
          cleanupCharactersService.mapAndValidateConfusableCharacters(characters);
        }

      } catch (Exception exception) {
        rollBackEvent(e);
        throw exception;
      }
    }
  }

  // This adds confusable characters to any alphabet WHERE fv-alphabet:update_confusables_required = 1
  private void addConfusableCharactersToAlphabets(CoreSession session) {
    String query = "SELECT * FROM FVAlphabet WHERE fv-alphabet:update_confusables_required = 1 AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";
    DocumentModelList alphabets = session.query(query);

    if (alphabets != null && alphabets.size() > 0) {
      WorkManager workManager = Framework.getService(WorkManager.class);
      for (DocumentModel alphabet : alphabets) {
        DocumentModel dialect = session.getParentDocument(alphabet.getRef());

        AddConfusablesToAlphabetWorker worker = new AddConfusablesToAlphabetWorker(
            dialect.getRef(), alphabet.getRef());

        workManager.schedule(worker);
      }
    }
  }

  private void cleanConfusablesFromWordsAndPhrases(CoreSession session) {
    String wordQuery = "SELECT * FROM FVWord WHERE fv-word:update_confusables_required = 1 AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";
    String phraseQuery = "SELECT * FROM FVPhrase WHERE fv-phrase:update_confusables_required = 1 AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";

    List<DocumentModel> list = new ArrayList<DocumentModel>() {{
      addAll(session.query(wordQuery));
      addAll(session.query(phraseQuery));
    }};

    if (list.size() > 0) {
      WorkManager workManager = Framework.getService(WorkManager.class);
      for (DocumentModel documentModel : list) {

        Boolean alphabetRequiresUpdate = (Boolean) getAlphabet(documentModel).getPropertyValue("fv-alphabet:update_confusables_required");

        if (alphabetRequiresUpdate.equals(false)) {
          CleanConfusablesForWordsAndPhrasesWorker worker = new CleanConfusablesForWordsAndPhrasesWorker(
              documentModel.getRef());
          workManager.schedule(worker);
        }
      }
    }
  }

}