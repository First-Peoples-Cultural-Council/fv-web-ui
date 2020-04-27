package ca.firstvoices.operations;

import ca.firstvoices.services.AddConfusablesService;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.runtime.api.Framework;

@Operation(id = AddConfusablesOperation.ID, category = Constants.CAT_DOCUMENT, label = "FVAddConfusables",
    description = "This operation is used to add confusable call the service which adds confusable "
        + "characters to the input archive. It will query the archive for the characters column in "
        + "the confusable_characters vocabulary and add the confusables to that character if it is found.")
public class AddConfusablesOperation extends AbstractFirstVoicesDataOperation {

  public static final String ID = "Document.AddConfusables";
  private static final Log log = LogFactory.getLog(AddConfusablesOperation.class);
  protected AddConfusablesService service = Framework.getService(AddConfusablesService.class);
  protected AutomationService automation = Framework.getService(AutomationService.class);

  @Context
  protected OperationContext ctx;

  @OperationMethod
  public void run(DocumentModel dialect) {

    CoreSession session = ctx.getCoreSession();

    // Call the addConfusables service.
    if (dialect.getType().equals("FVDialect")) {
      DocumentModel alphabet = getAlphabet(session, dialect);
      alphabet.setPropertyValue("fv-alphabet:update_confusables_required", true);
      session.saveDocument(alphabet);

      Map<String, Object> parameters = new HashMap<>();
      parameters.put("message",
          "Dialect alphabet will be updated shortly with confusable characters. Republish if needed when complete.");
      try {
        automation.run(ctx, "WebUI.AddInfoMessage", parameters);
      } catch (OperationException e) {
        log.error(e);
      }
    } else {
      throw new NuxeoException("Document type must be FVDialect");
    }
  }
}
