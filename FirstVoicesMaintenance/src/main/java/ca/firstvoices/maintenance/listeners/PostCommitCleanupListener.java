package ca.firstvoices.maintenance.listeners;

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CATEGORY;
import static ca.firstvoices.maintenance.dialect.categories.Constants.CLEAN_CATEGORY_REFERENCES_JOB_ID;

import ca.firstvoices.core.io.utils.DialectUtils;
import ca.firstvoices.core.io.utils.DocumentUtils;
import ca.firstvoices.maintenance.common.RequiredJobsUtils;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.LifeCycleConstants;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.api.trash.TrashService;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventBundle;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.PostCommitEventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.platform.query.api.PageProvider;
import org.nuxeo.ecm.platform.query.api.PageProviderService;
import org.nuxeo.ecm.platform.query.nxql.CoreQueryDocumentPageProvider;
import org.nuxeo.runtime.api.Framework;


/**
 * This is a general listener for post commit, async cleanup operations Currently handled clearing
 * tasks, but could be expanded to other uses or made abstract
 */
public class PostCommitCleanupListener implements PostCommitEventListener {

  public static final String GET_ALL_OPEN_TASKS_FOR_DOCUMENT = "GET_ALL_OPEN_TASKS_FOR_DOCUMENT";

  private ArrayList<String> endTaskEvents = new ArrayList<>();

  private ArrayList<String> cleanReferencesEvents = new ArrayList<>();

  @Override
  public void handleEvent(EventBundle events) {
    if (eventShouldBeHandled(events)) {
      for (Event event : events) {
        handleEvent(event);
      }
    }
  }

  /**
   * Will handle individual events
   *
   * @param event the specific event to check against in the bundle
   */
  public void handleEvent(Event event) {
    if (getEventsToHandle().contains(event.getName())) {
      // Operations to execute for core types
      EventContext ctx = event.getContext();

      if (ctx instanceof DocumentEventContext) {
        DocumentEventContext docCtx = (DocumentEventContext) ctx;
        DocumentModel doc = docCtx.getSourceDocument();

        endRelatedTask(event, doc);
        cleanReferences(event, doc);
      }
    }
  }

  /**
   * This is assessed when the event bundle is sent to the listener
   *
   * @return set of all events to handle; modify to handle more events.
   */
  private Set<String> getEventsToHandle() {

    // Events that trigger ending a task
    endTaskEvents = new ArrayList<>();

    endTaskEvents.add(DocumentEventTypes.DOCUMENT_UPDATED);
    endTaskEvents.add(LifeCycleConstants.TRANSITION_EVENT);
    endTaskEvents.add(TrashService.DOCUMENT_TRASHED);

    // Events that trigger cleaning references
    cleanReferencesEvents = new ArrayList<>();
    cleanReferencesEvents.add(TrashService.DOCUMENT_TRASHED);

    // Return combined set of all events
    return Stream.of(endTaskEvents, cleanReferencesEvents)
        .flatMap(Collection::stream)
        .collect(Collectors.toSet());
  }

  /**
   * Checks if the event bundle contains any of the events we want to handle
   *
   * @param events a collection of events fired
   * @return true if event should be handled; false otherwise
   */
  private boolean eventShouldBeHandled(EventBundle events) {
    return getEventsToHandle().stream().anyMatch((events::containsEventName));
  }

  /**
   * Will setup a job to clean references to categories/phrase books that have been trashed
   * Only applies to documents of type FV_CATEGORY
   * @param event the current event handled in the bundle
   * @param doc   the document, a category, to clear references for
   */
  private void cleanReferences(Event event, DocumentModel doc) {
    if (cleanReferencesEvents.contains(event.getName()) && DocumentUtils.isMutable(doc)
        && FV_CATEGORY.equals(doc.getType())) {
      RequiredJobsUtils
          .addToRequiredJobs(DialectUtils.getDialect(doc), CLEAN_CATEGORY_REFERENCES_JOB_ID);
    }
  }

  /**
   * Will "cancel" tasks that are related to the current document Only applies to non system admin
   * operations, and mutable core documents
   *
   * @param event       the current event handled in the bundle
   * @param coreTypeDoc the document to clear related tasks for
   */
  private void endRelatedTask(Event event, DocumentModel coreTypeDoc) {
    if (endTaskEvents.contains(event.getName()) && !event.getContext().getPrincipal()
        .isAdministrator() && DocumentUtils.isMutable(coreTypeDoc)
        && DialectUtils.isCoreType(coreTypeDoc.getType())) {

      Map<String, Serializable> pageProviderProps = new HashMap<>();

      // Core session to use with page provider
      pageProviderProps.put(CoreQueryDocumentPageProvider.CORE_SESSION_PROPERTY,
          (Serializable) event.getContext().getCoreSession());

      // Use cache if available
      pageProviderProps.put(CoreQueryDocumentPageProvider.CHECK_QUERY_CACHE_PROPERTY, true);

      // Get all open tasks for the core type
      PageProviderService pps = Framework.getService(PageProviderService.class);
      PageProvider<?> pp = pps.getPageProvider(GET_ALL_OPEN_TASKS_FOR_DOCUMENT, null, null, 0L,
          pageProviderProps, coreTypeDoc.getId());

      @SuppressWarnings("unchecked")
      List<DocumentModel> entries = (List<DocumentModel>) pp.getCurrentPage();
      if (entries != null) {
        for (DocumentModel task : entries) {
          // Cancel task
          String action = "cancel";
          if (task.getAllowedStateTransitions().contains(action)) {
            task.followTransition(action);
          }
        }
      }
    }
  }
}