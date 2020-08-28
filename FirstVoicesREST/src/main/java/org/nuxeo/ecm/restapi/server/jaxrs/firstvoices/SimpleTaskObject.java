package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import static org.nuxeo.ecm.automation.core.operations.services.query.DocumentPaginatedQuery.ASC;

import ca.firstvoices.io.tasks.models.SimpleTaskAdapter;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.automation.core.util.Paginable;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.SortInfo;
import org.nuxeo.ecm.platform.query.api.PageProvider;
import org.nuxeo.ecm.platform.query.api.PageProviderDefinition;
import org.nuxeo.ecm.platform.query.api.PageProviderService;
import org.nuxeo.ecm.platform.query.nxql.CoreQueryDocumentPageProvider;
import org.nuxeo.ecm.platform.task.core.helpers.TaskActorsHelper;
import org.nuxeo.ecm.restapi.server.jaxrs.PaginableObject;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.ecm.webengine.model.exceptions.WebSecurityException;
import org.nuxeo.runtime.api.Framework;

@WebObject(type = "simpleTask")
@Produces(MediaType.APPLICATION_JSON)
public class SimpleTaskObject extends PaginableObject<SimpleTaskAdapter> {

  public static final String PAGE_PROVIDER_NAME = "GET_TASKS_FOR_ACTORS";
  protected String sortBy;
  protected String sortOrder;
  PageProviderService pageProviderService = Framework.getService(PageProviderService.class);

  @GET
  @Path("{taskId}")
  public SimpleTaskAdapter getSimpleTaskById(@PathParam("taskId") String taskId) {
    DocumentModel doc = getContext().getCoreSession().getDocument(new IdRef(taskId));
    return doc.getAdapter(SimpleTaskAdapter.class);
  }

  @GET
  public List<SimpleTaskAdapter> getAllAssignedTasks() {
    return getPaginableEntries();
  }

  @Override
  protected void initialize(Object... args) {

    final HttpServletRequest request = ctx.getRequest();
    sortBy = request.getParameter("sortBy");
    sortOrder = request.getParameter("sortOrder");

    super.initialize(args);
  }

  @Override
  protected PageProviderDefinition getPageProviderDefinition() {
    return pageProviderService.getPageProviderDefinition(PAGE_PROVIDER_NAME);
  }

  @Override
  protected Object[] getParams() {
    // Get list of actors (user + group)
    List<String> actors = TaskActorsHelper
        .getTaskActors(getContext().getCoreSession().getPrincipal());

    if (actors.isEmpty()) {
      throw new WebSecurityException("No principal was available for tasks.");
    }
    return new Object[]{actors};
  }

  @Override
  public Paginable<SimpleTaskAdapter> getPaginableEntries() {
    PageProviderDefinition ppDefinition = getPageProviderDefinition();
    if (ppDefinition == null) {
      throw new NuxeoException("Page provider given not found");
    }

    PageProviderService pps = Framework.getService(PageProviderService.class);
    Map<String, Serializable> props = new HashMap<>();
    props.put(CoreQueryDocumentPageProvider.CORE_SESSION_PROPERTY,
        (Serializable) ctx.getCoreSession());

    // Add sort information to page provider
    List<SortInfo> sortInfos = null;
    if (StringUtils.isNotBlank(sortBy)) {
      sortInfos = new ArrayList<>();
      boolean sortAscending = (sortOrder != null && !sortOrder.isEmpty() && ASC
          .equalsIgnoreCase(
              sortOrder.toLowerCase()));
      sortInfos.add(new SortInfo(sortBy, sortAscending));
    }

    return getPaginableEntries((PageProvider<SimpleTaskAdapter>) pps
        .getPageProvider("", ppDefinition, getSearchDocument(), sortInfos,
            pageSize, currentPageIndex, props, getParams()));
  }
}
