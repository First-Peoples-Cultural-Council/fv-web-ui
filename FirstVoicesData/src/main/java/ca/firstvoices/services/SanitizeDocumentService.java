package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public interface SanitizeDocumentService {
  
  public void sanitizeDocument(CoreSession session, DocumentModel currentDoc);
  
}
