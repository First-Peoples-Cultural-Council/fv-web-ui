package ca.firstvoices.dialect.assets.services;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import java.util.Arrays;
import java.util.List;
import javax.inject.Inject;
import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import testUtil.AbstractFirstVoicesOperationsTest;

/**
 * @author david
 */
public class RelationsServiceTest extends AbstractFirstVoicesOperationsTest {

  @Inject
  FirstVoicesPublisherService publisherService;

  @Inject
  RelationsService relationsService;

  @Test
  public void testGetRelations() {

    String[] words = {"aada gadaalee", "adoḵs", "agwii-gin̓am", "laahitkw", "lag̱am-bax̱",
        "la'oo'a'a",};

    createWordsorPhrases(words, "FVWord");

    DocumentModelList wordDocs = session.query(
        "SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId() + "' " + "ORDER BY "
            + "fv:custom_order DESC");

    String[] propertyValue = new String[]{childCategory.getId()};

    wordDocs.forEach(word -> {
      word.setPropertyValue("fv:related_assets", propertyValue);
      session.saveDocument(word);
    });

    DocumentModelList assets = relationsService.getRelations(session, childCategory);

    Assert.assertEquals(wordDocs.size(), assets.size());
    wordDocs.forEach(word -> Assert.assertTrue(assets.contains(word)));
  }

  @Test
  public void testGetRelationsByType() {

    String[] words = {"aada gadaalee", "adoḵs", "agwii-gin̓am", "laahitkw", "lag̱am-bax̱",
        "la'oo'a'a",};

    createWordsorPhrases(words, "FVWord");

    DocumentModelList wordDocs = session.query(
        "SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId() + "' " + "ORDER BY "
            + "fv:custom_order DESC");

    String[] propertyValue = new String[]{childCategory.getId()};

    wordDocs.forEach(word -> {
      word.setPropertyValue("fv:related_assets", propertyValue);
      session.saveDocument(word);
    });

    DocumentModelList assets = relationsService.getRelations(session, childCategory, "FVWord");

    Assert.assertEquals(wordDocs.size(), assets.size());
    wordDocs.forEach(word -> Assert.assertTrue(assets.contains(word)));
  }

  // This unit test is always returning one less document than expected and is failing.
  @Test
  @Ignore
  public void getProxiedRelationsForAsset() throws OperationException {
    String[] words = {"A", "B", "C", "D", "E", "F"};

    List<DocumentModel> wordDocs = createWordsorPhrases(words, "FVWord");

    DocumentModel testWord = createWordorPhrase("test", "FVWord", "fv:reference", "100");

    String[] propertyValue = new String[]{testWord.getId()};

    publisherService.publishDialect(dialect);
    DocumentModel publishedTestWord = publisherService.publishAsset(testWord);

    for (DocumentModel wordDoc : wordDocs) {
      wordDoc.setPropertyValue("fv:related_assets", propertyValue);
      session.saveDocument(wordDoc);
      DocumentModel publishedWord = publisherService.publishAsset(wordDoc);
      String[] wordProp = (String[]) publishedWord
          .getPropertyValue("fvproxy:proxied_related_assets");
      Assert.assertTrue(Arrays.stream(wordProp).anyMatch(w -> w.equals(publishedTestWord.getId())));
    }

    DocumentModelList assets = relationsService.getRelations(session, publishedTestWord);
    Assert.assertEquals(1, assets.totalSize());
    wordDocs.forEach(word -> Assert.assertTrue(assets.contains(word)));
    assets.forEach(as -> Assert.assertTrue(as.isProxy()));
  }

}
