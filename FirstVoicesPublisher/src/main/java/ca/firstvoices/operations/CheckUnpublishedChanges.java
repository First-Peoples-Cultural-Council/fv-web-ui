package ca.firstvoices.operations;

import ca.firstvoices.services.UnpublishedChangesService;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.api.Framework;

/**
 *
 */
@Operation(id=CheckUnpublishedChanges.ID, category= Constants.CAT_DOCUMENT, label="FVCheckUnpublishedChanges",
        description="This operation is used to check if a document has unpublished changes. " +
                "It returns true if unpublished changes exist and false otherwise.")
public class CheckUnpublishedChanges {

    CoreSession session;

    public static final String ID = "Document.CheckUnpublishedChanges";

    protected UnpublishedChangesService service = Framework.getService(UnpublishedChangesService.class);

    @OperationMethod
    public boolean run(DocumentModel input) {
        session = input.getCoreSession();

        // Call the checkUnpublishedChanges service which returns true if a document has unpublished changes and false otherwise.
        return service.checkUnpublishedChanges(session, input);
    }
}
