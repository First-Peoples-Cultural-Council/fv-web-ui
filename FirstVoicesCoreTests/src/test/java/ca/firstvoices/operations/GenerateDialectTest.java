package ca.firstvoices.operations;

import ca.firstvoices.testUtil.AbstractFirstVoicesCoreTestsTest;
import ca.firstvoices.tests.mocks.operations.GenerateDialect;
import java.util.ArrayList;
import java.util.HashMap;
import org.apache.commons.lang.ArrayUtils;
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

    //Check for categories / phrase books
    Assert.assertEquals(12, session
        .query("SELECT * FROM FVCategory WHERE ecm:ancestorId='" + dialect.getId()
            + "'").size());

    //Check for words and their properties
    DocumentModelList words = session
        .query("SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId() + "'");
    Assert.assertEquals(26, words.size());
    for (DocumentModel word : words) {
      String partOfSpeech = (String) word.getPropertyValue("fv-word:part_of_speech");
      String pronunciation = (String) word.getPropertyValue("fv-word:pronunciation");
      String[] categories = (String[]) word.getPropertyValue("fv-word:categories");
      Assert.assertNotNull(partOfSpeech);
      Assert.assertNotNull(pronunciation);
      Assert.assertFalse(ArrayUtils.isEmpty(categories));
    }

    //Check for phrases, phrase books set
    DocumentModelList phrases = session
        .query("SELECT * FROM FVPhrase WHERE ecm:ancestorId='" + dialect.getId() + "'");
    Assert.assertEquals(25, phrases.size());
    for (DocumentModel phrase : phrases) {
      String[] phraseBooks = (String[]) phrase.getPropertyValue("fv-phrase:phrase_books");
      Assert.assertFalse(ArrayUtils.isEmpty(phraseBooks));
    }

    //Check for contributors
    DocumentModelList contributors = session
        .query("SELECT * FROM FVContributor WHERE ecm:ancestorId='" + dialect.getId() + "'");
    Assert.assertEquals(1, contributors.size());

    //Check for songs and stories and their properties
    DocumentModelList books = session
        .query("SELECT * FROM FVBook WHERE ecm:ancestorId='" + dialect.getId() + "'");
    Assert.assertEquals(10, books.size());
    for (DocumentModel book : books) {
      String type = (String) book.getPropertyValue("fvbook:type");
      String introduction = (String) book.getPropertyValue("fvbook:introduction");
      String acknowledgement = (String) book.getPropertyValue("fvbook:acknowledgement");
      ArrayList<Object> titleTranslation = (ArrayList<Object>) book.getPropertyValue("fvbook:title_literal_translation");
      ArrayList<Object> introductionTranslation = (ArrayList<Object>) book.getPropertyValue
          ("fvbook:introduction_literal_translation");
      String[] culturalNote = (String[]) book.getPropertyValue("fv:cultural_note");
      String[] bookContributors = (String[]) book.getPropertyValue("dc:contributors");

      Assert.assertNotNull(type);
      Assert.assertNotNull(introduction);
      Assert.assertNotNull(acknowledgement);
      Assert.assertFalse(titleTranslation.isEmpty());
      Assert.assertFalse(introductionTranslation.isEmpty());
      Assert.assertFalse(ArrayUtils.isEmpty(culturalNote));
      Assert.assertFalse(ArrayUtils.isEmpty(bookContributors));
    }
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

    //Check for categories / phrase books
    Assert.assertEquals(12, session
        .query("SELECT * FROM FVCategory WHERE ecm:ancestorId='" + dialect.getId()
            + "'").size());

    //Check for words and their properties
    DocumentModelList words = session
        .query("SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId()
            + "'");
    Assert.assertEquals(25, words.size());
    for (DocumentModel word : words) {
      String partOfSpeech = (String) word.getPropertyValue("fv-word:part_of_speech");
      String pronunciation = (String) word.getPropertyValue("fv-word:pronunciation");
      String[] categories = (String[]) word.getPropertyValue("fv-word:categories");
      Assert.assertNotNull(partOfSpeech);
      Assert.assertNotNull(pronunciation);
      Assert.assertFalse(ArrayUtils.isEmpty(categories));
    }

    //Check for phrases, phrase books set
    DocumentModelList phrases = session
        .query("SELECT * FROM FVPhrase WHERE ecm:ancestorId='" + dialect.getId() + "'");
    Assert.assertEquals(25, phrases.size());
    for (DocumentModel phrase : phrases) {
      String[] phraseBooks = (String[]) phrase.getPropertyValue("fv-phrase:phrase_books");
      Assert.assertFalse(ArrayUtils.isEmpty(phraseBooks));
    }

    //Check for contributors
    DocumentModelList contributors = session
        .query("SELECT * FROM FVContributor WHERE ecm:ancestorId='" + dialect.getId() + "'");
    Assert.assertEquals(1, contributors.size());

    //Check for songs and stories and their properties
    DocumentModelList books = session
        .query("SELECT * FROM FVBook WHERE ecm:ancestorId='" + dialect.getId() + "'");
    Assert.assertEquals(10, books.size());
    for (DocumentModel book : books) {
      String type = (String) book.getPropertyValue("fvbook:type");
      String introduction = (String) book.getPropertyValue("fvbook:introduction");
      String acknowledgement = (String) book.getPropertyValue("fvbook:acknowledgement");
      ArrayList<Object> titleTranslation = (ArrayList<Object>) book.getPropertyValue("fvbook:title_literal_translation");
      ArrayList<Object> introductionTranslation = (ArrayList<Object>) book.getPropertyValue
          ("fvbook:introduction_literal_translation");
      String[] culturalNote = (String[]) book.getPropertyValue("fv:cultural_note");
      String[] bookContributors = (String[]) book.getPropertyValue("dc:contributors");

      Assert.assertNotNull(type);
      Assert.assertNotNull(introduction);
      Assert.assertNotNull(acknowledgement);
      Assert.assertFalse(titleTranslation.isEmpty());
      Assert.assertFalse(introductionTranslation.isEmpty());
      Assert.assertFalse(ArrayUtils.isEmpty(culturalNote));
      Assert.assertFalse(ArrayUtils.isEmpty(bookContributors));
    }
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
