// package ca.firstvoices.services;

// import org.nuxeo.ecm.core.api.CoreSession;
// import org.nuxeo.ecm.core.api.DocumentModel;

// public class SanitizeDocumentServiceImpl implements SanitizeDocumentService {
  
//     public void sanitizeDocument(CoreSession session, DocumentModel currentDoc) {
//         String title = currentDoc.getTitle();

//         currentDoc.setPropertyValue("dc:title", title.trim());
//         session.saveDocument(currentDoc);

//     }
// }