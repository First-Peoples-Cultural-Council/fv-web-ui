package ca.firstvoices.maintenance.dialect;

import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import org.junit.Ignore;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.NuxeoException;

/**
 * @author david
 */
public class AddConfusablesOperationTest extends AbstractFirstVoicesDataTest {

  @Ignore
  @Test
  public void callingOperationSetsPropertyOnAlphabet() throws OperationException {
//    OperationContext ctx = new OperationContext(session);
//    ctx.setInput(dialect);
//
//    automationService.run(ctx, AddConfusablesOperation.ID);
//
//    DocumentModel alphabetModel = session.getDocument(alphabet.getRef());
//
//    Assert.assertTrue(
//        (Boolean) alphabetModel.getPropertyValue("fv-alphabet:update_confusables_required"));
  }

  @Ignore
  @Test(expected = NuxeoException.class)
  public void addConfusablesOperationOnlyAcceptsFVDialect() throws OperationException {
//
//    OperationContext ctx = new OperationContext(session);
//    ctx.setInput(childCategory);
//
//    automationService.run(ctx, AddConfusablesOperation.ID);

  }

}
