package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public interface AssignAncestorsService {
  
  public void assignAncestors(CoreSession session, DocumentModel currentDoc);
  
}
