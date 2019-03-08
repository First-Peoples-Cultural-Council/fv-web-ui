package ca.firstvoices.nativeorder.operations;

import java.util.HashMap;
import java.util.Map;

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

import ca.firstvoices.nativeorder.services.NativeOrderComputeService;

/**
 *
 */
@Operation(id=ComputeNativeOrderForAsset.ID, category=Constants.CAT_DOCUMENT, label="Compute Native Order for a Word/Phrase", description="Computes the native sort order for a sepcific word/phrase within a dialect.")
public class ComputeNativeOrderForAsset {

    public static final String ID = "Document.ComputeNativeOrderForAsset";

    protected NativeOrderComputeService service = Framework.getService(NativeOrderComputeService.class);

    protected AutomationService automation = Framework.getService(AutomationService.class);

    @Context
    protected CoreSession session;

    @Context
    protected OperationContext ctx;

    @OperationMethod
    public DocumentModel run(DocumentModel input) {

        // Check if word or phrase
        if (input.getType().equals("FVWord") || input.getType().equals("FVPhrase")) {
            service.computeAssetNativeOrderTranslation(input);

            Map<String, Object> parameters = new HashMap<String, Object>();
            parameters.put("message", "Word/Phrase sort order updated. Republish if needed.");

            try {
                automation.run(ctx, "WebUI.AddInfoMessage", parameters);
            } catch (OperationException e) {
                e.printStackTrace();
            }
        }

        return input;
    }
}
