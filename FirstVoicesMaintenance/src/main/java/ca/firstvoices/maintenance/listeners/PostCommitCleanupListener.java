package ca.firstvoices.maintenance.listeners;

import ca.firstvoices.core.io.utils.DialectUtils;
import ca.firstvoices.core.io.utils.DocumentUtils;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
 * This is a general listener for post commit, async cleanup operations
 * Currently handled clearing tasks, but could be expanded to other uses or made abstract
 */
public class PostCommitCleanupListener implements PostCommitEventListener {

  public static final String GET_ALL_OPEN_TASKS_FOR_DOCUMENT = "GET_ALL_OPEN_TASKS_FOR_DOCUMENT";

  private ArrayList<String> endTaskEvents = new ArrayList<>();

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

      if (!ctx.getPrincipal().isAdministrator()
          && ctx instanceof DocumentEventContext) {
        // Only execute on non-admin events (system/FV), and when documents involved
        DocumentEventContext docCtx = (DocumentEventContext) ctx;
        DocumentModel doc = docCtx.getSourceDocument();

        if (DocumentUtils.isMutable(doc)
            && DialectUtils.isCoreType(doc.getType())) {
          // For core types, end tasks if present
          endRelatedTask(event, doc);
        }
      }
    }
  }

  /**
   * This is assessed when the event bundle is sent to the listener
   *
   * @return list of all events to handle; modify to handle more events.
   */
  private ArrayList<String> getEventsToHandle() {

    // Events that trigger ending a task
    endTaskEvents = new ArrayList<>();

    endTaskEvents.add(DocumentEventTypes.DOCUMENT_UPDATED);
    endTaskEvents.add(LifeCycleConstants.TRANSITION_EVENT);
    endTaskEvents.add(TrashService.DOCUMENT_TRASHED);

    return endTaskEvents;
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
   * Will "cancel" tasks that are related to the current document
   * @param event the current event handled in the bundle
   * @param coreTypeDoc the document to clear related tasks for
   */
  private void endRelatedTask(Event event, DocumentModel coreTypeDoc) {
    if (endTaskEvents.contains(event.getName())) {
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