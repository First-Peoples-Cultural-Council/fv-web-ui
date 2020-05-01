package ca.firstvoices.operations;

import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;

/**
 * @author david
 */
public class AddConsuablesOperationTest extends AbstractFirstVoicesDataTest {

  @Test
  public void callingOperationSetsPropertyOnAlphabet() throws OperationException {
    OperationContext ctx = new OperationContext(session);
    ctx.setInput(dialect);

    automationService.run(ctx, AddConfusablesOperation.ID);

    DocumentModel alphabetModel = session.getDocument(alphabet.getRef());

    Assert.assertTrue(
        (Boolean) alphabetModel.getPropertyValue("fv-alphabet:update_confusables_required"));
  }

}
