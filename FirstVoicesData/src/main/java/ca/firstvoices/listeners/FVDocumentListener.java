package ca.firstvoices.listeners;

import ca.firstvoices.services.AssignAncestorsService;
import ca.firstvoices.services.SanitizeDocumentService;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.schema.DocumentType;
import org.nuxeo.runtime.api.Framework;

import org.nuxeo.ecm.core.api.event.DocumentEventTypes;

import java.util.Arrays;

public class FVDocumentListener implements EventListener {
  
  @Context
  protected CoreSession session;
  
  protected AssignAncestorsService service = Framework.getService(AssignAncestorsService.class);
  protected SanitizeDocumentService sanitize = Framework.getService(SanitizeDocumentService.class);

  @Override
  public void handleEvent(Event event) {
    
    // Get event context and return if not DocumentEventContext
    EventContext ctx;
    ctx = event.getContext();
    if (!(ctx instanceof DocumentEventContext))
      return;
    
    // Get document from context and return if it is not mutable
    DocumentModel document = ((DocumentEventContext) ctx).getSourceDocument();
    if (document == null || document.isImmutable()) {
      return;
    }
    
    // Check that the document is a specific type using the helper method
    if (!(checkType(document)))
      return;
    
    CoreSession session = ctx.getCoreSession();
    
    // If the document is mutable and is the proper type then assign its ancestors.
    if(event.getName().equals(DocumentEventTypes.DOCUMENT_CREATED))
      service.assignAncestors(session, document);
    if(event.getName().equals(DocumentEventTypes.DOCUMENT_UPDATED)) {
      if((document.getType().equals("FVWord") || document.getType().equals("FVPhrase")) 
            && !document.isProxy()){
        sanitize.sanitizeDocument(session, document);
      }
    }
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