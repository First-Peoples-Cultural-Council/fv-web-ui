package ca.firstvoices.tests.mocks.operations;


import ca.firstvoices.tests.mocks.Constants;
import ca.firstvoices.tests.mocks.services.MockDialectService;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.runtime.api.Framework;

@Operation(id = RemoveDialect.ID, category = Constants.GROUP_NAME, label =
    "Remove Dialect", description = "Operation to remove a dialect")
public class RemoveDialect {

  public static final String ID = Constants.GROUP_NAME + "." + "RemoveDialect";

  @Context
  protected CoreSession session;

  @Param(name = "dialectName",
      description = "Name of the dialect to remove")
  protected String dialectName = "";


  MockDialectService generateDialectService = Framework
      .getService(MockDialectService.class);

  @OperationMethod
  public void run() {
    //if name exists, call remove
    //else throw exception

    PathRef path = new PathRef("/FV/Workspaces/Data/Test/Test/" + dialectName);

    if (session.exists(path)) {
      generateDialectService.removeMockDialect(session, path);
    } else {
      throw new IllegalArgumentException("Dialect must exist in /FV/Workspaces/Data/Test/Test/");
    }

  }

}
