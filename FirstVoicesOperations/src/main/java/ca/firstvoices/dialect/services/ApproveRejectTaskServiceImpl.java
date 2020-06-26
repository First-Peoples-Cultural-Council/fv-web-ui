package ca.firstvoices.dialect.services;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.comment.api.Comment;
import org.nuxeo.ecm.platform.comment.api.CommentImpl;
import org.nuxeo.ecm.platform.comment.api.CommentManager;
import org.nuxeo.ecm.platform.task.Task;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
public class ApproveRejectTaskServiceImpl implements ApproveRejectTaskService {

  @Override
  public DocumentModel approveOrRejectTask(OperationContext ctx, CoreSession session, Task task,
      String commentInput) {

    if (StringUtils.isNotEmpty(commentInput)) {
      task.getTargetDocumentsIds().forEach(docId -> {
        Comment comment = new CommentImpl();
        comment.setParentId(docId);
        comment.setAuthor(session.getPrincipal().getName());
        comment.setText(commentInput);
        comment.setCreationDate(Instant.now());
        comment.setModificationDate(Instant.now());
        CommentManager service = Framework.getService(CommentManager.class);
        service.createComment(session, comment);
      });
    }

    return task.getDocument();
  }

  @Override
  public DocumentModel completeTask(OperationContext ctx, Task task, String status)
      throws OperationException {
    AutomationService automation = Framework.getService(AutomationService.class);
    Map<String, String> workFlowTaskParams = new HashMap<>();
    workFlowTaskParams.put("status", status);
    return (DocumentModel) automation.run(ctx, "WorkflowTask.Complete", workFlowTaskParams);
  }

}
