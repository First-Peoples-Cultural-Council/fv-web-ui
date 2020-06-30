package ca.firstvoices.dialect.services;

import static ca.firstvoices.schemas.DialectTypesConstants.FV_WORD;
import static ca.firstvoices.utils.CustomSecurityConstants.LANGUAGE_ADMINS_GROUP;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.platform.comment.api.Comment;
import org.nuxeo.ecm.platform.comment.api.CommentManager;
import org.nuxeo.ecm.platform.task.Task;
import org.nuxeo.runtime.api.Framework;
import testUtil.AbstractFirstVoicesOperationsTest;

/**
 * @author david
 */
public class ApproveRejectTaskServiceTest extends AbstractFirstVoicesOperationsTest {

  @Test
  public void test() throws OperationException {
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

    DocumentModel task = firstVoicesTaskService.addCommentToTask(session, tasks.get(0), "comment");

    CommentManager commentManager = Framework.getService(CommentManager.class);
    List<Comment> comments = commentManager.getComments(session, task.getId());
    Assert.assertEquals(1, comments.size());
    Assert.assertEquals(comments.get(0).getText(), "comment");
  }

}
