package ca.firstvoices.operations;

import ca.firstvoices.services.AddConfusablesService;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.runtime.api.Framework;

@Operation(id=AddConfusablesEndpoint.ID, category= Constants.CAT_DOCUMENT, label="FVAddConfusables",
    description="This operation is used to setup the initial FirstVoices backend for development.  " +
        "It can be run multiple times without issues. Please ensure you have your environment " +
        "variables set for CYPRESS_FV_USERNAME and CYPRESS_FV_PASSWORD as these will create an admin " +
        "account for you.")
public class AddConfusablesEndpoint {

  public static final String ID = "Document.AddConfusables";

  @Context
  protected CoreSession session;

  protected AddConfusablesService service = Framework.getService(AddConfusablesService.class);

  @OperationMethod
  public void run() {

    // Call the addConfusables service.
    service.addConfusables(session);
  }

}
