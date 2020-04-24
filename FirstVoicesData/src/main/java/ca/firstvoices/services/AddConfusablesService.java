package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public interface AddConfusablesService {

  public void addConfusables(CoreSession session, DocumentModel dialect);

}
