package ca.firstvoices.operations;

import ca.firstvoices.testUtil.AbstractFirstVoicesCoreTestsTest;
import ca.firstvoices.tests.mocks.operations.GenerateDialect;
import java.util.HashMap;
import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentSecurityException;
import org.nuxeo.ecm.core.api.PathRef;

/**
 * @author bronson
 */

public class GenerateDialectTest extends AbstractFirstVoicesCoreTestsTest {

  @Test
  public void generateDemoDialect() throws OperationException {
    params = new HashMap<>();
    params.put("randomize", "false");
    params.put("maxEntries", "50");
    params.put("dialectName", "Xx_Dialect_xX");

    OperationContext ctx = new OperationContext(session);

    DocumentModel dialect = (DocumentModel) automationService.run(ctx, GenerateDialect.ID, params);
    String s = (String) dialect.getPropertyValue("dc:description");
    Assert.assertEquals("This is a generated test dialect for demo and cypress test purposes.", s);

    Assert.assertTrue(
        session.exists(new PathRef("/FV/Workspaces/Data/Test/Test/Xx_Dialect_xX")));
    Assert.assertEquals(26, session
        .query("SELECT * FROM FVCharacter WHERE ecm:ancestorId='" + dialect.getId()
            + "'").size());
  }

  @Test
  public void generateRandomDialect() throws OperationException {

    params = new HashMap<>();
    params.put("randomize", "true");
    params.put("maxEntries", "50");

    OperationContext ctx = new OperationContext(session);

    DocumentModel dialect = (DocumentModel) automationService.run(ctx, GenerateDialect.ID, params);

    String s = (String) dialect.getPropertyValue("dc:description");
    Assert.assertNotNull(s);

    DocumentModelList test = session
        .query("SELECT * FROM FVCharacter WHERE ecm:ancestorId='" + dialect.getId()
            + "'");

    Assert.assertEquals(30, test.size());
    Assert.assertEquals(1, session
        .query("SELECT * FROM FVDialect WHERE ecm:ancestorId='" + language.getId()
            + "'").size());
  }

  @Test(expected = DocumentSecurityException.class)
  public void notAccessibleByRecorders() throws OperationException {
    params = new HashMap<>();
    params.put("randomize", "true");

    setUser(recorder);
    OperationContext ctx = new OperationContext(userSession);
    automationService.run(ctx, GenerateDialect.ID, params);
  }

  @Test(expected = DocumentSecurityException.class)
  public void notAccessibleByRecordersWithApproval() throws OperationException {
    params = new HashMap<>();
    params.put("randomize", "true");

    setUser(recorderWithApproval);
    OperationContext ctx = new OperationContext(userSession);
    automationService.run(ctx, GenerateDialect.ID, params);
  }

  @Test(expected = DocumentSecurityException.class)
  public void notAccessibleBylanguageAdmins() throws OperationException {
    params = new HashMap<>();
    params.put("randomize", "true");

    setUser(languageAdmin);
    OperationContext ctx = new OperationContext(userSession);
    automationService.run(ctx, GenerateDialect.ID, params);
  }

}
