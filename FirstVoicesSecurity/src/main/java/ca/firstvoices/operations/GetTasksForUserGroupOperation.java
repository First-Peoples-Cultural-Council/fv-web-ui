package ca.firstvoices.operations;

import static org.nuxeo.ecm.automation.core.operations.services.query.DocumentPaginatedQuery.ASC;
import static org.nuxeo.ecm.automation.core.operations.services.query.DocumentPaginatedQuery.DESC;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.inject.Inject;
import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.automation.jaxrs.io.documents.PaginableDocumentModelListImpl;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.SortInfo;
import org.nuxeo.ecm.core.io.registry.MarshallerRegistry;
import org.nuxeo.ecm.platform.query.api.PageProvider;
import org.nuxeo.ecm.platform.query.api.PageProviderDefinition;
import org.nuxeo.ecm.platform.query.api.PageProviderService;
import org.nuxeo.ecm.platform.query.nxql.CoreQueryDocumentPageProvider;
import org.nuxeo.ecm.platform.task.TaskQueryConstant;
import org.nuxeo.ecm.platform.task.TaskService;
import org.nuxeo.ecm.platform.task.core.helpers.TaskActorsHelper;
import org.nuxeo.runtime.api.Framework;

/**
 * As an alternative to Task.GetAssigned, this operation supports pagination
 *
 * @author david
 */
@Operation(id = GetTasksForUserGroupOperation.ID, category = Constants.CAT_SERVICES, label =
    "GetTasksForUserGroupOperation", description =
    "Gets the tasks for a user, filtered by " + "group")
public class GetTasksForUserGroupOperation {

  public static final String ID = "GetTasksForUserGroupOperation";

  @Context
  protected CoreSession session;

  @Context
  protected TaskService taskService;

  @Inject
  protected MarshallerRegistry registry;

  @Param(name = "currentPageIndex", alias = "page", required = false, description = "Target "
      + "listing page.")
  protected Integer currentPageIndex;

  @Param(name = "pageSize", required = false, description = "Entries number per page.")
  protected Integer pageSize;

  @Param(name = "sortBy", required = false, description = "Sort by properties (separated by "
      + "comma)")
  protected StringList sortBy;

  @Param(name = "sortOrder", required = false, description = "Sort order, ASC or DESC", widget =
      Constants.W_OPTION, values = {
      ASC, DESC})
  protected StringList sortOrder;

  @OperationMethod
  public DocumentModelList run() throws IOException, OperationException {

    PageProviderService ppService = Framework.getService(PageProviderService.class);
    if (ppService == null) {
      throw new RuntimeException("Missing PageProvider service");
    }

    List<SortInfo> sortInfos = null;
    if (sortBy != null) {
      sortInfos = new ArrayList<>();
      for (int i = 0; i < sortBy.size(); i++) {
        String sort = sortBy.get(i);
        if (StringUtils.isNotBlank(sort)) {
          boolean sortAscending = (sortOrder != null && !sortOrder.isEmpty() && ASC
              .equalsIgnoreCase(
                  sortOrder.get(i).toLowerCase()));
          sortInfos.add(new SortInfo(sort, sortAscending));
        }
      }
    }

    Map<String, Serializable> props = new HashMap<>();
    // first retrieve potential props from definition
    PageProviderDefinition def = ppService
        .getPageProviderDefinition(TaskQueryConstant.GET_TASKS_FOR_ACTORS_PP);
    if (def != null) {
      Map<String, String> defProps = def.getProperties();
      if (defProps != null) {
        props.putAll(defProps);
      }
    }
    props.put(CoreQueryDocumentPageProvider.CORE_SESSION_PROPERTY, (Serializable) session);
    props.put(CoreQueryDocumentPageProvider.USE_UNRESTRICTED_SESSION_PROPERTY, Boolean.TRUE);

    Long targetPage = currentPageIndex != null ? currentPageIndex.longValue() : null;
    Long targetPageSize = pageSize != null ? pageSize.longValue() : null;

    // Get list of actors (user + group)
    List<String> actors = TaskActorsHelper.getTaskActors(session.getPrincipal());

    if (actors.isEmpty()) {
      throw new OperationException("No principal was supplied to get tasks.");
    }

    Object[] params = {actors};

    PageProvider<DocumentModel> pp = (PageProvider<DocumentModel>) ppService
        .getPageProvider(TaskQueryConstant.GET_TASKS_FOR_ACTORS_PP,
            sortInfos, targetPageSize, targetPage, props, params);

    if (pp == null) {
      throw new OperationException(
          "Page provider not found: " + TaskQueryConstant.GET_TASKS_FOR_ACTORS_PP);
    }

    PaginableDocumentModelListImpl res = new PaginableDocumentModelListImpl(pp);
    if (res.hasError()) {
      throw new OperationException(res.getErrorMessage());
    }

    return res;

    //    TaskList<SimpleTaskAdapter> tasks = new TaskList(pp);
    //    ArrayList<SimpleTaskAdapter> tasks2 = new ArrayList<>();
    //
    //    JSONObject map = new JSONObject();
    //
    //    for (DocumentModel doc : res) {
    //      //tasks.add(doc.getAdapter(SimpleTaskAdapter.class));
    //      tasks2.add(doc.getAdapter(SimpleTaskAdapter.class));
    //    }
    //
    //    map.accumulate("pageSize", tasks.getCurrentPageSize());
    //    map.accumulate("pageSize", tasks.getCurrentPageSize());
    //    map.accumulate("entries", tasks2);
    //
    //    ObjectMapper mapper = new ObjectMapper();
    //    return new StringBlob(mapper.writeValueAsString(tasks2));
  }

}
