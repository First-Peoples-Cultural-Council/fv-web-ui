package ca.firstvoices.dialect.services;

import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.task.Task;

/**
 * @author david
 */
public interface ApproveRejectTaskService {

  DocumentModel approveOrRejectTask(OperationContext ctx, CoreSession session, Task task,
      String commentInput) throws OperationException;

  DocumentModel completeTask(OperationContext ctx, Task task, String status)
      throws OperationException;

}
