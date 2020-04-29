package ca.firstvoices.operations;

import java.util.HashMap;
import java.util.Map;
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

@Operation(id = CleanConfusablesOperation.ID, category = Constants.CAT_DOCUMENT, label = "FVCleanConfusables",
    description = "This operation is used to clean all confusable characters across the archive. It will query the archive for all FVWords and FVPhrases, and queue them to be cleaned by a worker.")
public class CleanConfusablesOperation extends AbstractFirstVoicesDataOperation {

  public static final String ID = "Document.CleanConfusables";
  protected AutomationService automation = Framework.getService(AutomationService.class);

  @Context
  protected OperationContext ctx;

  @OperationMethod
  public void run(DocumentModel dialect) {

    CoreSession session = ctx.getCoreSession();

    if (dialect.getType().equals("FVDialect")) {
      String wordQuery = "SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId()
          + "' AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";
      String phraseQuery = "SELECT * FROM FVPhrase WHERE ecm:ancestorId='" + dialect.getId()
          + "' AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";

      session.query(wordQuery).forEach(word -> {
        word.setPropertyValue("fv-word:update_confusables_required", true);
        session.saveDocument(word);
      });

      session.query(phraseQuery).forEach(word -> {
        word.setPropertyValue("fv-phrase:update_confusables_required", true);
        session.saveDocument(word);
      });

      Map<String, Object> parameters = new HashMap<>();
      parameters.put("message",
          "Words And Phrases will be updated shortly with confusable characters. Republish if needed when complete.");
    } else {
      throw new NuxeoException("Document type must be FVDialect");
    }
  }
}
