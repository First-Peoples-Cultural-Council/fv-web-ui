package ca.firstvoices.tests.mocks.operations;

import ca.firstvoices.tests.mocks.Constants;
import ca.firstvoices.tests.mocks.services.MockUserService;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;

@Operation(id = GenerateUsersForDialects.ID, category = Constants.GROUP_NAME, label =
    "Generate Users for Dialects", description = "Operation to generate users for all dialects in "
    + "the Test/Test mock data directory")
public class GenerateUsersForDialects {

  public static final String ID = Constants.GROUP_NAME + "." + "GenerateUsersForDialects";

  @Context
  protected CoreSession session;

  @Context
  protected UserManager userManager;

  MockUserService generateDialectUsersService = Framework
      .getService(MockUserService.class);

  @OperationMethod
  public void run() {
    //Check for /FV/Workspaces/Data/Test/Test and /FV/Workspaces/Data/Test directories
    PathRef a = new PathRef("/FV/Workspaces/Data/Test/Test");
    PathRef b = new PathRef("/FV/Workspaces/Data/Test");

    if (session.exists(a) || session.exists(b)) {
      generateDialectUsersService.generateUsersForDialects(session, userManager);
    } else {
      throw new IllegalArgumentException("/FV/Workspaces/Data/Test/Test/ must exist");
    }
  }
}
