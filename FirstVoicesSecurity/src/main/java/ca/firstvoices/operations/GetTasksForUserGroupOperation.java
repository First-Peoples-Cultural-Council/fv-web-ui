package ca.firstvoices.operations;

import ca.firstvoices.services.GetTasksService;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
@Operation(id = GetTasksForUserGroupOperation.ID, category = Constants.CAT_SERVICES, label =
    "GetTasksForUserGroupOperation", description =
    "Gets the tasks for a user, filtered by " + "group")
public class GetTasksForUserGroupOperation {

  public static final String ID = "GetTasksForUserGroupOperation";

  @Context
  protected CoreSession session;

  @OperationMethod
  public DocumentModelList run() {
    GetTasksService service = Framework.getService(GetTasksService.class);
    return service.getTasksForUser(session, session.getPrincipal());
  }

}
