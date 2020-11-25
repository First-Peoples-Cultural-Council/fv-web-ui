package ca.firstvoices.core.io.utils;

import java.util.Collections;
import java.util.List;
import org.nuxeo.ecm.collections.api.CollectionConstants;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.versioning.VersioningService;
import org.nuxeo.ecm.platform.dublincore.listener.DublinCoreListener;

public final class SessionUtils {

  private SessionUtils() {
    throw new IllegalStateException("Utility class");
  }


  public static void disableDefaultEvents(DocumentModel doc) {
    doc.putContextData(DublinCoreListener.DISABLE_DUBLINCORE_LISTENER, true);
    doc.putContextData(CollectionConstants.DISABLE_NOTIFICATION_SERVICE, true);
    doc.putContextData(CollectionConstants.DISABLE_AUDIT_LOGGER, true);
    doc.putContextData(VersioningService.DISABLE_AUTO_CHECKOUT, true);
  }

  public static void enableDefaultEvents(DocumentModel doc) {
    doc.putContextData(DublinCoreListener.DISABLE_DUBLINCORE_LISTENER, null);
    doc.putContextData(CollectionConstants.DISABLE_NOTIFICATION_SERVICE, null);
    doc.putContextData(CollectionConstants.DISABLE_AUDIT_LOGGER, null);
    doc.putContextData(VersioningService.DISABLE_AUTO_CHECKOUT, null);
  }

  /**
   * Saves the document, without trigger subsequent listeners After the document has been saved,
   * context data will be reset
   *
   * @param session
   * @param documentToSave
   * @param disableDefault whether or not to disable the default built-in events
   * @param eventsToDisable list of custom events to disable
   * @return
   */
  public static DocumentModel saveDocumentWithoutEvents(CoreSession session,
      DocumentModel documentToSave, boolean disableDefault, List<String> eventsToDisable) {

    if (eventsToDisable == null) {
      eventsToDisable = Collections.emptyList();
    }

    if (disableDefault) {
      disableDefaultEvents(documentToSave);
    }

    // Make sure we avoid triggering events that trigger custom order recompute
    for (String listenerToDisable : eventsToDisable) {
      documentToSave.putContextData(listenerToDisable, true);
    }

    DocumentModel savedDoc = session.saveDocument(documentToSave);
    
    // Enable events after saving
    for (String listenerToDisable : eventsToDisable) {
      documentToSave.getContextData().remove(listenerToDisable);
    }

    if (disableDefault) {
      enableDefaultEvents(documentToSave);
    }

    return savedDoc;
  }
}
