package ca.firstvoices.operations;

import ca.firstvoices.testUtil.AbstractFirstVoicesCoreTestsTest;
import ca.firstvoices.tests.mocks.operations.GenerateDialects;
import ca.firstvoices.tests.mocks.operations.RemoveDialects;
import java.util.HashMap;
import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentSecurityException;

/**
 * @author bronson
 */

public class RemoveDialectsTest extends AbstractFirstVoicesCoreTestsTest {

  @Test
  public void removeDialects() throws OperationException {

    int expectedDialects = 10;
    params = new HashMap<>();
    params.put("randomize", "true");
    params.put("maxDialects", "" + expectedDialects);
    params.put("maxEntries", "20");

    OperationContext ctx = new OperationContext(session);

    automationService.run(ctx, GenerateDialects.ID, params);
    DocumentModelList generatedDialects = session
        .query("SELECT * FROM FVDialect WHERE ecm:ancestorId='" + language.getId()
            + "'");
    Assert.assertEquals(generatedDialects.size(), expectedDialects);

    automationService.run(ctx, RemoveDialects.ID);

    Assert.assertTrue(session
        .query("SELECT * FROM FVDialect WHERE ecm:ancestorId='" + language.getId()
            + "'")
        .isEmpty());
  }

  @Test(expected = DocumentSecurityException.class)
  public void notAccessibleByRecorders() throws OperationException {

    setUser(recorder);
    OperationContext ctx = new OperationContext(userSession);
    automationService.run(ctx, RemoveDialects.ID);
  }

  @Test(expected = DocumentSecurityException.class)
  public void notAccessibleByRecordersWithApproval() throws OperationException {

    setUser(recorderWithApproval);
    OperationContext ctx = new OperationContext(userSession);
    automationService.run(ctx, RemoveDialects.ID);
  }

  @Test(expected = DocumentSecurityException.class)
  public void notAccessibleBylanguageAdmins() throws OperationException {

    setUser(languageAdmin);
    OperationContext ctx = new OperationContext(userSession);
    automationService.run(ctx, RemoveDialects.ID);
  }

}
