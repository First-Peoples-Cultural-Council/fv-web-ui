package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public class SanitizeDocumentServiceImpl implements SanitizeDocumentService {
  
    //Sanitizes the document via various functions, and saves the document if edited
    public void sanitizeDocument(CoreSession session, DocumentModel currentDoc) {
        boolean edited = false;
        if((currentDoc.getType().equals("FVWord") || currentDoc.getType().equals("FVPhrase")) 
            && !currentDoc.isProxy()){
                edited = edited || trimSpaces(currentDoc);       
        }
        
        if(edited) session.saveDocument(currentDoc);
    }

    //Trims spaces if any spaces need to be trimmed
    private Boolean trimSpaces(DocumentModel currentDoc){

        String title = currentDoc.getTitle();
        if(!title.equals(title.trim())){        
            currentDoc.setPropertyValue("dc:title", title.trim());
            return true;
        }
        return false;
    }
}