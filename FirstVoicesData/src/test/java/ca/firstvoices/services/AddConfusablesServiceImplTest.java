package ca.firstvoices.services;

import static org.junit.Assert.assertNotNull;

import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.core.api.DocumentModel;

public class AddConfusablesServiceImplTest extends AbstractFirstVoicesDataTest {

  @Test
  public void addConfusablesTest() {
    String[] confusablesToAdd = {"￠", "ȼ"};

    DocumentModel dialect = getCurrentDialect();
    assertNotNull("Dialect cannot be null", dialect);
    String path = dialect.getPathAsString();

    DocumentModel testConfusable = createDocument(session,
        session.createDocumentModel(path, "TestChar", "FVCharacter"));
    testConfusable.setPropertyValue("dc:title", "¢");
    session.saveDocument(testConfusable);

    DocumentModel updated = session.saveDocument(addConfusablesService
        .updateConfusableCharacters(session, testConfusable, dialect, "¢", confusablesToAdd));

    String[] property = (String[]) updated.getPropertyValue("fvcharacter:confusable_characters");

    Assert.assertTrue(property[0].equals(confusablesToAdd[0]));
    Assert.assertTrue(property[1].equals(confusablesToAdd[1]));

    DocumentModel testConfusableUppercase = createDocument(session,
        session.createDocumentModel(path, "TestChar", "FVCharacter"));
    testConfusableUppercase.setPropertyValue("fvcharacter:upper_case_character", "¢");

    session.saveDocument(testConfusableUppercase);

    updated = session.saveDocument(addConfusablesService
        .updateConfusableCharacters(session, testConfusableUppercase, dialect, "¢", confusablesToAdd));

    String[] uProperty = (String[]) updated
        .getPropertyValue("fvcharacter:upper_case_confusable_characters");

    Assert.assertTrue(uProperty[0].equals(confusablesToAdd[0]));
    Assert.assertTrue(uProperty[1].equals(confusablesToAdd[1]));
  }

}
