package ca.firstvoices.lists.operations;

import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_DIALECT;

import ca.firstvoices.lists.Constants;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.impl.blob.StringBlob;

@Operation(id = TestList.ID, category = Constants.GROUP_NAME,
    label = Constants.CONFUSABLES_STATUS_ACTION_ID,
    description = "Operation to show the status of confusables on a dialect")
public class TestList {

  public static final String ID = Constants.CONFUSABLES_STATUS_ACTION_ID;

  @OperationMethod
  public Blob run(DocumentModel dialect) throws OperationException {

    if (dialect == null || !dialect.getType().equals(FV_DIALECT)) {
      throw new OperationException("Document type must be FVDialect");
    }

    JSONObject json = new JSONObject();
    return new StringBlob(json.toString(), "application/json");
  }
}
