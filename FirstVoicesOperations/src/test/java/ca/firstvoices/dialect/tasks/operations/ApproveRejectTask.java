package ca.firstvoices.dialect.tasks.operations;

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
import org.nuxeo.ecm.platform.comment.api.Comment;
import org.nuxeo.ecm.platform.comment.api.CommentImpl;
import org.nuxeo.ecm.platform.comment.api.CommentManager;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
@Operation(id = ApproveRejectTask.ID, category = Constants.CAT_DOCUMENT, label =
    "ApproveRejectTask", description =
    "Approve or Reject Task for FirstVoices Documents with the "
        + "option to create a comment Document.")
public class ApproveRejectTask {

  public static final String ID = "Document.ApproveRejectTask";

  protected AutomationService automation = Framework.getService(AutomationService.class);

  @Context
  protected CoreSession session;

  @Context
  protected OperationContext ctx;

  @Param(name = "comment", required = false)
  protected String commentInput;

  @Param(name = "status")
  protected String status;

  @OperationMethod
  public DocumentModel run(DocumentModel input) throws OperationException {

    Map<String, String> workFlowTaskParams = new HashMap<>();
    workFlowTaskParams.put("status", status);
    automation.run(ctx, "WorkflowTask.Complete", workFlowTaskParams);

    if (StringUtils.isNotEmpty(commentInput)) {
      CommentManager service = Framework.getService(CommentManager.class);
      Comment comment = new CommentImpl();
      comment.setParentId(input.getId());
      comment.setAuthor(session.getPrincipal().getName());
      comment.setText(commentInput);
      comment.setCreationDate(Instant.now());
      comment.setModificationDate(Instant.now());
      service.createComment(session, comment);
    }

    return input;
  }


}
