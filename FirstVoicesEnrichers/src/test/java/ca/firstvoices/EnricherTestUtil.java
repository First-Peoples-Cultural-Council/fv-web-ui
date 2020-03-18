package ca.firstvoices;

import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.CoreSession;
import static org.junit.Assert.assertNotNull;

public class EnricherTestUtil{

    private DocumentModel langFamilyDoc;
    private DocumentModel languageDoc;
    private DocumentModel dialectDoc;
    private DocumentModel dictionaryDoc;

    public DocumentModel getCurrentLanguageFamily(){
        return langFamilyDoc;
    }

    public DocumentModel getCurrentLanguage(){
        return languageDoc;
    }

    public DocumentModel getCurrentDialect(){
        return dialectDoc;
    }

    public DocumentModel getCurrentDictionary(){
        return dictionaryDoc;
    }

    public void createSetup(CoreSession session) {
        startFresh(session);
        
        DocumentModel domain = createDocument(session, session.createDocumentModel("/", "FV", "Domain"));
      
        createDialectTree(session);

        session.save();
      }
      
      public DocumentModel createDocument(CoreSession session, DocumentModel model)
      {
        model.setPropertyValue("dc:title", model.getName());
        DocumentModel newDoc = session.createDocument(model);
        session.save();
        
        return newDoc;
      }
      
      public void startFresh(CoreSession session) {
        DocumentRef dRef = session.getRootDocument().getRef();
        DocumentModel defaultDomain = session.getDocument(dRef);
        
        DocumentModelList children = session.getChildren(defaultDomain.getRef());
        
        for ( DocumentModel child : children ) {
          recursiveRemove(session, child);
        }
      }
      
      private void recursiveRemove( CoreSession session, DocumentModel parent )
      {
        DocumentModelList children =  session.getChildren(parent.getRef());
        
        for( DocumentModel child : children )
        {
          recursiveRemove( session, child );
        }
        
        session.removeDocument(parent.getRef());
        session.save();
      }
      
      public DocumentModel createDialectTree(CoreSession session)
      {
        assertNotNull("Should have a valid Domain",
            createDocument(session, session.createDocumentModel("/", "FV", "Domain")));
        assertNotNull("Should have a valid Workspace",
            createDocument(session, session.createDocumentModel("/FV", "Workspaces", "WorkspaceRoot")));
        assertNotNull( "Should have a valid FVLanguageFamily",
            createDocument(session, session.createDocumentModel("/FV/Workspaces", "Family", "FVLanguageFamily")));
        assertNotNull( "Should have a valid FVLanguage",
            createDocument(session, session.createDocumentModel("/FV/Workspaces/Family", "Language", "FVLanguage")));
        dialectDoc = createDocument(session, session.createDocumentModel("/FV/Workspaces/Family/Language", "Dialect", "FVDialect"));
        assertNotNull("Should have a valid FVDialect", dialectDoc);
        session.save();
  
        return dialectDoc;
      }
    }