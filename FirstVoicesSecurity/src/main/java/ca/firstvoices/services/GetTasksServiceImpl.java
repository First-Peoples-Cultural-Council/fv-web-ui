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
  public DocumentModelList getTasksForUser(CoreSession session, NuxeoPrincipal principal) {
    List<String> userGroups = principal.getGroups();
    if (userGroups != null && !userGroups.isEmpty()) {
      StringBuilder query = new StringBuilder(
          "SELECT * FROM TaskDoc WHERE ecm:currentLifeCycleState = 'opened' AND "
              + "nt:actors IN (");
      for (int i = 0; i < userGroups.size(); i++) {
        String group = userGroups.get(i);
        if (i != 0) {
          query.append(",");
        }
        query.append("'group:").append(group).append("', ");
        query.append("'").append(group).append("'");
      }
      query.append(")");
      return session.query(query.toString());
    } else {
      return null;
    }
  }
}
