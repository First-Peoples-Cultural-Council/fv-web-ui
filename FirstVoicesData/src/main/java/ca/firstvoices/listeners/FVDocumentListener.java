package ca.firstvoices.listeners;

import org.nuxeo.ecm.core.api.model.Property;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;

import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.collectors.DocumentModelCollector;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;

import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.collectors.DocumentModelCollector;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.core.schema.DocumentType;
import org.nuxeo.ecm.automation.core.operations.document.GetDocumentParent;
import org.nuxeo.ecm.core.schema.types.SimpleType;
import org.nuxeo.ecm.core.schema.types.Type;

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
    
    EventContext ctx;
    ctx = event.getContext();
    if (!(ctx instanceof DocumentEventContext))
      return;
    
    CoreSession session = ctx.getCoreSession();
    
    DocumentEventContext docCtx = (DocumentEventContext) ctx;
    
    DocumentModel document = ((DocumentEventContext) ctx).getSourceDocument();
    if (document == null) {
      return;
    }
    DocumentRef testRef = session.getParentDocumentRef(document.getRef());
    
    if (!(checkType(document)))
      return;
    
  
  
    DocumentModel parent = session.getParentDocument(document.getRef());
    String currentType = "FVDialect";
    while (parent != null && !currentType.equals(parent.getType())) {
      parent = session.getParentDocument(parent.getRef());
    }
    dialect = parent;
  
    parent = session.getParentDocument(document.getRef());
    currentType = "FVDialect";
    while (parent != null && !currentType.equals(parent.getType())) {
      parent = session.getParentDocument(parent.getRef());
    }
    language = parent;
  
    parent = session.getParentDocument(document.getRef());
    currentType = "FVDialect";
    while (parent != null && !currentType.equals(parent.getType())) {
      parent = session.getParentDocument(parent.getRef());
    }
    languageFamily = parent;
    
    if (languageFamily != null) {
//      document.setPropertyValue("fva:family", languageFamily.getId());
    }

    if (language != null) {
//      document.setPropertyValue("fva:language", language.getId());
    }

    if (dialect != null) {
//      document.setPropertyValue("fva:dialect", dialect.getId());
    }
    
  }
  
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