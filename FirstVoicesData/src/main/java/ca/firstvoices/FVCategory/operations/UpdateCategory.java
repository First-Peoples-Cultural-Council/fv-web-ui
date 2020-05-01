package ca.firstvoices.FVCategory.operations;

import java.io.IOException;
import java.util.Map;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.collectors.DocumentModelCollector;
import org.nuxeo.ecm.core.api.ConcurrentUpdateException;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.PathRef;

/**
 *
 */
@Operation(id = UpdateCategory.ID, category = Constants.CAT_DOCUMENT, label = "Update Category", description = "Set multiple properties on the input document. Move document to new target location.")
public class UpdateCategory {

    public static final String ID = "Document.UpdateCategory";

    @Context
    protected CoreSession session;

    @Param(name="properties", required = false)
    protected Map<String, String> properties;

    @OperationMethod(collector = DocumentModelCollector.class)
    public DocumentModel run(DocumentModel doc) throws ConcurrentUpdateException, IOException {

        if (!doc.getType().equals("FVCategory")) {
            throw new NuxeoException("Document type must be FVCategory.");
        }

        if (properties.size() > 0) {
            for (Map.Entry<String, String> entry : properties.entrySet()) {
                if (entry.getKey().equals("ecm:parentRef")) {
                    session.saveDocument(doc);
                    String newTarget = entry.getValue();
                    boolean hasChildren = false;
                    if( session.hasChildren(doc.getRef())){
                        hasChildren = true;
                    }
                    
                    DocumentModel targetDocument = null;
                    
                    if (newTarget.contains("/Categories")) {
                        targetDocument = session.getDocument(new PathRef(newTarget));
                        newTarget = targetDocument.getId();
                    }else{
                        targetDocument = session.getDocument(new IdRef(newTarget));
                    } 

                    IdRef targetRef = new IdRef(newTarget);
                    // update Parent Category i.e. move document

                    DocumentModel parent = session.getDocument(doc.getParentRef());
                    
                    if(parent.getTitle().equals("Categories")){ 
                        if(!(targetDocument == null)
                            && !(targetDocument.getTitle().equals("Categories")) && hasChildren){
                            throw new NuxeoException("Cannot set parent category for category which already has children");
                        }
                    }

                    DocumentRef src = doc.getRef();
                    doc = session.move(src, targetRef, doc.getPropertyValue("dc:title").toString());
                } else {
                    doc.setPropertyValue(entry.getKey(), entry.getValue());
                }
            }
        }

        return session.saveDocument(doc);
    }
}
