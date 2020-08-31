package ca.firstvoices.data.utils;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public final class DocumentUtils {

  private DocumentUtils() {
    throw new IllegalStateException("Utility class");
  }

  /**
   * Get parent doc of the specified type
   *
   * @param session
   * @param currentDoc
   * @param currentType
   * @return
   */
  public static DocumentModel getParentDoc(CoreSession session, DocumentModel currentDoc,
      String currentType) {
    DocumentModel parent = session.getParentDocument(currentDoc.getRef());
    while (parent != null && !currentType.equals(parent.getType())) {
      parent = session.getParentDocument(parent.getRef());
    }
    return parent;
  }
}
