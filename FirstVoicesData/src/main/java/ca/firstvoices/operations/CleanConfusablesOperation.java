package ca.firstvoices.operations;

import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;
import org.nuxeo.ecm.core.bulk.BulkService;
import org.nuxeo.ecm.core.bulk.action.SetPropertiesAction;
import org.nuxeo.ecm.core.bulk.message.BulkCommand;
import org.nuxeo.runtime.api.Framework;

@Operation(id = CleanConfusablesOperation.ID, category = Constants.CAT_DOCUMENT, label = "FVCleanConfusables",
    description = "This operation is used to clean all confusable characters across the archive. It will query the archive for all FVWords and FVPhrases, and queue them to be cleaned by a worker.")
public class CleanConfusablesOperation extends AbstractFirstVoicesDataOperation {

  public static final String ID = "Document.CleanConfusables";
  protected AutomationService automation = Framework.getService(AutomationService.class);

  @Context
  protected CoreSession session;

  @OperationMethod
  public Blob run(DocumentModel dialect) {

    if (dialect.getType().equals("FVDialect")) {
      String wordPhraseQuery = "SELECT * FROM FVWord, FVPhrase WHERE ecm:ancestorId='" + dialect.getId()
          + "' AND ecm:isProxy = 0 AND ecm:isVersion = 0 AND ecm:isTrashed = 0";

      // bulk update word and phrases
      BulkCommand command = new BulkCommand.Builder(SetPropertiesAction.ACTION_NAME,
          wordPhraseQuery).repository(session.getRepositoryName())
          .param("fv:update_confusables_required", Boolean.TRUE)
          .build();

      BulkService bulkService = Framework.getService(BulkService.class);
      String commandId = bulkService.submit(command);

      return new JSONBlob(commandId);
    } else {
      throw new NuxeoException("Document type must be FVDialect");
    }
  }
}
