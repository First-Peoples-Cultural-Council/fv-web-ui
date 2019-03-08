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
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.api.Framework;

import ca.firstvoices.nativeorder.services.NativeOrderComputeService;

/*
 *
 */
@Operation(id=ComputeNativeOrderForDialect.ID, category=Constants.CAT_DOCUMENT, label="Compute Native Order for Dialect", description="Computes the native sort order for all words/phrases within a dialect.")
public class ComputeNativeOrderForDialect {

    public static final String ID = "Document.ComputeNativeOrderForDialect";

    protected NativeOrderComputeService service = Framework.getService(NativeOrderComputeService.class);

    protected AutomationService automation = Framework.getService(AutomationService.class);

    @Context
    protected CoreSession session;

    @Context
    protected OperationContext ctx;

    @Param(name = "path", required = false)
    protected String path;

    @OperationMethod
    public DocumentModel run(DocumentModel input) {

        // Check if dialect
        if (input.getType().equals("FVDialect")) {
            service.computeDialectNativeOrderTranslation(input);

            Map<String, Object> parameters = new HashMap<String, Object>();
            parameters.put("message", "Dialect sort order updated. Republish if needed.");

            try {
                automation.run(ctx, "WebUI.AddInfoMessage", parameters);
            } catch (OperationException e) {
                e.printStackTrace();
            }
        }

        return input;
    }
}
