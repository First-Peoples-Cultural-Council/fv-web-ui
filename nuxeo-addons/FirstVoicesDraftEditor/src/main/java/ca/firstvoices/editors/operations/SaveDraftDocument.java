package ca.firstvoices.editors.operations;

import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.api.Framework;

import ca.firstvoices.editors.services.DraftEditorService;
import ca.firstvoices.editors.utils.EditingUtils;

import java.util.HashMap;
import java.util.Map;

@Operation(id=SaveDraftDocument.ID, category= Constants.CAT_DOCUMENT, label="Save Draft Document", description="Save edited draft document. INPUT is a draft document. RETURN is a draft document. Unlocks the live document associated with the draft.")
public class SaveDraftDocument {

    public static final String ID = "Document.SaveDraftDocument";

    protected DraftEditorService service = Framework.getService(DraftEditorService.class);
    protected AutomationService automation = Framework.getService(AutomationService.class);

    @Context
    protected CoreSession session;

    @Context
    protected OperationContext ctx;

    @OperationMethod
    public DocumentModel run(DocumentModel input) {

        if( EditingUtils.canBeEdited( input) ) {

            service.saveEditedDraftDocument( input ); // TODO should have boolean to know if this is succesful

            try {
                Map<String, Object> parameters = new HashMap<String, Object>();

                parameters.put("message", "Draft document saved." );

                automation.run(ctx, "WebUI.AddInfoMessage", parameters);
            } catch (OperationException e) {
                e.printStackTrace();
            }
       }

        return input;
    }
}
