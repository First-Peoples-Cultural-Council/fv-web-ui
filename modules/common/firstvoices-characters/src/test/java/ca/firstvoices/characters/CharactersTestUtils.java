package ca.firstvoices.characters;

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CHARACTER;

import ca.firstvoices.maintenance.common.CommonConstants;
import ca.firstvoices.maintenance.listeners.ManageRequiredJobsListener;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.test.CapturingEventListener;

public class CharactersTestUtils {
  private CharactersTestUtils() {
    throw new IllegalStateException("Utility class");
  }

  public static Event getAddToRequiredJobsEvent(CapturingEventListener capturingEvents) {
    List<Event> firedEvents = capturingEvents.getCapturedEvents();
    Event addToRequiredJobsEvent = firedEvents.stream().findFirst().filter(
        e -> CommonConstants.ADD_TO_REQUIRED_JOBS_EVENT_ID.equals(e.getName())
    ).orElse(null);

    return addToRequiredJobsEvent;
  }

  public static boolean requiredJobFired(CapturingEventListener capturingEventsListener, String requiredJob) {
    // Capture subsequent fired `addToRequiredJobs` events
    Event addToRequiredJobsEvent = CharactersTestUtils.getAddToRequiredJobsEvent(capturingEventsListener);

    if (addToRequiredJobsEvent == null) {
      return false;
    }

    @SuppressWarnings("unchecked")
    Set<String> jobs = (HashSet<String>) addToRequiredJobsEvent.getContext().getProperties().get(
        ManageRequiredJobsListener.JOB_IDS_PROP);

    return jobs.contains(requiredJob);
  }

  public static DocumentModelList createOrderedAlphabet(CoreSession session,
      String[] alphabet, String path) {
    DocumentModelList docs = new DocumentModelListImpl();
    Integer i = 0;
    for (String letter : alphabet) {
      DocumentModel letterDoc = session.createDocumentModel(path, letter, FV_CHARACTER);
      letterDoc.setPropertyValue("fvcharacter:alphabet_order", i);
      createDocument(session, letterDoc);
      i++;

      docs.add(letterDoc);
    }

    session.save();

    return docs;
  }

  public static DocumentModel createDocument(CoreSession session,
      DocumentModel model) {
    model.setPropertyValue("dc:title", model.getName());
    DocumentModel newDoc = session.createDocument(model);

    session.saveDocument(newDoc);
    return newDoc;
  }

}
