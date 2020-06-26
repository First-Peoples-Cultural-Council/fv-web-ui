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
import org.nuxeo.ecm.core.api.PathRef;

/**
 * @author bronson
 */

public class GenerateDialectTest extends AbstractFirstVoicesCoreTestsTest {

  @Test
  public void generateEmptyDemoDialect() throws OperationException {

    params = new HashMap<>();
    params.put("randomize", "false");
    params.put("maxEntries", "50");
    params.put("dialectName", "Xx_Dialect_xX");

    OperationContext ctx = new OperationContext(session);

    DocumentModel dialect = (DocumentModel) automationService.run(ctx, GenerateDialect.ID, params);

    Assert.assertTrue(
        session.exists(new PathRef("/FV/Workspaces/Data/Test/Test/Xx_Dialect_xX")));
    Assert.assertEquals(0, session.query("SELECT * from FVWord, FVPhrase").size());
  }

  @Test
  public void generateEmptyRandomDialect() throws OperationException {

    params = new HashMap<>();
    params.put("randomize", "true");
    params.put("maxEntries", "50");

    OperationContext ctx = new OperationContext(session);

    DocumentModel dialect = (DocumentModel) automationService.run(ctx, GenerateDialect.ID, params);

    String s = (String) dialect.getPropertyValue("dc:description");
    Assert.assertNotNull(s);

    DocumentModelList test = session.query("SELECT * from FVCharacter");

    Assert.assertEquals(30, test.size());
    Assert.assertEquals(1, session.query("SELECT * from FVDialect").size());
  }

}
