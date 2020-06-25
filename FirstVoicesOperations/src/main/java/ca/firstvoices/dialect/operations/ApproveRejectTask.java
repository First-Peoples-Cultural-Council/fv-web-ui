package ca.firstvoices.dialect.operations;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
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
import org.nuxeo.ecm.platform.comment.api.Comment;
import org.nuxeo.ecm.platform.comment.api.CommentImpl;
import org.nuxeo.ecm.platform.comment.api.CommentManager;
import org.nuxeo.ecm.platform.task.Task;
import org.nuxeo.ecm.platform.task.TaskService;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
@Operation(id = ApproveRejectTask.ID, category = Constants.CAT_DOCUMENT, label =
    "ApproveRejectTask", description =
    "Approve or Reject Task for FirstVoices Documents with the "
        + "option to create a comment for the Task's Documenti.")
public class ApproveRejectTask {

  public static final String ID = "Task.ApproveRejectTask";

  protected AutomationService automation = Framework.getService(AutomationService.class);

  @Context
  protected CoreSession session;

  @Context
  protected OperationContext ctx;

  @Param(name = "comment", required = false)
  protected String commentInput;

  @Param(name = "status", values = {"approve", "reject", "validate"})
  protected String status;

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

    Map<String, String> workFlowTaskParams = new HashMap<>();
    workFlowTaskParams.put("status", status);
    automation.run(ctx, "WorkflowTask.Complete", workFlowTaskParams);

    if (StringUtils.isNotEmpty(commentInput)) {
      DocumentModel parentDoc = task.getDocument();
      Comment comment = new CommentImpl();
      comment.setParentId(parentDoc.getId());
      comment.setAuthor(session.getPrincipal().getName());
      comment.setText(commentInput);
      comment.setCreationDate(Instant.now());
      comment.setModificationDate(Instant.now());
      CommentManager service = Framework.getService(CommentManager.class);
      service.createComment(session, comment);
    }
    //    Document:
    //ed52b1d8-08f0-459f-8487-91b1b7b81121
    //    Task
    //    b0b0559c-1ba5-495e-bcd0-2bc47c4ac8bf
    return taskDoc;
  }


}
