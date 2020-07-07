package ca.firstvoices.operations;

import ca.firstvoices.testUtil.AbstractFirstVoicesCoreTestsTest;
import ca.firstvoices.tests.mocks.operations.GenerateDialects;
import java.util.HashMap;
import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModelList;

/**
 * @author bronson
 */

public class GenerateDialectsTest extends AbstractFirstVoicesCoreTestsTest {

  @Test
  public void generateDemoDialects() throws OperationException {

    int expectedDialects = 10;
    params = new HashMap<>();
    params.put("randomize", "false");
    params.put("maxDialects", "" + expectedDialects);
    params.put("maxEntries", "20");

    OperationContext ctx = new OperationContext(session);

    automationService.run(ctx, GenerateDialects.ID, params);

    DocumentModelList generatedDialects = session
        .query("SELECT * FROM FVDialect WHERE ecm:ancestorId='" + language.getId()
            + "'");
    Assert.assertEquals(generatedDialects.size(), expectedDialects);
    Assert.assertEquals(26 * expectedDialects, session.query("SELECT * from FVCharacter").size());
  }

  @Test
  public void generateRandomDialects() throws OperationException {

    int expectedDialects = 25;
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

    Assert.assertEquals(30 * expectedDialects, session.query("SELECT * from FVCharacter").size());
  }

}