package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public interface AddConfusablesService {

  void addConfusables(CoreSession session, DocumentModel dialect);

  DocumentModel updateConfusableCharacters(CoreSession session, DocumentModel characterDocument, DocumentModel dialect,
      String characterToUpdate, String[] newConfusables);

}
