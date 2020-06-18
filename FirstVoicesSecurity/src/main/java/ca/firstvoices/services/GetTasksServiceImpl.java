package ca.firstvoices.services;

import java.util.List;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;

/**
 * @author david
 */
public class GetTasksServiceImpl implements GetTasksService {

  @Override
  public DocumentModelList getTasksForUser(CoreSession session) {
    NuxeoPrincipal currentUser = session.getPrincipal();
    List<String> userGroups = currentUser.getGroups();
    if (userGroups != null && userGroups.size() > 0) {
      String query = "SELECT * FROM TaskDoc WHERE ecm:currentLifeCycleState = 'opened' AND "
          + "nt:actors IN (";
      for (int i = 0; i < userGroups.size(); i++) {
        String group = userGroups.get(i);
        if (i != 0) {
          query += ",";
        }
        query += "'group:" + group + "'";
      }
      query += ")";
      DocumentModelList documentModels = session.query(query);
      return documentModels;
    } else {
      return null;
    }
  }
}
