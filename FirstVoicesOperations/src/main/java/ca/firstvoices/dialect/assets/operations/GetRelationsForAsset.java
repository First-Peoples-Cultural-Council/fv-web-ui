package ca.firstvoices.dialect.assets.operations;

import ca.firstvoices.dialect.assets.services.RelationsService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
@Operation(id = GetRelationsForAsset.ID, category = Constants.CAT_DOCUMENT, label =
    "GetRelationsForAsset",
    description = "Given a document, returns a list documents that refer to that document in the"
        + " 'fv:related_assets' field")
public class GetRelationsForAsset {

  @Context
  protected OperationContext ctx;

  public static final String ID = "Document.GetRelationsForAsset";


  @OperationMethod
  public DocumentModelList run(DocumentModel doc) {
    RelationsService relationsService = Framework.getService(RelationsService.class);
    CoreSession session = ctx.getCoreSession();
    return relationsService.getRelations(session, doc);
  }

}
