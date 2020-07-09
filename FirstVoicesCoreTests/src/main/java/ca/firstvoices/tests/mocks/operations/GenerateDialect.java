package ca.firstvoices.tests.mocks.operations;

import ca.firstvoices.tests.mocks.Constants;
import ca.firstvoices.tests.mocks.services.MockDialectService;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.api.Framework;

@Operation(id = GenerateDialect.ID, category = Constants.GROUP_NAME, label =
    "Generate Dialect", description = "Operation to create 1 test dialect.")
public class GenerateDialect {

  public static final String ID = Constants.GROUP_NAME + "." + "GenerateDialect";

  @Context
  protected CoreSession session;

  @Param(name = "randomize", values = {"true", "false"},
      description = "`true` to create random data; `false` to create real demo data")
  protected String randomize = "true";

  @Param(name = "maxEntries", required = false, description = "how many entries to generate"
      + " for words, phrases, etc.")
  protected int maxEntries = 100;

  @Param(name = "dialectName", required = false)
  protected String dialectName = "TestDialect1";

  MockDialectService generateDialectService = Framework
      .getService(MockDialectService.class);

  @OperationMethod
  public DocumentModel run() {

    if (randomize.equals("true")) {
      return generateDialectService
          .generateMockRandomDialect(session, maxEntries);
    } else {
      return generateDialectService
          .generateMockDemoDialect(session, maxEntries, dialectName);
    }

  }
}
