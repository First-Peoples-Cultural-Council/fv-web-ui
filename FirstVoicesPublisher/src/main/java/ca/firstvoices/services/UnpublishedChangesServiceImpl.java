package ca.firstvoices.services;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.schema.DocumentType;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.runtime.api.Framework;

import java.util.Arrays;

public class UnpublishedChangesServiceImpl implements UnpublishedChangesService {
    
    public boolean checkUnpublishedChanges(CoreSession session, DocumentModel document) {
    
        FirstVoicesPublisherService FVPublisherService = Framework.getService(FirstVoicesPublisherService.class);
        
        // Check that the document is a specific type using the helper method
        if (!(checkType(document)))
            return false;
    
        // Check that the document is currently published
        if (! document.getCurrentLifeCycleState().equals("Published")) {
            return false;
        }

        /*
             A privileged session is used to get the workspaces doc ref and versions in case the
             service is being called from a place that does not have access to the workspaces document.
        */
        DocumentRef workspacesDocRef = CoreInstance.doPrivileged(session, s -> {
            return s.getSourceDocument(document.getRef()).getRef();
        });
        
        int majorVerDoc = CoreInstance.doPrivileged(session, s -> {
            return Integer.parseInt(s.getWorkingCopy(document.getRef()).getPropertyValue("uid:major_version").toString());
        });
        int minorVerDoc = CoreInstance.doPrivileged(session, s -> {
            return Integer.parseInt(s.getWorkingCopy(document.getRef()).getPropertyValue("uid:minor_version").toString());
        });
        
        // Get the sections document and versions
        DocumentModel sectionsDoc = FVPublisherService.getPublication(session, workspacesDocRef);
        int majorVerSections =  Integer.parseInt(sectionsDoc.getPropertyValue("uid:major_version").toString());
        int minorVerSections =  Integer.parseInt(sectionsDoc.getPropertyValue("uid:minor_version").toString());
        
        /*
                Use the helper method to compare versions of the document and return true if the sections
                version is older then the workspaces version.
            */
        return compareVersions(majorVerDoc, minorVerDoc, majorVerSections, minorVerSections);
    }

    // Helper method to check if the workspaces document version is greater then then sections document version
    private boolean compareVersions(int majorVerDoc, int minorVerDoc, int majorVerSections, int minorVerSections) {
        if (majorVerDoc > majorVerSections) {
            return true;
        } else return majorVerDoc == majorVerSections && minorVerDoc > minorVerSections;
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
