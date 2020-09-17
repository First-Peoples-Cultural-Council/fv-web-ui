package ca.firstvoices.core.io.utils;

import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_DIALECT;

import ca.firstvoices.data.exceptions.FVDocumentHierarchyException;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.transaction.TransactionHelper;

public final class DialectUtils {

  private DialectUtils() {
    throw new IllegalStateException("Utility class");
  }

  public static boolean isDialect(DocumentModel currentDoc) {
    return currentDoc != null && FV_DIALECT.equals(currentDoc.getType());
  }

  public static DocumentModel getDialect(DocumentModel currentDoc) {
    if (isDialect(currentDoc)) {
      return currentDoc;
    }

    DocumentModel dialect = TransactionHelper.runInTransaction(() ->
        CoreInstance.doPrivileged(currentDoc.getRepositoryName(), (CoreSession session) ->
            DocumentUtils.getParentDoc(session, currentDoc, FV_DIALECT)));

    if (dialect == null) {
      throw new FVDocumentHierarchyException(
          "Get dialect should not be called on a document that is above a dialect.", 400);
    }
    return dialect;
  }

  public static DocumentModel getDialect(CoreSession session, DocumentModel currentDoc) {
    if (isDialect(currentDoc)) {
      return currentDoc;
    }

    if (session == null) {
      return getDialect(currentDoc);
    } else {
      DocumentModel dialect = DocumentUtils.getParentDoc(session, currentDoc, FV_DIALECT);
      if (dialect == null) {
        throw new FVDocumentHierarchyException(
            "Get dialect should not be called on a document that is above a dialect.", 400);
      }
      return dialect;
    }
  }

}
