package ca.firstvoices.listeners;

import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.core.schema.DocumentType;

import java.util.Arrays;

public class FVDocumentListener implements EventListener {
  
  @Context
  protected CoreSession session;
  
  @Override
  public void handleEvent(Event event) {
    DocumentModel dialect;
    DocumentModel language;
    DocumentModel languageFamily;
    
    EventContext ctx;
    ctx = event.getContext();
    if (!(ctx instanceof DocumentEventContext))
      return;
    
    DocumentEventContext docCtx = (DocumentEventContext) ctx;
    
    DocumentModel document = docCtx.getSourceDocument();
    
    if (!(checkType(document)))
      return;
    
    dialect = getParent(document.getRef(), "FVDialect");
    language = getParent(document.getRef(), "FVLanguage");
    languageFamily = getParent(document.getRef(), "FVLanguageFamily");
    
    if (languageFamily != null && !languageFamily.toString().trim().isEmpty()) {
      document.setPropertyValue("fva:family", languageFamily.getId());
    }
    
    if (language != null && !language.toString().trim().isEmpty()) {
      document.setPropertyValue("fva:language", language.getId());
    }
    
    if (dialect != null && !dialect.toString().trim().isEmpty()) {
      document.setPropertyValue("fva:dialect", dialect.getId());
    }
    
  }
  
  private DocumentModel getParent(DocumentRef inputDoc, String currentType) {
    currentType = currentType.trim();
    DocumentModel parent = session.getParentDocument(inputDoc);
    while (parent != null && !currentType.equals(parent.getType())) {
      parent = session.getParentDocument(parent.getRef());
    }
    return parent;
  }
  
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
    
    if ( Arrays.stream(types).parallel().anyMatch(currentType.toString()::contains) ) {
      return true;
    }
    return false;
  }
  
}