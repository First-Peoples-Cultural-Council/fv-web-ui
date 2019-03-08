package ca.firstvoices.editors.operations;

import ca.firstvoices.editors.services.DraftEditorService;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.*;
import org.nuxeo.runtime.api.Framework;

import java.util.HashMap;
import java.util.Map;

import static ca.firstvoices.editors.configuration.FVLocalConf.*;

@Operation(id=ReleaseDraftEditLock.ID, category= Constants.CAT_DOCUMENT, label="Release Draft-Edit Lock", description="Release a draft edit lock set during draft edit. INPUT is a live or a draft document. Does not cancel draft process or remove the relationship between a live and a draft documents. RETURN a live unlocked document.")
public class ReleaseDraftEditLock {

    public static final String ID = "Document.ReleaseDraftEditLock";
    protected DraftEditorService service = Framework.getService(DraftEditorService.class);

    protected AutomationService automation = Framework.getService(AutomationService.class);

    @Context
    protected CoreSession session;

    @Context
    protected OperationContext ctx;

    // TODO try to refactor and move some of the work into DraftEditorService

    @OperationMethod
    public DocumentModel run(DocumentModel input) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        String state = input.getCurrentLifeCycleState();
        boolean canReleaseDraftEditLock = false;

        if( !"Deleted".equals(state) ) {

            if( !input.isLocked() ) {
                // first check if this is unlocked live doc - we do not have to do anything
                if( service.getUUID( input, DRAFT_UUID_REF ) != null ) {
                    parameters.put("message", "Document was not locked.");
                }
                else  {
                    // is it a draft document?
                    // check if we have uuid for live dock
                    String liveUuid = service.getUUID(input, LIVE_UUID_REF);

                    if( liveUuid != null ) {
                        DocumentRef liveRef = new IdRef( liveUuid );
                        DocumentModel liveDoc = session.getDocument( liveRef );

                        if( liveDoc != null && liveDoc.isLocked() ) {
                            // we were given a draft document as a reference
                            // but need to return a live document
                            input = liveDoc;
                            canReleaseDraftEditLock = true;
                        }
                        else {
                            parameters.put("message", "Live document is not locked.");
                        }
                    }
                    else {
                        parameters.put("message", "Error: Invalid live document uuid.");
                    }
                }
            }
            else {
                // we are dealing with locked live document
                // this is the scenario we expect
                canReleaseDraftEditLock = true;
            }

            if( canReleaseDraftEditLock ) {
                Lock lockInfo = input.getLockInfo();

                String lockOwner = lockInfo.getOwner();
                String lockCreated = lockInfo.getCreated().getTime().toString();

                parameters.put("lock owner ",lockOwner );
                parameters.put("lock set at", lockCreated );

                if( service.releaseTimedOutLock( input ) ) {
                    parameters.put("message", "Draft edit session was terminated.");
                    parameters.put("lock", "Live document lock was released.");
                }
                else {
                    parameters.put("message", "ERROR: Draft edit session was NOT terminated.");

                    if (input.isLocked()) {
                        parameters.put("lock", "Lock is still set.");
                    } else {
                        parameters.put("lock", "Lock is NOT set.");
                    }
                }
            }
        }
        else {
            parameters.put("message", "ERROR: Document is deleted.");
        }

        try {
            automation.run(ctx, "WebUI.AddInfoMessage", parameters);
        } catch (OperationException e) {
            e.printStackTrace();
        }

        // return should always pass back a live document even if draft was passed in
        return input;
    }
}