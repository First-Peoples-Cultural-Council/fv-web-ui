package ca.firstvoices.operations;

import ca.firstvoices.testUtil.AbstractFirstVoicesCoreTestsTest;
import ca.firstvoices.tests.mocks.operations.GenerateDialect;
import ca.firstvoices.tests.mocks.operations.RemoveDialect;
import java.util.HashMap;
import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentSecurityException;

/**
 * @author bronson
 */

public class RemoveDialectTest extends AbstractFirstVoicesCoreTestsTest {

  @Test
  public void removeDialect() throws OperationException {

    params = new HashMap<>();
    params.put("randomize", "true");
    params.put("maxEntries", "50");

    OperationContext ctx = new OperationContext(session);

    DocumentModel dialect = (DocumentModel) automationService.run(ctx, GenerateDialect.ID, params);
    Assert.assertEquals(1, session
        .query("SELECT * FROM FVDialect WHERE ecm:ancestorId='" + language.getId()
            + "'").size());

    params = new HashMap<>();
    params.put("dialectName", (String) dialect.getPropertyValue("dc:title"));
    automationService.run(ctx, RemoveDialect.ID, params);

    Assert.assertEquals(0, session
        .query("SELECT * FROM FVDialect WHERE ecm:ancestorId='" + language.getId()
            + "'").size());

  }

  @Test(expected = DocumentSecurityException.class)
  public void notAccessibleByRecorders() throws OperationException {
    params = new HashMap<>();
    params.put("dialectName", "");

    setUser(recorder);
    OperationContext ctx = new OperationContext(userSession);
    automationService.run(ctx, RemoveDialect.ID, params);
  }

  @Test(expected = DocumentSecurityException.class)
  public void notAccessibleByRecordersWithApproval() throws OperationException {
    params = new HashMap<>();
    params.put("dialectName", "");

    setUser(recorderWithApproval);
    OperationContext ctx = new OperationContext(userSession);
    automationService.run(ctx, RemoveDialect.ID, params);
  }

  @Test(expected = DocumentSecurityException.class)
  public void notAccessibleBylanguageAdmins() throws OperationException {
    params = new HashMap<>();
    params.put("dialectName", "");

    setUser(languageAdmin);
    OperationContext ctx = new OperationContext(userSession);
    automationService.run(ctx, RemoveDialect.ID, params);
  }

}
