package ca.firstvoices.testUtil;

import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.CoreSession;
import static org.junit.Assert.assertNotNull;

public class AssignAncestorsTestUtil {
  
  private DocumentModel dialectDoc;
  
  public DocumentModel getCurrentDialect()
  {
    return dialectDoc;
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
  
  public void createDialectTree(CoreSession session)
  {
    assertNotNull("Should have a valid FVLanguageFamiliy",
        createDocument(session, session.createDocumentModel("/FV", "Family", "FVLanguageFamily")));
    assertNotNull( "Should have a valid FVLanguage",
        createDocument(session, session.createDocumentModel("/FV/Family", "Language", "FVLanguage")));
    dialectDoc = createDocument(session, session.createDocumentModel("/FV/Family/Language", "Dialect", "FVDialect"));
    assertNotNull("Should have a valid FVDialect", dialectDoc);
  
  }
  
}
