package ca.firstvoices.dialect.operations;

import ca.firstvoices.dialect.services.FirstVoicesTaskService;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.platform.task.Task;
import org.nuxeo.ecm.platform.task.TaskService;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
@Operation(id = ApproveRejectTaskOperation.ID, category = Constants.CAT_DOCUMENT, label =
    "ApproveRejectTaskOperation", description =
    "Approve or Reject Task for FirstVoices Documents with the "
        + "option to create a comment for the Task.")
public class ApproveRejectTaskOperation {

  public static final String ID = "Task.ApproveRejectTaskOperation";

  protected AutomationService automation = Framework.getService(AutomationService.class);

  @Context
  private CoreSession session;

  @Context
  private OperationContext ctx;

  @Param(name = "comment", required = false)
  private String commentInput;

  @Param(name = "status", values = {"approve", "reject", "validate"})
  private String status;

  @OperationMethod
  public DocumentModel run(DocumentModel taskDoc) throws OperationException {

    TaskService taskService = Framework.getService(TaskService.class);
    Task task = taskService.getTask(session, taskDoc.getId());

    if (task == null) {
      throw new NuxeoException("Task not found");
    }

    if (status.equalsIgnoreCase("approve")) {
      status = "validate";
    }

    FirstVoicesTaskService service = Framework.getService(FirstVoicesTaskService.class);
    service.updateTaskStatus(ctx, task, status);
    return service.addCommentToTask(session, task, commentInput);
  }

}
