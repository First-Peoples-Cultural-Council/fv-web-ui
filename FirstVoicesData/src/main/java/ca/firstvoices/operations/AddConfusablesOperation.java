package ca.firstvoices.operations;

import ca.firstvoices.services.AddConfusablesService;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.runtime.api.Framework;

@Operation(id= AddConfusablesOperation.ID, category= Constants.CAT_DOCUMENT, label="FVAddConfusables",
    description="This operation is used to add confusable call the service which adds confusable "
        + "characters to the input archive. It will query the archive for the characters column in "
        + "the confusable_characters vocabulary and add the confusables to that character if it is found.")
public class AddConfusablesOperation {

  public static final String ID = "Document.AddConfusables";

  @Context
  protected CoreSession session;

  protected AddConfusablesService service = Framework.getService(AddConfusablesService.class);

  @OperationMethod
  public void run(DocumentModel dialect) {

    // Call the addConfusables service.
    if(dialect.getType().equals("FVDialect")) {
      service.addConfusables(session, dialect);
    } else {
      throw new NuxeoException("Document type must be FVDialect");
    }

  }

}
