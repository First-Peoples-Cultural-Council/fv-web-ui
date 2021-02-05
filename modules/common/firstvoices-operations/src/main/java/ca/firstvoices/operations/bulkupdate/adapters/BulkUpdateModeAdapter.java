package ca.firstvoices.operations.bulkupdate.adapters;

import ca.firstvoices.operations.bulkupdate.BulkUpdateMode;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.TypeAdaptException;
import org.nuxeo.ecm.automation.TypeAdapter;

public class BulkUpdateModeAdapter implements TypeAdapter {

  @Override
  public Object getAdaptedValue(
      final OperationContext ctx, final Object objectToAdapt) throws TypeAdaptException {
    return BulkUpdateMode.valueOf((String) objectToAdapt);
  }
}
