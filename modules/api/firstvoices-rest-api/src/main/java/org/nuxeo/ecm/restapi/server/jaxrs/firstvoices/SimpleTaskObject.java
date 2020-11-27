package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import static org.nuxeo.ecm.automation.core.operations.services.query.DocumentPaginatedQuery.ASC;
import ca.firstvoices.core.io.marshallers.tasks.models.SimpleTaskAdapter;
import ca.firstvoices.operations.visibility.services.UpdateVisibilityService;
import ca.firstvoices.security.utils.CustomSecurityConstants;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.automation.core.util.Paginable;
import org.nuxeo.ecm.automation.features.PrincipalHelper;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentSecurityException;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.SortInfo;
import org.nuxeo.ecm.core.api.security.PermissionProvider;
import org.nuxeo.ecm.platform.query.api.PageProvider;
import org.nuxeo.ecm.platform.query.api.PageProviderDefinition;
import org.nuxeo.ecm.platform.query.api.PageProviderService;
import org.nuxeo.ecm.platform.query.nxql.CoreQueryDocumentPageProvider;
import org.nuxeo.ecm.platform.routing.core.impl.GraphNode;
import org.nuxeo.ecm.platform.task.Task;
import org.nuxeo.ecm.platform.task.TaskEventNames;
import org.nuxeo.ecm.platform.task.TaskService;
import org.nuxeo.ecm.platform.task.core.helpers.TaskActorsHelper;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.restapi.server.jaxrs.PaginableObject;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.ecm.webengine.model.exceptions.WebSecurityException;
import org.nuxeo.runtime.api.Framework;

/**
 * End-point to handle tasks
 */
@WebObject(type = "simpleTask")
@Produces(MediaType.APPLICATION_JSON)
public class SimpleTaskObject extends PaginableObject<SimpleTaskAdapter> {

  // This page provider gets all tasks which you are assigned to or delegated to
  public static final String DEFAULT_PP_NAME = "GET_TASKS_FOR_ACTORS_OR_DELEGATED_ACTORS";

  // This page provider will not get delegated tasks (those where changes were requested)
  public static final String EXCLUDE_DELEGATED_PP_NAME = "GET_NON_DELEGATED_TASKS_FOR_ACTORS";

  protected String sortBy;

  protected String sortOrder;

  PageProviderService pageProviderService = Framework.getService(PageProviderService.class);

  TaskService taskService = Framework.getService(TaskService.class);

  UpdateVisibilityService updateVisibilityService =
      Framework.getService(UpdateVisibilityService.class);

  @GET
  @Path("{taskId}")
  public SimpleTaskAdapter getTask(@PathParam("taskId") String taskId) {
    DocumentModel doc = getContext().getCoreSession().getDocument(new IdRef(taskId));
    return doc.getAdapter(SimpleTaskAdapter.class);
  }

  @GET
  public List<SimpleTaskAdapter> getTasks(
      @QueryParam("excludeDelegatedTasks") @DefaultValue("true") boolean excludeDelegatedTasks) {
    if (excludeDelegatedTasks) {
      // Will filter out tasks that are delegated
      // i.e. tasks where the language admin clicked "request changes"
      // This is the default mode for language admins
      return getEntriesExcludingDelegatedTasks();
    } else {
      // Will return all tasks including delegated tasks
      // This should be activated when a language recorder is accessing tasks
      // Or when a language admin would want to see tasks they delegated
      return getPaginableEntries();
    }
  }

  @PUT
  @Path("{taskId}/approve")
  @Produces(MediaType.TEXT_PLAIN)
  public Response approve(
      @PathParam("taskId") String taskId,
      @QueryParam("requestedVisibility") String requestedVisibility) {
    CoreSession session = getContext().getCoreSession();

    try {

      DocumentModel task = session.getDocument(new IdRef(taskId));
      SimpleTaskAdapter taskObject = task.getAdapter(SimpleTaskAdapter.class);

      IdRef targetDoc = new IdRef(taskObject.getTargetDocId());
      if (session.exists(targetDoc) && !session.isTrashed(targetDoc)) {

        if (requestedVisibility == null || StringUtils.isEmpty(requestedVisibility)) {
          requestedVisibility = taskObject.getRequestedVisibility();
        }

        // Validate visibility
        if (!updateVisibilityService.isValidVisibility(requestedVisibility)) {
          return Response
              .status(Status.BAD_REQUEST)
              .entity("Requested visibility " + requestedVisibility + " is not a valid option.")
              .build();
        }

        // Optional data
        HashMap<String, Object> data = new HashMap<>();
        String approvedCommentText = "Approved with no change.";

        if (!taskObject.getRequestedVisibility().equals(requestedVisibility)) {
          approvedCommentText =
              "Approved with a visibility change from '" + taskObject.getRequestedVisibility()
                  + "' to '" + requestedVisibility + "'";
        }
        data.put(GraphNode.NODE_VARIABLE_COMMENT, approvedCommentText);

        // Update visibility (if necessary)
        updateVisibilityService.updateVisibility(session.getDocument(targetDoc),
            requestedVisibility);

        Task coreTask = taskService.getTask(session, taskId);

        if (taskService.canEndTask(session.getPrincipal(), coreTask)) {
          taskService.endTask(session,
              session.getPrincipal(),
              coreTask,
              approvedCommentText,
              TaskEventNames.WORKFLOW_TASK_COMPLETED,
              true);
        } else {
          throw new DocumentSecurityException();
        }
      } else {
        // Document has been removed or trashed
        // Should be handled by reject as a manual operation by the user
        return Response.status(Status.GONE).build();
      }
    } catch (DocumentSecurityException exception) {
      return Response
          .status(Status.FORBIDDEN)
          .entity("You do not have permission to approve this task.")
          .build();
    }

    return Response.ok("Task approved.").status(Status.OK).build();
  }

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.TEXT_PLAIN)
  @Path("{taskId}/requestChanges")
  public Response requestChanges(@PathParam("taskId") String taskId, String approvalProperties)
      throws IOException {

    final String approvedVisibilityFieldName = "approvedVisibility";
    final String commentFieldName = "comment";

    JsonNode json = new ObjectMapper().readTree(approvalProperties);

    try {

      // Get task
      CoreSession session = getContext().getCoreSession();
      DocumentModel task = session.getDocument(new IdRef(taskId));

      // Get comment
      String comment = json.has(commentFieldName) ? json.get(commentFieldName).textValue() : null;

      // Approved visibility property
      if (json.has(approvedVisibilityFieldName)) {
        String approvedVisibility = json.get(approvedVisibilityFieldName).textValue();

        // Validate visibility
        if (!updateVisibilityService.isValidVisibility(approvedVisibility)) {
          return Response
              .status(Status.BAD_REQUEST)
              .entity("Requested visibility state is not a valid option.")
              .build();
        }

        task.setPropertyValue("nt:directive", approvedVisibility);
        session.saveDocument(task);
      }

      // Delegate task to recorder
      SimpleTaskAdapter taskObject = task.getAdapter(SimpleTaskAdapter.class);
      IdRef targetDoc = new IdRef(taskObject.getTargetDocId());

      if (!session.exists(targetDoc) || session.isTrashed(targetDoc)) {
        return Response.status(Status.GONE).build();
      }

      DocumentModel doc = session.getDocument(targetDoc);
      Set<String> recorders = getActors(doc, CustomSecurityConstants.RECORD);

      // Delegate task
      // A notification will be sent, configured in FVCoreIO -> notifications
      taskService.delegateTask(getContext().getCoreSession(),
          taskId,
          new ArrayList<>(recorders),
          comment);

      session.save();

    } catch (DocumentSecurityException exception) {
      return Response
          .status(Status.FORBIDDEN)
          .entity("You do not have permission to approve this task.")
          .build();
    }

    return Response.ok().status(Status.OK).build();
  }

  @PUT
  @Path("{taskId}/ignore")
  public Response ignore(@PathParam("taskId") String taskId) {
    CoreSession session = getContext().getCoreSession();

    try {
      Task task = taskService.getTask(session, taskId);

      if (taskService.canEndTask(session.getPrincipal(), task)) {
        taskService.endTask(session,
            session.getPrincipal(),
            task,
            "Task ignored.",
            TaskEventNames.WORKFLOW_TASK_REJECTED,
            false);
      }
    } catch (DocumentSecurityException exception) {
      return Response
          .status(Status.FORBIDDEN)
          .entity("You do not have permission to ignore this task.")
          .build();
    }

    return Response.ok().status(Status.OK).build();
  }

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.TEXT_PLAIN)
  @Path("requestReview")
  public Response requestReview(String requestProperties) throws IOException {

    final String docIdFieldName = "docId";
    final String requestedVisibilityFieldName = "requestedVisibility";
    final String commentFieldName = "comment";

    JsonNode json = new ObjectMapper().readTree(requestProperties);

    if (!json.has(docIdFieldName)) {
      return Response
          .status(Status.BAD_REQUEST)
          .entity("docId property missing in JSON body.")
          .build();
    }

    IdRef docId = new IdRef(json.get(docIdFieldName).textValue());
    CoreSession session = ctx.getCoreSession();

    if (!session.exists(docId)) {
      return Response
          .status(Status.NOT_FOUND)
          .entity("Document with docId " + docId + " was not found.")
          .build();
    }

    DocumentModel doc = session.getDocument(docId);

    if (!doc.hasSchema("fvcore")) {
      return Response
          .status(Status.BAD_REQUEST)
          .entity("Tasks can only be executed on documents with fvcore schema.")
          .build();
    }

    if (!session.hasPermission(session.getPrincipal(),
        doc.getRef(),
        CustomSecurityConstants.RECORD)) {
      return Response
          .status(Status.FORBIDDEN)
          .entity("You do not have permission to start a task on this document.")
          .build();
    }

    if (!taskService.getTaskInstances(doc, (NuxeoPrincipal) null, session).isEmpty()) {
      return Response
          .status(Status.CONFLICT)
          .entity("A task is already present for this document.")
          .build();
    }

    // Requested visibility property
    String requestedVisibility = "";

    if (json.has(requestedVisibilityFieldName)) {
      requestedVisibility = json.get(requestedVisibilityFieldName).textValue();

      // Validate visibility
      if (!updateVisibilityService.isValidVisibility(requestedVisibility)) {
        return Response
            .status(Status.BAD_REQUEST)
            .entity("Requested visibility state is not a valid option.")
            .build();
      }
    }

    // Comment
    String comment = json.has(commentFieldName) ? json.get(commentFieldName).textValue() : null;

    // Other task variables
    HashMap<String, String> taskVariables = new HashMap<>();

    if (requestedVisibility.isEmpty()) {
      taskVariables.put("visibilityChanged", "false");
    }

    taskService.createTask(session,
        session.getPrincipal(),
        doc,
        "RoutingTask",
        "RoutingTask",
        null,
        new ArrayList<>(getActors(doc, CustomSecurityConstants.APPROVE)),
        false,
        requestedVisibility,
        comment,
        null,
        null,
        null);

    session.save();

    return Response.ok("Request submitted!").status(Status.CREATED).build();
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
    return pageProviderService.getPageProviderDefinition(DEFAULT_PP_NAME);
  }

  @Override
  protected Object[] getParams() {
    NuxeoPrincipal currentUser = getContext().getCoreSession().getPrincipal();

    // Get list of actors (user + group)
    List<String> actors = TaskActorsHelper.getTaskActors(currentUser);

    if (actors.isEmpty()) {
      throw new WebSecurityException("No principal was available for tasks.");
    }

    // See `GET_TASKS_FOR_ACTORS_OR_DELEGATED_ACTORS` for query
    // Searches for actors who are assigned, and current user who is delegated
    return new Object[]{actors, Collections.singletonList(currentUser.getName())};
  }

  @Override
  public Paginable<SimpleTaskAdapter> getPaginableEntries() {
    PageProviderDefinition ppDefinition = getPageProviderDefinition();
    if (ppDefinition == null) {
      throw new NuxeoException("Page provider given not found");
    }

    return getPaginableEntriesForPageProvider(ppDefinition, getParams());
  }

  @SuppressWarnings("unchecked")
  private Paginable<SimpleTaskAdapter> getPaginableEntriesForPageProvider(
      PageProviderDefinition ppDefinition, Object[] params) {
    PageProviderService pps = Framework.getService(PageProviderService.class);
    Map<String, Serializable> props = new HashMap<>();
    props.put(CoreQueryDocumentPageProvider.CORE_SESSION_PROPERTY,
        (Serializable) ctx.getCoreSession());

    // Add sort information to page provider
    List<SortInfo> sortInfos = null;
    if (StringUtils.isNotBlank(sortBy)) {
      sortInfos = new ArrayList<>();
      boolean sortAscending = (sortOrder != null && !sortOrder.isEmpty() && ASC.equalsIgnoreCase(
          sortOrder.toLowerCase()));
      sortInfos.add(new SortInfo(sortBy, sortAscending));
    }

    return getPaginableEntries((PageProvider<SimpleTaskAdapter>) pps.getPageProvider("",
        ppDefinition,
        getSearchDocument(),
        sortInfos,
        pageSize,
        currentPageIndex,
        props,
        params));
  }

  private Paginable<SimpleTaskAdapter> getEntriesExcludingDelegatedTasks() {
    NuxeoPrincipal currentUser = getContext().getCoreSession().getPrincipal();

    // Get list of actors (user + group)
    List<String> actors = TaskActorsHelper.getTaskActors(currentUser);

    if (actors.isEmpty()) {
      throw new WebSecurityException("No principal was available for tasks.");
    }

    // Will exclude delegated tasks for language admins
    PageProviderDefinition ppDefinition =
        pageProviderService.getPageProviderDefinition(EXCLUDE_DELEGATED_PP_NAME);

    if (ppDefinition == null) {
      throw new NuxeoException("Page provider given not found");
    }

    return getPaginableEntriesForPageProvider(ppDefinition, new Object[]{actors});
  }

  /**
   * Gets set of actors for the task given the permission
   *
   * @param doc        document to check permissions against
   * @param permission permission to search for (e.g. Approve, Record)
   * @return list of groups with `approve` permission or higher, excluding super admins
   */
  private Set<String> getActors(DocumentModel doc, String permission) {

    UserManager userManager = Framework.getService(UserManager.class);

    PrincipalHelper principalHelper =
        new PrincipalHelper(userManager, Framework.getService(PermissionProvider.class));

    Set<String> usersAndGroups =
        principalHelper.getUserAndGroupIdsForPermission(doc, permission, false, false, true);

    // Exclude super admins
    List<String> groupsToExclude = userManager
        .getAdministratorsGroups()
        .stream()
        .map((group -> "group:" + group))
        .collect(Collectors.toList());

    // Exclude current user's groups
    groupsToExclude.addAll(doc
        .getCoreSession()
        .getPrincipal()
        .getAllGroups()
        .stream()
        .map((group -> "group:" + group))
        .collect(Collectors.toList()));

    return usersAndGroups
        .stream()
        .filter(userOrGroup -> !groupsToExclude.contains(userOrGroup))
        .filter(userOrGroup -> !userOrGroup.contains("user:"))
        .collect(Collectors.toSet());
  }
}
