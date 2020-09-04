package ca.firstvoices.operations;

import ca.firstvoices.testUtil.AbstractFirstVoicesCoreTestsTest;
import ca.firstvoices.tests.mocks.operations.GenerateDialect;
import ca.firstvoices.tests.mocks.operations.GenerateUsersForDialect;
import ca.firstvoices.tests.mocks.operations.RemoveUsersForDialect;
import java.util.HashMap;
import java.util.List;
import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;

public class RemoveUsersForDialectTest extends AbstractFirstVoicesCoreTestsTest {

  @Test
  public void removeUsersForDialect() throws OperationException {
    params = new HashMap<>();
    params.put("randomize", "false");
    params.put("maxEntries", "50");
    params.put("dialectName", "Xx_Dialect_xX");

    OperationContext ctx = new OperationContext(session);

    DocumentModel dialect = (DocumentModel) automationService.run(ctx, GenerateDialect.ID, params);

    createNewGroup(dialect.getName().toLowerCase() + "_members",
        dialect.getName() + " Members");
    createNewGroup(dialect.getName().toLowerCase() + "_recorders",
        dialect.getName() + " Recorders");
    createNewGroup(dialect.getName().toLowerCase() + "_recorders_with_approval",
        dialect.getName() + " Recorders With Approval");
    createNewGroup(dialect.getName().toLowerCase() + "_language_administrators",
        dialect.getName() + " Language Administrators");

    params = new HashMap<>();
    params.put("dialectName", "Xx_Dialect_xX");
    automationService.run(ctx, GenerateUsersForDialect.ID, params);

    List<String> existingUsers = userManager.getUserIds();
    Assert.assertTrue(existingUsers.contains(dialect.getName() + "_members"));
    Assert.assertTrue(existingUsers.contains(dialect.getName() + "_recorders"));
    Assert.assertTrue(existingUsers.contains(dialect.getName() + "_recorders_with_approval"));
    Assert.assertTrue(existingUsers.contains(dialect.getName() + "_language_administrators"));

    automationService.run(ctx, RemoveUsersForDialect.ID, params);
    Assert.assertTrue(
        userManager.getUsersInGroup(dialect.getName().toLowerCase() + "_members").isEmpty());
    Assert.assertTrue(
        userManager.getUsersInGroup(dialect.getName().toLowerCase() + "_recorders").isEmpty());
    Assert.assertTrue(
        userManager.getUsersInGroup(dialect.getName().toLowerCase() + "_recorders_with_approval")
            .isEmpty());
    Assert.assertTrue(
        userManager.getUsersInGroup(dialect.getName().toLowerCase() + "_language_administrators")
            .isEmpty());

  }

}
