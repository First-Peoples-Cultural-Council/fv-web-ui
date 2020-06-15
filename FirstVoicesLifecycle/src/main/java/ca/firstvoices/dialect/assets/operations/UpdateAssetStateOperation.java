package ca.firstvoices.dialect.assets.operations;

import static ca.firstvoices.Constants.DISABLED;
import static ca.firstvoices.Constants.ENABLED;
import static ca.firstvoices.Constants.PUBLISHED;
import static ca.firstvoices.Constants.UNPUBLISHED;

import ca.firstvoices.dialect.assets.services.UpdateAssetStateService;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
@Operation(id = UpdateAssetStateOperation.ID, category = Constants.CAT_DOCUMENT, label =
    "UpdateAssetStateOperation", description =
    "Given a document and a parameter, update the state of the asset to one of: Published, "
        + "Unpublished, Enabled, or Disabled")
public class UpdateAssetStateOperation {

  public static final String ID = "Document.UpdateAssetStateOperation";

  @Param(name = "state", values = {"Published", "Unpublished", "Enabled", "Disabled"})
  private String state;

  @Context
  private OperationContext ctx;

  private CoreSession session;

  private UpdateAssetStateService service = Framework.getService(UpdateAssetStateService.class);
  private FirstVoicesPublisherService publisherService = Framework
      .getService(FirstVoicesPublisherService.class);


  @OperationMethod
  public void run(DocumentModel doc) {
    session = ctx.getCoreSession();

    switch (state.toUpperCase()) {
      case PUBLISHED:
        publisherService.publish(doc);
        break;
      case UNPUBLISHED:
        publisherService.unpublish(doc);
        break;
      case ENABLED:
        service.enableAsset(session, doc);
        break;
      case DISABLED:
        service.disableAsset(session, doc);
        break;
      default:
        break;
    }
  }

}
