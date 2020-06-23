package ca.firstvoices.tests.mocks.operations;

import ca.firstvoices.tests.mocks.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;

@Operation(id = RemoveDialects.ID, category = Constants.GROUP_NAME, label =
    "Remove Dialects", description = "Operation to remove dialects")
public class RemoveDialects {

  public static final String ID = Constants.GROUP_NAME + "." + "RemoveDialects";

  private RemoveDialects() {
    throw new UnsupportedOperationException("Remove functions are not implemented yet.");
  }
}
