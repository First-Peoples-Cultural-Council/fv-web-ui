package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.schema.DocumentType;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.core.api.CoreSession;

import java.util.Arrays;

public class UnpublishedChangesServiceImpl implements UnpublishedChangesService {

    public boolean checkUnpublishedChanges(CoreSession session, DocumentModel document) {
        
        // Check that the document is a specific type using the helper method
        if (!(checkType(document)))
            return false;
        
        // Get the Workspaces document
        String path = document.getPathAsString();
        String[] splitDocPath = path.split("/");
        for (int i=0; i<splitDocPath.length; i++) {
            if (splitDocPath[i].equals("sections")) {
                splitDocPath[i] = "Workspaces";
            }
        }
        path = String.join("/", splitDocPath);
        String workspacePath = path;

        /*
            Get the workspaces version and status of the document using a privileged session
            in case the service is being called from a place that does not have access to the
            sections document.
        */
        String[] workspaceInfo = CoreInstance.doPrivileged(session, s -> {
            DocumentModel workspacesDocument = s.getDocument((new PathRef(workspacePath)));
            String majorVerDoc = workspacesDocument.getPropertyValue("uid:major_version").toString();
            String minorVerDoc = workspacesDocument.getPropertyValue("uid:minor_version").toString();
            String status = workspacesDocument.getCurrentLifeCycleState();
            return new String[] {majorVerDoc, minorVerDoc, status};
        });

        int majorVerDoc = Integer.parseInt(workspaceInfo[0]);
        int minorVerDoc = Integer.parseInt(workspaceInfo[1]);
        String status = workspaceInfo[2];

        // Check that the document is currently published
        if (! status.equals("Published")) {
            return false;
        }

        // Get the sections document
        String[] splitPath = path.split("/");
        for (int i=0; i<splitPath.length; i++) {
            if (splitPath[i].equals("Workspaces")) {
                splitPath[i] = "sections";
            }
        }
        String sectionsPath = String.join("/", splitPath);
        DocumentModel sectionsDocument = session.getDocument(new PathRef(sectionsPath));

        // Get the sections version
        int majorVerSections = Integer.parseInt(sectionsDocument.getPropertyValue("uid:major_version").toString());
        int minorVerSections = Integer.parseInt(sectionsDocument.getPropertyValue("uid:minor_version").toString());

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
