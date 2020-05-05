package ca.firstvoices.operations;

import ca.firstvoices.services.UnpublishedChangesService;
import org.javers.core.JaversBuilder;
import org.javers.core.diff.Diff;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;
import org.nuxeo.ecm.core.api.impl.blob.StringBlob;
import org.nuxeo.runtime.api.Framework;

/**
 *
 */
@Operation(id= GetUnpublishedChanges.ID, category= Constants.CAT_DOCUMENT, label="FVGetUnpublishedChanges",
        description="This operation is used to get the unpublished changes for the document. " +
                "It returns a list of changes if unpublished changes exist.")
public class GetUnpublishedChanges {

    CoreSession session;

    public static final String ID = "Document.GetUnpublishedChanges";

    protected UnpublishedChangesService service = Framework.getService(UnpublishedChangesService.class);

    @OperationMethod
    public Blob run(DocumentModel input) {

        JSONObject response = new JSONObject();

        session = input.getCoreSession();
        Diff diff = service.getUnpublishedChanges(session, input);

        if (diff == null || !diff.hasChanges()) {
            return new StringBlob("", "application/json");
        }

        Object jsonDiff = JaversBuilder.javers().build().getJsonConverter().toJson(diff);
        return new JSONBlob(jsonDiff.toString());
    }

//    // Untested: Potentially a method for comparing two arbitrary documents (probably better to get these two docs as two doc id parameters)
//    @OperationMethod
//    public String run(DocumentModelList docs) throws IOException {
//
//        if (docs.size() > 2) {
//            throw new IOException("Only 2 docs for comparison are allowed");
//        }
//
//        session = docs.get(0).getCoreSession();
//        Diff diff = service.getChanges(session, docs.get(0), docs.get(1));
//
//        return diff.prettyPrint();
//    }
}
