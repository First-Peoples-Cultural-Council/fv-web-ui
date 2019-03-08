package firstvoices.editors.testUtil;

import ca.firstvoices.editors.services.DraftEditorService;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.ArrayList;
import java.util.ArrayList;
import java.util.Map;

public interface draftDocTestUtil
{
    public DocumentModel getCurrentDialect();
    public void createSetup(CoreSession session );
    public DocumentModel[] getTestWordsArray(CoreSession session);
    public void publishWords( CoreSession session );
    public DocumentModel createDialectTree(CoreSession session);
    public DocumentModel createDocument(CoreSession session, DocumentModel model );
    public void createWords( CoreSession session);
    public ArrayList<Map<String, String>> createListMapTestData(String[] keys, String[] values );
    public void checkListMapTestData(ArrayList<Object> property, String[] keys, String values[] );
    public void startEditViaAutomation(AutomationService automationService, DocumentModel[] docArray );
    public void publishDraftViaAutomation(AutomationService automationService, DraftEditorService draftEditorServiceInstance, DocumentModel[] docArray );
    public void checkDraftEditLock( DraftEditorService draftEditorServiceInstance, DocumentModel[] docArray );
    public void checkAfterReleaseSave(DraftEditorService draftEditorServiceInstance, DocumentModel[] docArray );
    public void releaseDraftEditLockViaAutomation( AutomationService automationService, DraftEditorService draftEditorServiceInstance, DocumentModel[] docArray);
    public void saveDraftViaAutomation(AutomationService automationService, DraftEditorService draftEditorServiceInstance, DocumentModel[] docArray);
    public void terminateDraftEditViaAutomation( AutomationService automationService, DraftEditorService draftEditorServiceInstance, DocumentModel[] docArray );

}
