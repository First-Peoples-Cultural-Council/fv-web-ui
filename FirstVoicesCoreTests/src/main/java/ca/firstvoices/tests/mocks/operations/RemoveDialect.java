package ca.firstvoices.tests.mocks.operations;


import ca.firstvoices.tests.mocks.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;

@Operation(id = RemoveDialect.ID, category = Constants.GROUP_NAME, label =
    "Remove Dialect", description = "Operation to remove a dialect")
public class RemoveDialect {

  public static final String ID = Constants.GROUP_NAME + "." + "RemoveDialect";
}
