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
  public void generateEmptyDialects() throws OperationException {

    int expectedDialects = 50;
    params = new HashMap<>();
    params.put("randomize", "true");
    params.put("maxDialects", "" + expectedDialects);
    params.put("maxEntries", "20");

    startFresh(session);
    OperationContext ctx = new OperationContext(session);

    automationService.run(ctx, GenerateDialects.ID, params);

    DocumentModelList generatedDialects = session.query("SELECT * FROM FVDialect");

    Assert.assertEquals(generatedDialects.size(), expectedDialects);
    Assert.assertEquals(0, session.query("SELECT * from FVWord, FVPhrase").size());
  }

}