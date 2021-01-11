package ca.firstvoices.operations.bulkupdate.services;

import ca.firstvoices.operations.bulkupdate.BulkUpdateMode;
import java.io.Serializable;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentRefList;

public interface BulkUpdateService {

  void bulkUpdate(
      CoreSession session, DocumentRefList refs, BulkUpdateMode mode, String field,
      Serializable value);
}
