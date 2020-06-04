package ca.firstvoices.tests.mocks.operations;

import ca.firstvoices.tests.mocks.Constants;
import ca.firstvoices.tests.mocks.services.MockDialectService;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.runtime.api.Framework;

@Operation(id = GenerateDialect.ID, category = Constants.GROUP_NAME, label =
    "Generate Dialects", description = "Operation to create multiple test dialects.")
public class GenerateDialects {

  public static final String ID = Constants.GROUP_NAME + "." + "GenerateDialects";

  @Context
  protected CoreSession session;

  @Param(name = "randomize", required = true, description = "`true` to create random data;"
      + " `false` to create real demo data")
  protected boolean randomize = true;

  @Param(name = "maxEntries", required = false, description = "how many dialects to generate")
  protected int maxDialects = 10;

  @Param(name = "maxEntries", required = false, description = "how many entries to generate"
      + " for words, phrases, etc.")
  protected int maxEntries = 100;

  MockDialectService generateDialectService = Framework
      .getService(MockDialectService.class);

  @OperationMethod
  public DocumentModelList run() throws OperationException {
    DocumentModelList createdDialects = new DocumentModelListImpl(maxDialects);

    for (int i = 0; i < maxDialects; ++i) {

      String name = "TestDialect" + i;

      if (randomize) {
        createdDialects
            .add(generateDialectService.generateMockRandomDialect(session, maxEntries, name));
      } else {
        createdDialects.add(generateDialectService.generateMockDemoDialect(session, maxEntries, name));
      }
    }

    return createdDialects;
  }
}
