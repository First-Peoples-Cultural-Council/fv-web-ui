package ca.firstvoices.data.utils;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public final class DocumentUtils {

  private DocumentUtils() {
    throw new IllegalStateException("Utility class");
  }

  /**
   * Get parent doc of the specified type
   * Use getParentRef since the currentDoc may not have been created yet
   * (e.g. when called during an aboutToCreate event)
   * @param session
   * @param currentDoc
   * @param currentType
   * @return
   */
  public static DocumentModel getParentDoc(CoreSession session, DocumentModel currentDoc,
      String currentType) {
    DocumentModel parent = session.getDocument(currentDoc.getParentRef());
    while (parent != null && !currentType.equals(parent.getType())) {
      parent = session.getDocument(parent.getParentRef());
    }
    return parent;
  }

  /**
   * Checks if the document is an active workspace document
   * Excludes proxies and versions (via isImmutable) and trashed docs
   * @param currentDoc
   * @return
   */
  public static boolean isActiveDoc(DocumentModel currentDoc) {
    return !currentDoc.isImmutable() && !currentDoc.isTrashed();
  }
}
