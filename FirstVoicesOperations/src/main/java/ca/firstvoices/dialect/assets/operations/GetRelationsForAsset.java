package ca.firstvoices.dialect.assets.operations;

import static ca.firstvoices.schemas.DialectTypesConstants.FV_WORD;

import ca.firstvoices.dialect.assets.services.RelationsService;
import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
@Operation(id = GetRelationsForAsset.ID, category = Constants.CAT_DOCUMENT, label =
    "GetRelationsForAsset", description =
    "Given a document, returns a list documents that refer to that document in the "
        + "'fv:related_assets' field. If the given document is a proxy, this endpoint will return"
        + " proxied documents")
public class GetRelationsForAsset {

  @Context
  protected OperationContext ctx;

  public static final String ID = "Document.GetRelationsForAsset";

  @Param(name = "type", values = {FV_WORD}, required = false)
  protected String type;

  @OperationMethod
  public DocumentModelList run(DocumentModel doc) {
    RelationsService relationsService = Framework.getService(RelationsService.class);
    CoreSession session = ctx.getCoreSession();
    if (StringUtils.isEmpty(type)) {
      return relationsService.getRelations(session, doc);
    }
    return relationsService.getRelations(session, doc, type);
  }

}
