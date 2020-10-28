package ca.firstvoices.testUtil.helpers;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

/**
 * Static methods for frequently-used patterns occurring in test code
 */
public class DocumentTestHelpers {

  public static DocumentModel createDocument(CoreSession session, DocumentModel model) {
    model.setPropertyValue("dc:title", model.getName());
    DocumentModel newDoc = session.createDocument(model);
    session.save();

    return newDoc;
  }

}
