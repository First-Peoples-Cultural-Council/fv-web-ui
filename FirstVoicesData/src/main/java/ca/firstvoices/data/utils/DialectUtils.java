package ca.firstvoices.data.utils;

import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_DIALECT;

import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.transaction.TransactionHelper;

public final class DialectUtils {

  private DialectUtils() {
    throw new IllegalStateException("Utility class");
  }

  public static DocumentModel getDialect(DocumentModel currentDoc) {
    if (FV_DIALECT.equals(currentDoc.getType())) {
      return currentDoc;
    }

    return TransactionHelper.runInTransaction(() ->
      CoreInstance.doPrivileged(currentDoc.getRepositoryName(), (CoreSession session) ->
          DocumentUtils.getParentDoc(session, currentDoc, FV_DIALECT)
    ));
  }

  public static DocumentModel getDialect(CoreSession session, DocumentModel currentDoc) {
    if (FV_DIALECT.equals(currentDoc.getType())) {
      return currentDoc;
    }

    if (session == null) {
      return getDialect(currentDoc);
    } else {
      return DocumentUtils.getParentDoc(session, currentDoc, FV_DIALECT);
    }
  }

}
