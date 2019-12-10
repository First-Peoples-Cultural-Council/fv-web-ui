package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public class AssignAncestorsServiceImpl implements AssignAncestorsService {
  
  public void assignAncestors(CoreSession session, DocumentModel currentDoc) {
    
    // Get the parent document of each type for the current document using the helper method
    DocumentModel dialect = getParentDoc(session, currentDoc, "FVDialect");
    DocumentModel language = getParentDoc(session, currentDoc, "FVLanguage");
    DocumentModel languageFamily = getParentDoc(session, currentDoc, "FVLanguageFamily");
  
    // Set the property fva:family of the new document to be the UUID of the parent FVLanguageFamily document
    if (languageFamily != null) {
      currentDoc.setPropertyValue("fva:family", languageFamily.getId());
    }
  
    // Set the property fva:language of the new document to be the UUID of the parent FVLanguage document
    if (language != null) {
      currentDoc.setPropertyValue("fva:language", language.getId());
    }
  
    // Set the property fva:dialect of the new document to be the UUID of the parent FVDialect document
    if (dialect != null) {
      currentDoc.setPropertyValue("fva:dialect", dialect.getId());
    }
  
    session.saveDocument(currentDoc);
    
  }
  
  // Method to get the parent doc of type "currentType" for the current document
  private DocumentModel getParentDoc(CoreSession session, DocumentModel currentDoc, String currentType) {
    DocumentModel parent = session.getParentDocument(currentDoc.getRef());
    while (parent != null && !currentType.equals(parent.getType())) {
      parent = session.getParentDocument(parent.getRef());
    }
    return parent;
  }
  
}
