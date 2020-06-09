package ca.firstvoices.dialect.assets.operations;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import java.util.Arrays;
import java.util.List;
import javax.inject.Inject;
import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import testUtil.AbstractFirstVoicesOperationsTest;

/**
 * @author david
 */
public class GetRelationsForAssetTest extends AbstractFirstVoicesOperationsTest {

  @Inject
  AutomationService automationService;

  @Inject
  FirstVoicesPublisherService publisherService;

  @Test
  public void getRelationsForAsset() throws OperationException {
    String[] words = {"aada gadaalee", "adoḵs", "agwii-gin̓am", "laahitkw", "lag̱am-bax̱",
        "la'oo'a'a",};

    List<DocumentModel> wordDocs = createWordsorPhrases(words, "FVWord");

    String[] propertyValue = new String[]{childCategory.getId()};

    wordDocs.forEach(word -> {
      word.setPropertyValue("fv:related_assets", propertyValue);
      session.saveDocument(word);
    });

    OperationContext ctx = new OperationContext(session);
    ctx.setInput(childCategory);

    DocumentModelList assets = (DocumentModelList) automationService
        .run(ctx, GetRelationsForAsset.ID);
    Assert.assertEquals(wordDocs.size(), assets.size());
    wordDocs.forEach(word -> Assert.assertTrue(assets.contains(word)));
  }

  @Test
  public void getProxiedRelationsForAsset() throws OperationException {
    String[] words = {"1", "2", "3", "4", "5", "6"};

    List<DocumentModel> wordDocs = createWordsorPhrases(words, "FVWord");

    DocumentModel testWord = createWordorPhrase("test", "FVWord", "fv:reference", "100");

    String[] propertyValue = new String[]{testWord.getId()};

    publisherService.publishDialect(dialect);
    DocumentModel publishedTestWord = publisherService.publishAsset(testWord);
    session.saveDocument(publishedTestWord);

    wordDocs.forEach(word -> {
      word.setPropertyValue("fv:related_assets", propertyValue);
      session.saveDocument(word);
      DocumentModel publishedWord = publisherService.publishAsset(word);
      String[] wordProp = (String[]) publishedWord
          .getPropertyValue("fvproxy:proxied_related_assets");
      Assert.assertTrue(Arrays.stream(wordProp).anyMatch(w -> w.equals(publishedTestWord.getId())));
    });

    OperationContext ctx = new OperationContext(session);
    ctx.setInput(publishedTestWord);

    DocumentModelList assets = (DocumentModelList) automationService
        .run(ctx, GetRelationsForAsset.ID);
    Assert.assertEquals(wordDocs.size(), assets.size());
    wordDocs.forEach(word -> Assert.assertTrue(assets.contains(word)));
    assets.forEach(as -> Assert.assertTrue(as.isProxy()));
  }
}