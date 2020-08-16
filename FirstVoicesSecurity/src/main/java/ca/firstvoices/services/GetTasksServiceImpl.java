package ca.firstvoices.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.util.PageProviderHelper;
import org.nuxeo.ecm.automation.jaxrs.io.documents.PaginableDocumentModelListImpl;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.Blobs;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.platform.comment.api.CommentManager;
import org.nuxeo.ecm.platform.query.api.PageProviderDefinition;
import org.nuxeo.ecm.platform.query.nxql.CoreQueryDocumentPageProvider;
import org.nuxeo.ecm.platform.task.Task;
import org.nuxeo.ecm.platform.task.TaskService;
import org.nuxeo.ecm.platform.task.core.service.DocumentTaskProvider;
import org.nuxeo.ecm.platform.task.dashboard.DashBoardItem;
import org.nuxeo.ecm.platform.task.dashboard.DashBoardItemImpl;
import org.nuxeo.runtime.api.Framework;


/**
 * @author david
 */
public class GetTasksServiceImpl implements GetTasksService {

  public Blob getTasks(CoreSession session) throws IOException {
    TaskService taskService = Framework.getService(TaskService.class);
    List<Task> tasks = taskService.getCurrentTaskInstances(session);
    CommentManager commentManager = Framework.getService(CommentManager.class);
    if (tasks == null) {
      return null;
    }
    List<Map<String, Object>> rows = new ArrayList<>();
    for (Task task : tasks) {
      DocumentModel doc = taskService.getTargetDocumentModel(task, session);

      if (doc == null) {
        continue;
      }

      DashBoardItem item = new DashBoardItemImpl(task, doc, null);
      Map<String, Object> obj = item.asMap();

      List<DocumentModel> comments = commentManager.getComments(session, task.getDocument());
      List<DocumentModel> commentsWithSessions = comments.stream()
          .map(c -> session.getDocument(c.getRef())).collect(Collectors.toList());

      ObjectMapper objectMapper = new ObjectMapper();
      String json = objectMapper.writeValueAsString(commentsWithSessions);

      obj.put("commentDocuments", json);
      rows.add(obj);
    }
    return Blobs.createJSONBlobFromValue(rows);
  }


  @Override
  public DocumentModelList getTasksForUser(CoreSession session, NuxeoPrincipal principal,
      Integer currentPageIndex, Integer pageSize, List<String> sortBy, List<String> sortOrder)
      throws OperationException {

    TaskService taskService = Framework.getService(TaskService.class);

    List<Task> test = DocumentTaskProvider.getTasks("", session, false, null);

    //wrapDocModelInTask

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
