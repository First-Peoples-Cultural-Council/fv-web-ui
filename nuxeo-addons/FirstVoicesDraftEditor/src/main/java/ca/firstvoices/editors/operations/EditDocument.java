package ca.firstvoices.editors.operations;


import ca.firstvoices.editors.utils.EditingUtils;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.Lock;
import org.nuxeo.runtime.api.Framework;

import ca.firstvoices.editors.services.DraftEditorService;


import java.util.HashMap;
import java.util.Map;

@Operation(id=EditDocument.ID, category= Constants.CAT_DOCUMENT, label="Edit FV Document", description="Edit a document from a dialect tree. INPUT is a live document. RETURN is a draft document.")
public class EditDocument {
    public static final String ID = "Document.EditDocument";

    protected DraftEditorService service = Framework.getService(DraftEditorService.class);

    protected AutomationService automation = Framework.getService(AutomationService.class);

    @Context
    protected CoreSession session;

    @Context
    protected OperationContext ctx;

    @OperationMethod
    public DocumentModel run(DocumentModel input) {
        DocumentModel draftDocument = null;
        Map<String, Object> parameters = new HashMap<String, Object>();

        if( EditingUtils.canBeEdited( input)  ) { // service.canEditDraftDocument( input)
            String state = input.getCurrentLifeCycleState();

            // If document is published we need to create a draft document
            // on which all editing will be done
            // if document is Enabled or New we will do edits on LIVE document
            // it is also possible document changed lifecycle state between
            // edit sessions. In that case we need to check if there is a draft
            // document and take appropriate acctions in EditDocumentDraft (FirstVoicesDraftEditor).
            //
            if( !"Deleted".equals(state) ) {
                // NOTE: if input is not Published editDraftForDocument will return input document
                draftDocument = service.editDraftForDocument(input);

                parameters.put("message", "Editing document.");
        }
            else {
                parameters.put("message", "ERROR: Attempting to edit deleted document.");
            }
        }
        else {
            if( input.isLocked() ) {
                Lock lockInfo = input.getLockInfo();
                parameters.put("message", "Document is locked (edited.) ");
                parameters.put("locked by: ", lockInfo.getOwner());
                parameters.put("locked on: ", lockInfo.getCreated().getTime().toString());
            }
            else {
                parameters.put("message", "ERROR: When attempting to edit document.");
            }
        }

        try {
            automation.run(ctx, "WebUI.AddInfoMessage", parameters);
        } catch (OperationException e) {
            e.printStackTrace();
        }

        return draftDocument;
    }
}
