package ca.firstvoices.tests.mocks.operations;

import ca.firstvoices.tests.mocks.Constants;
import ca.firstvoices.tests.mocks.services.MockDialectService;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.runtime.api.Framework;

@Operation(id = GenerateDialects.ID, category = Constants.GROUP_NAME, label =
    "Generate Dialects", description = "Operation to create multiple test dialects. "
    + "maxEntries sets the number of words/phrases, split 50/50.")
public class GenerateDialects {

  public static final String ID = Constants.GROUP_NAME + "." + "GenerateDialects";

  @Context
  protected CoreSession session;

  @Param(name = "randomize", values = {"true", "false"},
      description = "`true` to create random data; `false` to create real demo data")
  protected String randomize = "true";

  @Param(name = "maxDialects", required = false, description = "how many dialects to generate")
  protected int maxDialects = 10;

  @Param(name = "maxEntries", required = false, description = "sets the number of words/phrases, "
      + "split 50/50.")
  protected int maxEntries = 60;

  MockDialectService generateDialectService = Framework
      .getService(MockDialectService.class);

  @OperationMethod
  public DocumentModelList run() {
    DocumentModelList createdDialects = new DocumentModelListImpl(maxDialects);

    for (int i = 0; i < maxDialects; ++i) {

      String name = "TestDialect" + i;

      if (randomize.equals("true")) {
        createdDialects
            .add(generateDialectService.generateMockRandomDialect(session, maxEntries));
      } else {
        createdDialects
            .add(generateDialectService.generateMockDemoDialect(session, maxEntries, name));
      }
    }

    return createdDialects;
  }
}
