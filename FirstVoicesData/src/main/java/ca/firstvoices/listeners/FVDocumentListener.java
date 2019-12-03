package ca.firstvoices.listeners;

import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.schema.DocumentType;

import java.util.Arrays;

public class FVDocumentListener implements EventListener {
  
  @Context
  protected CoreSession session;
  
  @Context
  protected CoreSession sessionTwo;
  
  @Override
  public void handleEvent(Event event) {
    DocumentModel dialect;
    DocumentModel language;
    DocumentModel languageFamily;
    
    // Get event context and return if not DocumentEventContext
    EventContext ctx;
    ctx = event.getContext();
    if (!(ctx instanceof DocumentEventContext))
      return;
    
    CoreSession session = ctx.getCoreSession();
    
    DocumentEventContext docCtx = (DocumentEventContext) ctx;
    
    // Get document from context and return if it is not mutable
    DocumentModel document = ((DocumentEventContext) ctx).getSourceDocument();
    if (document == null || document.isImmutable()) {
      return;
    }
    DocumentRef testRef = session.getParentDocumentRef(document.getRef());
    
    // Check that the document is a specific type using the helper method
    if (!(checkType(document)))
      return;
    
  
    // Get the parent FVDialect document if it exists
    DocumentModel parent = session.getParentDocument(document.getRef());
    String currentType = "FVDialect";
    while (parent != null && !currentType.equals(parent.getType())) {
      parent = session.getParentDocument(parent.getRef());
    }
    dialect = parent;
  
    // Get the parent FVLanguage document if it exists
    parent = session.getParentDocument(document.getRef());
    currentType = "FVLanguage";
    while (parent != null && !currentType.equals(parent.getType())) {
      parent = session.getParentDocument(parent.getRef());
    }
    language = parent;
  
    // Get the parent FVLanguageFamily document if it exists
    parent = session.getParentDocument(document.getRef());
    currentType = "FVLanguageFamily";
    while (parent != null && !currentType.equals(parent.getType())) {
      parent = session.getParentDocument(parent.getRef());
    }
    languageFamily = parent;
    
    // Set the property fva:family of the new document to be the UUID of the parent FVLanguageFamily document
    if (languageFamily != null) {
      document.setPropertyValue("fva:family", languageFamily.getId());
      document = session.saveDocument(document);
    }
  
    // Set the property fva:language of the new document to be the UUID of the parent FVLanguage document
    if (language != null) {
      document.setPropertyValue("fva:language", language.getId());
      document = session.saveDocument(document);
    }
  
    // Set the property fva:dialect of the new document to be the UUID of the parent FVDialect document
    if (dialect != null) {
      document.setPropertyValue("fva:dialect", dialect.getId());
      document = session.saveDocument(document);
    }
    
  }
  
  // Helper method to get the parent document
  private DocumentModel getParent(DocumentRef inputDoc, String currentType) {
    
    if (currentType == null) {
      return session.getParentDocument(inputDoc);
    }
    currentType = currentType.trim();
    if (currentType.length() == 0) {
      return session.getParentDocument(inputDoc);
    }
    DocumentModel parent = session.getParentDocument(inputDoc);
    while (parent != null && !currentType.equals(parent.getType())) {
      parent = session.getParentDocument(parent.getRef());
    }
    return parent;
  }
  
  // Helper method to check that the new document is one of the types below
  private boolean checkType(DocumentModel inputDoc) {
    DocumentType currentType = inputDoc.getDocumentType();
    
    String[] types = {
        "FVAlphabet",
        "FVAudio",
        "FVBook",
        "FVBookEntry",
        "FVBooks",
        "FVCategories",
        "FVCategory",
        "FVCharacter",
        "FVContributor",
        "FVContributors",
        "FVDialect",
        "FVDictionary",
        "FVGallery",
        "FVLanguage",
        "FVLanguageFamily",
        "FVLink",
        "FVLinks",
        "FVPhrase",
        "FVPicture",
        "FVPortal",
        "FVResources",
        "FVVideo",
        "FVWord",
    };
  
    return Arrays.stream(types).parallel().anyMatch(currentType.toString()::contains);
  }
  
}