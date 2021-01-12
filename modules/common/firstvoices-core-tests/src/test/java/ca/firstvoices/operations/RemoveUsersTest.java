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

    // Confirm users and groups are created
    Assert.assertEquals(4, userManager.searchUsers(dialect.getName()).size());
    Assert.assertEquals(4, userManager.searchGroups(dialect.getName()).size());

    automationService.run(ctx, RemoveUsers.ID, params);

    // Confirm users and groups are removed
    Assert.assertTrue(userManager.searchUsers(dialect.getName()).isEmpty());
    Assert.assertTrue(userManager.searchGroups(dialect.getName()).isEmpty());
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

    // Confirm users and groups are created
    Assert.assertEquals(4, userManager.searchUsers(dialectA.getName()).size());
    Assert.assertEquals(4, userManager.searchUsers(dialectA.getName()).size());

    Assert.assertEquals(4, userManager.searchGroups(dialectB.getName()).size());
    Assert.assertEquals(4, userManager.searchGroups(dialectB.getName()).size());

    automationService.run(ctx, RemoveUsers.ID);

    // Confirm users and groups are removed
    Assert.assertTrue(userManager.searchUsers(dialectA.getName()).isEmpty());
    Assert.assertTrue(userManager.searchUsers(dialectA.getName()).isEmpty());

    Assert.assertTrue(userManager.searchGroups(dialectB.getName()).isEmpty());
    Assert.assertTrue(userManager.searchGroups(dialectB.getName()).isEmpty());
  }

}
