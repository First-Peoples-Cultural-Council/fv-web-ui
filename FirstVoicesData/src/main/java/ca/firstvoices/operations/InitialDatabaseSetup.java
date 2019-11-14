package ca.firstvoices.operations;

import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;

import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.AdministratorGroupsProvider;
import org.nuxeo.ecm.core.api.security.impl.ACLImpl;
import org.nuxeo.ecm.core.api.security.impl.ACPImpl;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.automation.AutomationService;

import java.util.*;

import org.nuxeo.ecm.core.api.DocumentModel;

/**
 *
 */
@Operation(id=InitialDatabaseSetup.ID, category= Constants.CAT_DOCUMENT, label="FVInitialDatabaseSetup", description="Describe here what your operation does.")
public class InitialDatabaseSetup {

    public static final String ID = "Document.InitialDatabaseSetup";
    
    public static final String SCHEMA_PUBLISHING = "publishing";
    
    public static final String SECTIONS_PROPERTY_NAME = "publish:sections";

    @Context
    protected CoreSession session;
    
    @Context
    protected UserManager userManager;

    @Param(name = "path", required = false)
    protected String path;
    
    protected OperationContext ctx;
    protected AutomationService automationService;
    protected AdministratorGroupsProvider administratorGroupsProvider;
    
    @OperationMethod
    public DocumentModel run() throws OperationException {
        if (StringUtils.isBlank(path)) {
    
            DocumentModel TEstDoc = session.createDocumentModel("/FV/Workspaces/Data", "TEst", "FVLanguageFamily");
            TEstDoc.setPropertyValue("dc:title", "TEst");
            TEstDoc = session.createDocument(TEstDoc);

            DocumentModel TestDoc = session.createDocumentModel("/FV/Workspaces/Data/TEst", "Test", "FVLanguage");
            TestDoc.setPropertyValue("dc:title", "Test");
            TestDoc = session.createDocument(TestDoc);

            DocumentModel SiteWorkspace = session.createDocumentModel("/FV/Workspaces", "Site", "Workspace");
            SiteWorkspace.setPropertyValue("dc:title", "Site");
            SiteWorkspace = session.createDocument(SiteWorkspace);

            DocumentModel SiteSection = session.createDocumentModel("/FV/sections", "Site", "Section");
            SiteSection.setPropertyValue("dc:title", "Site");
            SiteSection = session.createDocument(SiteSection);

            DocumentModel Resources = session.createDocumentModel("/FV/Workspaces/Site", "Resources", "FVResources");
            Resources.setPropertyValue("dc:title", "Resources");
            Resources = session.createDocument(Resources);

            DocumentModel Pages = session.createDocumentModel("/FV/Workspaces/Site/Resources", "Pages", "Folder");
            Pages.setPropertyValue("dc:title", "Pages");
            Pages = session.createDocument(Pages);

            DocumentModel SharedCategories = session.createDocumentModel("/FV/Workspaces/SharedData", "Shared Categories", "FVCategories");
            SharedCategories.setPropertyValue("dc:title", "Shared Categories");
            SharedCategories = session.createDocument(SharedCategories);

            DocumentModel SharedLinks = session.createDocumentModel("/FV/Workspaces/SharedData", "Shared Links", "FVLinks");
            SharedLinks.setPropertyValue("dc:title", "Shared Links");
            SharedLinks = session.createDocument(SharedLinks);

            DocumentModel SharedResources = session.createDocumentModel("/FV/Workspaces/SharedData", "Shared Resources", "FVResources");
            SharedResources.setPropertyValue("dc:title", "Shared Resources");
            SharedResources = session.createDocument(SharedResources);

            DocumentModel LanguageAdministrators = userManager.getBareGroupModel();
            LanguageAdministrators.setProperty("group", "groupname", "language_administrators");
            LanguageAdministrators.setProperty("group", "grouplabel", "Language Administators");
            userManager.createGroup(LanguageAdministrators);

            DocumentModel Recorders = userManager.getBareGroupModel();
            Recorders.setProperty("group", "groupname", "recorders");
            Recorders.setProperty("group", "grouplabel", "Recorders");
            userManager.createGroup(Recorders);

            DocumentModel RecordersWithApproval = userManager.getBareGroupModel();
            RecordersWithApproval.setProperty("group", "groupname", "recorders_with_approval");
            RecordersWithApproval.setProperty("group", "grouplabel", "Recorders With Approval");
            userManager.createGroup(RecordersWithApproval);

            DocumentModel members = userManager.getGroupModel("members");
            members.setProperty("group", "subGroups", Arrays.asList("language_administrators", "recorders", "recorders_with_approval"));
            userManager.updateGroup(members);

            DocumentModel root = session.getDocument(new PathRef("/"));
            ACPImpl acp = new ACPImpl();
            ACLImpl acl = new ACLImpl("ACL.LOCAL_ACL");
            acp.addACL(acl);
            ACE ace = new ACE("members", "Read", true);
            acl.add(ace);
            root.setACP(acp, false);

            DocumentModel sections = session.getDocument(new PathRef("/FV/sections"));
            ACPImpl acpTwo = new ACPImpl();
            ACLImpl aclTwo = new ACLImpl("ACL.LOCAL_ACL");
            acpTwo.addACL(aclTwo);
            ACE aceTwo = new ACE("Guest", "Read", true);
            aclTwo.add(aceTwo);
            sections.setACP(acpTwo, false);
            
            /*
                Setup publication targets.
             */
            DocumentModel target = session.getDocument(new PathRef("/FV/sections/Data"));
            String targetSectionId = target.getId();
            DocumentModel sourceDoc = session.getDocument(new PathRef("/FV/Workspaces/Data"));
            addSection(targetSectionId, sourceDoc);
    
            target = session.getDocument(new PathRef("/FV/sections/SharedData"));
            targetSectionId = target.getId();
            sourceDoc = session.getDocument(new PathRef("/FV/Workspaces/SharedData"));
            addSection(targetSectionId, sourceDoc);
    
            target = session.getDocument(new PathRef("/FV/sections/Site"));
            targetSectionId = target.getId();
            sourceDoc = session.getDocument(new PathRef("/FV/Workspaces/Site"));
            addSection(targetSectionId, sourceDoc);
            
            return session.getRootDocument();
        } else {
            return session.getDocument(new PathRef(path));
        }
    }
    
    private void addSection(String sectionId, DocumentModel currentDocument) {
        
        if (sectionId != null && currentDocument.hasSchema(SCHEMA_PUBLISHING)) {
            String[] sectionIdsArray = (String[]) currentDocument.getPropertyValue(SECTIONS_PROPERTY_NAME);
            
            List<String> sectionIdsList = new ArrayList<String>();
            
            if (sectionIdsArray != null && sectionIdsArray.length > 0) {
                sectionIdsList = Arrays.asList(sectionIdsArray);
                // make it resizable
                sectionIdsList = new ArrayList<String>(sectionIdsList);
            }
            
            sectionIdsList.add(sectionId);
            String[] sectionIdsListIn = new String[sectionIdsList.size()];
            sectionIdsList.toArray(sectionIdsListIn);
            
            currentDocument.setPropertyValue(SECTIONS_PROPERTY_NAME, sectionIdsListIn);
            session.saveDocument(currentDocument);
            session.save();
        }
    }
    
}
