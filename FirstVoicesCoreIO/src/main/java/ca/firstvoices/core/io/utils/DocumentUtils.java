package ca.firstvoices.core.io.utils;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public final class DocumentUtils {

  private DocumentUtils() {
    throw new IllegalStateException("Utility class");
  }

  /**
   * Get parent doc of the specified type Use getParentRef since the currentDoc may not have been
   * created yet (e.g. when called during an aboutToCreate event)
   *
   * @param session     - current CoreSession
   * @param currentDoc  - document to get some parent doc of
   * @param currentType - Type looking to be returned
   * @return The parent document of the requested type, or null if it cannot be found.
   */
  public static DocumentModel getParentDoc(CoreSession session, DocumentModel currentDoc,
      String currentType) {
    DocumentModel parent = session.getDocument(currentDoc.getParentRef());
    while (parent != null && !currentType.equals(parent.getType())) {
      parent = session.getDocument(parent.getParentRef());
      if (parent.getType().equals("Root") && !currentType.equals("Root")) {
        return null;
      }
    }
    return parent;
  }

  /**
   * Checks if the document is an active workspace document and non trashed docs
   */
  public static boolean isActiveDoc(DocumentModel currentDoc) {
    return isMutable(currentDoc) && !currentDoc.isTrashed();
  }

  /**
   * Checks if the document is an active workspace document excludes proxies and versions (via
   * isImmutable). See https://doc.nuxeo.com/studio/filtering-options-reference-page/
   * for why !isImmutable + !isProxy
   */
  public static boolean isMutable(DocumentModel currentDoc) {
    return !currentDoc.isImmutable() && !currentDoc.isProxy();
  }
}
