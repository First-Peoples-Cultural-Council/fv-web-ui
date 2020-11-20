package ca.firstvoices.tests.mocks.operations;

import ca.firstvoices.tests.mocks.Constants;
import ca.firstvoices.tests.mocks.services.MockDialectService;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.runtime.api.Framework;

@Operation(id = RemoveDialects.ID, category = Constants.GROUP_NAME, label =
    "Remove Dialects", description = "Operation to remove dialects")
public class RemoveDialects {

  public static final String ID = Constants.GROUP_NAME + "." + "RemoveDialects";

  @Context
  protected CoreSession session;

  MockDialectService generateDialectService = Framework
      .getService(MockDialectService.class);

  @OperationMethod
  public void run() {
    //Remove /FV/Workspaces/Data/Test/Test and /FV/Workspaces/Data/Test directories
    PathRef a = new PathRef("/FV/Workspaces/Data/Test/Test");
    PathRef b = new PathRef("/FV/Workspaces/Data/Test");

    if (session.exists(a) || session.exists(b)) {
      generateDialectService.removeMockDialects(session);
    } else {
      throw new IllegalArgumentException("/FV/Workspaces/Data/Test/Test/ must exist");
    }

  }
}
