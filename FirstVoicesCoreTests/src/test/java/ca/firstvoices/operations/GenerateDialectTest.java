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

    //Check that dialect exists
    Assert.assertEquals(1, session
        .query("SELECT * FROM FVDialect WHERE ecm:ancestorId='" + language.getId()
            + "'").size());
    Assert.assertTrue(
        session.exists(new PathRef("/FV/Workspaces/Data/Test/Test/Xx_Dialect_xX")));

    //Check for description
    String s = (String) dialect.getPropertyValue("dc:description");
    Assert.assertEquals("This is a generated test dialect for demo and cypress test purposes.", s);

    //Check for characters
    Assert.assertEquals(26, session
        .query("SELECT * FROM FVCharacter WHERE ecm:ancestorId='" + dialect.getId()
            + "'").size());

    //Check for words and their properties
    DocumentModelList words = session
        .query("SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId()
            + "'");
    Assert.assertEquals(26, words.size());
    for (DocumentModel word : words) {
      String partOfSpeech = (String) word.getPropertyValue("fv-word:part_of_speech");
      String pronunciation = (String) word.getPropertyValue("fv-word:pronunciation");
      Assert.assertNotNull(partOfSpeech);
      Assert.assertNotNull(pronunciation);
    }

    //Check for phrases
    Assert.assertEquals(25, session
        .query("SELECT * FROM FVPhrase WHERE ecm:ancestorId='" + dialect.getId()
            + "'").size());
  }


  @Test
  public void generateRandomDialect() throws OperationException {

    params = new HashMap<>();
    params.put("randomize", "true");
    params.put("maxEntries", "50");

    OperationContext ctx = new OperationContext(session);

    DocumentModel dialect = (DocumentModel) automationService.run(ctx, GenerateDialect.ID, params);

    //Check that dialect exists
    Assert.assertEquals(1, session
        .query("SELECT * FROM FVDialect WHERE ecm:ancestorId='" + language.getId()
            + "'").size());
    //Check for description
    String s = (String) dialect.getPropertyValue("dc:description");
    Assert.assertNotNull(s);

    //Check for characters
    DocumentModelList characters = session
        .query("SELECT * FROM FVCharacter WHERE ecm:ancestorId='" + dialect.getId()
            + "'");
    Assert.assertEquals(30, characters.size());

    //Check for words and their properties
    DocumentModelList words = session
        .query("SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId()
            + "'");
    Assert.assertEquals(25, words.size());
    for (DocumentModel word : words) {
      String partOfSpeech = (String) word.getPropertyValue("fv-word:part_of_speech");
      String pronunciation = (String) word.getPropertyValue("fv-word:pronunciation");
      Assert.assertNotNull(partOfSpeech);
      Assert.assertNotNull(pronunciation);
    }

    //Check for phrases
    Assert.assertEquals(25, session
        .query("SELECT * FROM FVPhrase WHERE ecm:ancestorId='" + dialect.getId()
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
