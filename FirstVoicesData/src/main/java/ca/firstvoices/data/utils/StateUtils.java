package ca.firstvoices.data.utils;

import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_DIALECT;

import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public final class StateUtils {

  private StateUtils() {
    throw new IllegalStateException("Utility class");
  }

  public static DocumentModel getDialect(DocumentModel currentDoc) {
    return CoreInstance.doPrivileged(currentDoc.getCoreSession(), s -> {
      return DocumentUtils.getParentDoc(s, currentDoc, FV_DIALECT);
    });
  }

  public static DocumentModel getDialect(CoreSession session, DocumentModel currentDoc) {
    if (session == null) {
      return getDialect(currentDoc);
    } else {
      return DocumentUtils.getParentDoc(session, currentDoc, FV_DIALECT);
    }
  }

}
