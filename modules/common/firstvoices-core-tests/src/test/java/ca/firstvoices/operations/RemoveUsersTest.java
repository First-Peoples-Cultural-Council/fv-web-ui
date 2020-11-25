package ca.firstvoices.operations;

import ca.firstvoices.testUtil.AbstractFirstVoicesCoreTestsTest;
import ca.firstvoices.tests.mocks.operations.GenerateDialect;
import ca.firstvoices.tests.mocks.operations.GenerateUsers;
import ca.firstvoices.tests.mocks.operations.RemoveUsers;
import java.util.HashMap;
import java.util.List;
import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;

public class RemoveUsersTest extends AbstractFirstVoicesCoreTestsTest {

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
    automationService.run(ctx, GenerateUsers.ID, params);

    List<String> existingUsers = userManager.getUserIds();
    Assert.assertTrue(existingUsers.contains(dialect.getName() + "_members"));
    Assert.assertTrue(existingUsers.contains(dialect.getName() + "_recorders"));
    Assert.assertTrue(existingUsers.contains(dialect.getName() + "_recorders_with_approval"));
    Assert.assertTrue(existingUsers.contains(dialect.getName() + "_language_administrators"));

    automationService.run(ctx, RemoveUsers.ID, params);
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

  @Test
  public void removeUsersForDialects() throws OperationException {
    params = new HashMap<>();
    params.put("randomize", "false");
    params.put("maxEntries", "50");
    params.put("dialectName", "dialectA");

    OperationContext ctx = new OperationContext(session);

    DocumentModel dialectA = (DocumentModel) automationService.run(ctx, GenerateDialect.ID, params);

    createNewGroup(dialectA.getName().toLowerCase() + "_members",
        dialectA.getName() + " Members");
    createNewGroup(dialectA.getName().toLowerCase() + "_recorders",
        dialectA.getName() + " Recorders");
    createNewGroup(dialectA.getName().toLowerCase() + "_recorders_with_approval",
        dialectA.getName() + " Recorders With Approval");
    createNewGroup(dialectA.getName().toLowerCase() + "_language_administrators",
        dialectA.getName() + " Language Administrators");

    params = new HashMap<>();
    params.put("randomize", "false");
    params.put("maxEntries", "50");
    params.put("dialectName", "dialectB");

    DocumentModel dialectB = (DocumentModel) automationService.run(ctx, GenerateDialect.ID, params);

    createNewGroup(dialectB.getName().toLowerCase() + "_members",
        dialectB.getName() + " Members");
    createNewGroup(dialectB.getName().toLowerCase() + "_recorders",
        dialectB.getName() + " Recorders");
    createNewGroup(dialectB.getName().toLowerCase() + "_recorders_with_approval",
        dialectB.getName() + " Recorders With Approval");
    createNewGroup(dialectB.getName().toLowerCase() + "_language_administrators",
        dialectB.getName() + " Language Administrators");

    automationService.run(ctx, GenerateUsers.ID);

    List<String> existingUsers = userManager.getUserIds();
    Assert.assertTrue(existingUsers.contains(dialectA.getName() + "_members"));
    Assert.assertTrue(existingUsers.contains(dialectA.getName() + "_recorders"));
    Assert.assertTrue(existingUsers.contains(dialectA.getName() + "_recorders_with_approval"));
    Assert.assertTrue(existingUsers.contains(dialectA.getName() + "_language_administrators"));

    Assert.assertTrue(existingUsers.contains(dialectB.getName() + "_members"));
    Assert.assertTrue(existingUsers.contains(dialectB.getName() + "_recorders"));
    Assert.assertTrue(existingUsers.contains(dialectB.getName() + "_recorders_with_approval"));
    Assert.assertTrue(existingUsers.contains(dialectB.getName() + "_language_administrators"));

    automationService.run(ctx, RemoveUsers.ID);
    Assert.assertTrue(
        userManager.getUsersInGroup(dialectA.getName().toLowerCase() + "_members").isEmpty());
    Assert.assertTrue(
        userManager.getUsersInGroup(dialectA.getName().toLowerCase() + "_recorders").isEmpty());
    Assert.assertTrue(
        userManager.getUsersInGroup(dialectA.getName().toLowerCase() + "_recorders_with_approval")
            .isEmpty());
    Assert.assertTrue(
        userManager.getUsersInGroup(dialectA.getName().toLowerCase() + "_language_administrators")
            .isEmpty());

    Assert.assertTrue(
        userManager.getUsersInGroup(dialectB.getName().toLowerCase() + "_members").isEmpty());
    Assert.assertTrue(
        userManager.getUsersInGroup(dialectB.getName().toLowerCase() + "_recorders").isEmpty());
    Assert.assertTrue(
        userManager.getUsersInGroup(dialectB.getName().toLowerCase() + "_recorders_with_approval")
            .isEmpty());
    Assert.assertTrue(
        userManager.getUsersInGroup(dialectB.getName().toLowerCase() + "_language_administrators")
            .isEmpty());

  }

}
