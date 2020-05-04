package ca.firstvoices.operations;

import ca.firstvoices.services.AddConfusablesService;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.runtime.api.Framework;

@Operation(id = AddConfusablesOperation.ID, category = Constants.CAT_DOCUMENT, label = "FVAddConfusables",
    description = "This operation is used to queue a worker, which calls the confusable service, which adds "
        + "confusable characters to the input archive. It will query the archive for the characters column in "
        + "the confusable_characters vocabulary and add the confusables to that character if it is found. "
        + "Requires an archive as an input document.")
public class AddConfusablesOperation extends AbstractFirstVoicesDataOperation {

  public static final String ID = "Document.AddConfusables";
  protected AddConfusablesService service = Framework.getService(AddConfusablesService.class);
  protected AutomationService automation = Framework.getService(AutomationService.class);

  @Context
  protected OperationContext ctx;

  @OperationMethod
  public void run(DocumentModel dialect) {

    CoreSession session = ctx.getCoreSession();

    if (dialect.getType().equals("FVDialect")) {
      DocumentModel alphabet = getAlphabet(session, dialect);
      alphabet.setPropertyValue("fv-alphabet:update_confusables_required", true);
      session.saveDocument(alphabet);
    } else {
      throw new NuxeoException("Document type must be FVDialect");
    }
  }
}
