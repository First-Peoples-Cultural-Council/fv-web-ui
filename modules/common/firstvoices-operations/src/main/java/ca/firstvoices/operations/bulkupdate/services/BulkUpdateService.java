package ca.firstvoices.operations.bulkupdate.services;

import ca.firstvoices.operations.bulkupdate.BulkUpdateMode;
import java.io.Serializable;
import java.util.List;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentRef;

public interface BulkUpdateService {

  void bulkUpdate(
      CoreSession session, List<DocumentRef> refs, BulkUpdateMode mode, String field,
      Serializable value);
}
