package ca.firstvoices.tests.mocks.operations;

import ca.firstvoices.tests.mocks.Constants;
import ca.firstvoices.tests.mocks.services.MockUserService;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;

@Operation(id = RemoveUsersForDialect.ID, category = Constants.GROUP_NAME, label =
    "Remove Users for Dialect", description = "Operation to remove users given "
    + "1 mock data test dialect")
public class RemoveUsersForDialect {

  public static final String ID = Constants.GROUP_NAME + "." + "RemoveUsersForDialect";

  @Context
  protected CoreSession session;

  @Context
  protected UserManager userManager;

  @Param(name = "dialectName",
      description = "Name of the dialect to remove users from")
  protected String dialectName = "";

  MockUserService generateDialectUsersService = Framework
      .getService(MockUserService.class);

  @OperationMethod
  public void run() {
    generateDialectUsersService.removeUsersForDialect(session, userManager, dialectName);
  }
}
