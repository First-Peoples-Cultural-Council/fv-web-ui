package ca.firstvoices.operations;

import ca.firstvoices.testUtil.AbstractFirstVoicesCoreTestsTest;
import ca.firstvoices.tests.mocks.operations.GenerateDialects;
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
    //will refactor to add parameters once populating the dialects is implemented
    startFresh(session);
    OperationContext ctx = new OperationContext(session);

    automationService.run(ctx, GenerateDialects.ID);

    DocumentModelList generatedDialects = session.query("SELECT * FROM FVDialect");

    Assert.assertEquals(10, generatedDialects.size());
  }

}