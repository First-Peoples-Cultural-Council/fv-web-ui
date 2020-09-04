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

@Operation(id = GenerateUsersForDialect.ID, category = Constants.GROUP_NAME, label =
    "Generate Users for Dialect", description = "Operation to generate users given "
    + "1 mock data test dialect ")
public class GenerateUsersForDialect {

  public static final String ID = Constants.GROUP_NAME + "." + "GenerateUsersForDialect";

  @Context
  protected CoreSession session;

  @Context
  protected UserManager userManager;

  @Param(name = "dialectName",
      description = "Name of the dialect to add users to")
  protected String dialectName = "";

  MockUserService generateDialectUsersService = Framework
      .getService(MockUserService.class);

  @OperationMethod
  public void run() {
    //if name exists, call generate users
    //else throw exception

    PathRef path = new PathRef("/FV/Workspaces/Data/Test/Test/" + dialectName);

    if (session.exists(path)) {
      generateDialectUsersService.generateUsersForDialect(session, userManager, path);
    } else {
      throw new IllegalArgumentException("Dialect must exist in /FV/Workspaces/Data/Test/Test/");
    }

  }
}
