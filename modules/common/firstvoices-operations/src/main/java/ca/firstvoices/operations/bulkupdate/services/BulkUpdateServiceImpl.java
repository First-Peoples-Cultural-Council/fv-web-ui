package ca.firstvoices.operations.bulkupdate.services;

import ca.firstvoices.operations.bulkupdate.BulkUpdateMode;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;

public class BulkUpdateServiceImpl implements BulkUpdateService {

  public void bulkUpdate(
      CoreSession session, List<DocumentRef> refs, BulkUpdateMode mode, String field,
      Serializable value) {

    for (DocumentRef ref : refs) {

      if (!session.exists(ref)) {
        // skip deleted/nonexistent documents
        continue;
      }

      DocumentModel doc = session.getDocument(ref);

      if (doc == null) {
        throw new IllegalArgumentException("Invalid document ref");
      }

      if (mode == BulkUpdateMode.UPDATE_PROPERTY) {
        doc.setPropertyValue(field, value);
        session.saveDocument(doc);
      } else if (mode == BulkUpdateMode.ADD_TO_ARRAY_PROPERTY) {
        Serializable[] currentValue = (Serializable[]) doc.getProperty(field).getValue();
        if (currentValue == null) {
          doc.setPropertyValue(field, (Serializable) Collections.singletonList(value));
        } else {
          ArrayList<Serializable> asList = new ArrayList<>(Arrays.asList(currentValue));
          asList.add(value);
          doc.setPropertyValue(field, asList);
        }
      }
    }
  }
}

