package ca.firstvoices.dialect.operations;

import static ca.firstvoices.schemas.DialectTypesConstants.FV_WORD;
import static ca.firstvoices.utils.CustomSecurityConstants.LANGUAGE_ADMINS_GROUP;

import ca.firstvoices.dialect.services.ApproveRejectTaskService;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.platform.comment.api.CommentManager;
import org.nuxeo.ecm.platform.task.Task;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.mockito.RuntimeService;
import testUtil.AbstractFirstVoicesOperationsTest;

/**
 * @author david
 */
public class ApproveRejectTaskTest extends AbstractFirstVoicesOperationsTest {

  @InjectMocks
  @RuntimeService
  private ApproveRejectTaskService approveRejectTaskService;

  @Test
  public void test() throws OperationException {

    session.save();

    ArrayList<String> actors = new ArrayList<>(
        Arrays.asList(recorder.getName(), LANGUAGE_ADMINS_GROUP));
    Calendar calendar = Calendar.getInstance();
    calendar.set(2006, Calendar.JULY, 6);
    calendar.set(Calendar.MILLISECOND, 0);

    taskService
        .createTask(session, languageAdmin, word, "Test Task Name", FV_WORD, "test process id",
            actors, false, "test directive", "test comment", calendar.getTime(), null, null);
    session.save();

    List<Task> tasks = taskService.getTaskInstances(word, (NuxeoPrincipal) null, session);

    Assert.assertNotNull(tasks);
    Assert.assertEquals(1, tasks.size());
    OperationContext ctx = new OperationContext(session);
    Map<String, String> params = new HashMap<>();

    params.put("comment", "comment");
    params.put("status", "approve");
    ctx.setInput(tasks.get(0).getDocument());

    //    Mockito.when(approveRejectTaskService.approveOrRejectTask(Matchers.any(OperationContext
    //    .class),
    //        Matchers.any(CoreSession.class), Matchers.any(Task.class), Mockito.anyString()))
    //        .thenCallRealMethod();

    Mockito.when(
        approveRejectTaskService.completeTask(Mockito.any(), Mockito.any(), Mockito.anyString()))
        .thenReturn(null);

    automationService.run(ctx, ApproveRejectTask.ID, params);

    CommentManager commentManager = Framework.getService(CommentManager.class);
    tasks.get(0).getTargetDocumentsIds().forEach(docid -> {
      DocumentModel doc = session.getDocument(new IdRef(docid));
      List<DocumentModel> comments = commentManager.getComments(session, doc);
      Assert.assertEquals(1, comments.size());
    });
  }

}
