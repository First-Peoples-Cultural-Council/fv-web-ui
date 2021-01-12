package ca.firstvoices.tests.mocks.operations;

import ca.firstvoices.tests.mocks.Constants;
import ca.firstvoices.tests.mocks.services.MockUserService;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;

@Operation(id = RemoveUsers.ID, category = Constants.GROUP_NAME, label =
    "Remove Users for Dialect or all dialects", description = "Operation to remove users given "
    + "1 mock data test dialect. If left empty, will generate users for all dialects in test.")
public class RemoveUsers {

  public static final String ID = Constants.GROUP_NAME + "." + "RemoveUsersForDialect";

  @Context
  protected CoreSession session;

  @Context
  protected UserManager userManager;

  @Param(name = "dialectName",
      description = "Optional name of the dialect to remove users from", required = false)
  protected String dialectName = null;

  MockUserService generateDialectUsersService = Framework
      .getService(MockUserService.class);

  @OperationMethod
  public void run() {
    if (dialectName == null) {
      //Check for /FV/Workspaces/Data/Test/Test and /FV/Workspaces/Data/Test directories
      PathRef a = new PathRef("/FV/Workspaces/Data/Test/Test");
      PathRef b = new PathRef("/FV/Workspaces/Data/Test");

      if (session.exists(a) || session.exists(b)) {
        generateDialectUsersService.removeUsersAndGroupsForDialects(session, userManager);
      } else {
        throw new IllegalArgumentException("/FV/Workspaces/Data/Test/Test/ must exist");
      }
    } else {
      generateDialectUsersService.removeUsersAndGroupsForDialect(session, userManager, dialectName);
    }
  }
}
