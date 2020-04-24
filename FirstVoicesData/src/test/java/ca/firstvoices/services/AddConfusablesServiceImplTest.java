package ca.firstvoices.services;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import org.junit.Test;
import org.nuxeo.ecm.core.api.DocumentModel;

//@Deploy("FirstVoicesData.Test:OSGI-INF/fv-add-confusables-test-data.xml")
//@Deploy("FirstVoicesData:OSGI-INF/services/ca.firstvoices.services.addconfusablesservice.xml")
public class AddConfusablesServiceImplTest extends AbstractFirstVoicesDataTest {

  @Test
  public void addConfusablesTest() {
    String[] expected = {"￠", "ȼ"};

    DocumentModel dialect = getCurrentDialect();
    assertNotNull("Dialect cannot be null", dialect);
    String path = dialect.getPathAsString();

    DocumentModel testConfusable = createDocument(session, session.createDocumentModel(path, "TestChar", "FVCharacter"));
    testConfusable.setPropertyValue("dc:title", "¢");
    session.saveDocument(testConfusable);

    addConfusablesService.addConfusables(session, dialect);

    assertEquals(expected, testConfusable.getPropertyValue("fvcharacter:confusable_characters"));

    DocumentModel testConfusableUppercase = createDocument(session, session.createDocumentModel(path, "TestChar", "FVCharacter"));
    testConfusableUppercase.setPropertyValue("fvcharacter:upper_case_character", "¢");
    session.saveDocument(testConfusableUppercase);

    addConfusablesService.addConfusables(session, dialect);

    assertEquals(expected, testConfusableUppercase.getPropertyValue("fvcharacter:upper_case_confusable_characters"));
  }

}
