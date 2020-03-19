package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public class SanitizeDocumentServiceImpl implements SanitizeDocumentService {
  

    //Sanitizes the document via various functions, and saves the document if edited
    //This is meant to be the default, catch-all operation
    public void sanitizeDocument(CoreSession session, DocumentModel currentDoc) {
        boolean edited = false;
        edited = edited || trimWhitespace(currentDoc, "dc:title");       
        
        if(edited) session.saveDocument(currentDoc);
    }
    
    
    //This method is to be altered in the future after some architectural discussions - Mar. 13 / 2020
    //(As such it is currently unused)
    private boolean trimWhitespaceAllProperties(DocumentModel currentDoc, String[] propertyName){
        
        boolean edited = false;
        for (String property : propertyName){
            edited = edited || trimWhitespace(currentDoc, property);
        }
        return edited;
    }

    //This method is what actually trims the whitespace of a specific property of a given document
    private boolean trimWhitespace(DocumentModel currentDoc, String propertyName){
        if (currentDoc == null || propertyName == null) return false;

        Object property = currentDoc.getPropertyValue(propertyName);
        if (property == null) return false;

        if(property.getClass().equals(String.class) ){
            String val = (String) property;

            if(!val.equals(val.trim())){        
                currentDoc.setPropertyValue(propertyName, val.trim());
                return true;
            }
        }
        return false;
    }

}