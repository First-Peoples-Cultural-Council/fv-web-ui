package ca.firstvoices.operations;

import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.DocumentModel;

@Operation(id= FVExportProgressGetter.ID, category= Constants.CAT_DOCUMENT, label="Get progress for operation", description="Returns a wrapper associated with the export.")
public class FVExportProgressGetter
{
    public static final String ID = "Document.GetExportProgress";

    @OperationMethod
    public DocumentModel run( DocumentModel input )
    {
        return input;
    }
}
