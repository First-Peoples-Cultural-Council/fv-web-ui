package ca.firstvoices.services;

import java.util.List;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.util.PageProviderHelper;
import org.nuxeo.ecm.automation.jaxrs.io.documents.PaginableDocumentModelListImpl;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.platform.query.api.PageProviderDefinition;
import org.nuxeo.ecm.platform.query.nxql.CoreQueryDocumentPageProvider;

/**
 * @author david
 */
public class GetTasksServiceImpl implements GetTasksService {

  @Override
  public DocumentModelList getTasksForUser(CoreSession session, NuxeoPrincipal principal,
      Integer currentPageIndex, Integer pageSize, List<String> sortBy, List<String> sortOrder)
      throws OperationException {
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

      PageProviderDefinition def = PageProviderHelper
          .getQueryPageProviderDefinition(String.valueOf(query));

      Long targetPage = currentPageIndex != null ? currentPageIndex.longValue() : null;
      Long targetPageSize = pageSize != null ? pageSize.longValue() : null;

      CoreQueryDocumentPageProvider pp = (CoreQueryDocumentPageProvider) PageProviderHelper
          .getPageProvider(session, def, null, sortBy, sortOrder, targetPageSize, targetPage);

      PaginableDocumentModelListImpl res = new PaginableDocumentModelListImpl(pp);
      if (res.hasError()) {
        throw new OperationException(res.getErrorMessage());
      }
      return res;
    } else {
      return null;
    }
  }
}
