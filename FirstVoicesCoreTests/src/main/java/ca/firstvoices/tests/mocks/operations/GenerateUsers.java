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

@Operation(id = GenerateUsers.ID, category = Constants.GROUP_NAME, label =
    "Generate Mock Users", description = "Operation to generate users given "
    + "1 mock data test dialect. If left empty, will generate users for all dialects in test. ")
public class GenerateUsers {

  public static final String ID = Constants.GROUP_NAME + "." + "GenerateUsers";

  @Context
  protected CoreSession session;

  @Context
  protected UserManager userManager;

  @Param(name = "dialectName",
      description = "Optional name of the dialect to add users to", required = false)
  protected String dialectName = null;

  MockUserService generateDialectUsersService = Framework
      .getService(MockUserService.class);

  @OperationMethod
  public void run() {
    if (dialectName == null) {
      // Generate users for all dialects in test
      //Check for /FV/Workspaces/Data/Test/Test and /FV/Workspaces/Data/Test directories
      PathRef a = new PathRef("/FV/Workspaces/Data/Test/Test");
      PathRef b = new PathRef("/FV/Workspaces/Data/Test");

      if (session.exists(a) || session.exists(b)) {
        generateDialectUsersService.generateUsersForDialects(session, userManager);
      } else {
        throw new IllegalArgumentException("/FV/Workspaces/Data/Test/Test/ must exist");
      }
    } else {
      //if name exists, call generate users for dialect
      //else throw exception
      PathRef path = new PathRef("/FV/Workspaces/Data/Test/Test/" + dialectName);

      if (session.exists(path)) {
        generateDialectUsersService.generateUsersForDialect(session, userManager, path);
      } else {
        throw new IllegalArgumentException("Dialect must exist in /FV/Workspaces/Data/Test/Test/");
      }
    }
  }
}
