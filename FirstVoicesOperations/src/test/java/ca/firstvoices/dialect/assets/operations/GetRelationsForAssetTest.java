package ca.firstvoices.dialect.assets.operations;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
  public void getRelationsForAssetWithType() throws OperationException {
    String[] phrases = {"aada gadaalee", "adoḵs", "agwii-gin̓am", "laahitkw", "lag̱am-bax̱",
        "la'oo'a'a",};

    List<DocumentModel> phraseDocs = createWordsorPhrases(phrases, "FVPhrase");
    List<DocumentModel> wordDocs = createWordsorPhrases(phrases, "FVWord");

    String[] propertyValue = new String[]{childCategory.getId()};

    phraseDocs.forEach(phrase -> {
      phrase.setPropertyValue("fv:related_assets", propertyValue);
      session.saveDocument(phrase);
    });

    wordDocs.forEach(phrase -> {
      phrase.setPropertyValue("fv:related_assets", propertyValue);
      session.saveDocument(phrase);
    });

    OperationContext ctx = new OperationContext(session);
    ctx.setInput(childCategory);

    Map<String, String> parameters = new HashMap<>();

    parameters.put("type", "FVWord");

    DocumentModelList assets = (DocumentModelList) automationService
        .run(ctx, GetRelationsForAsset.ID, parameters);
    Assert.assertEquals(phraseDocs.size(), assets.size());
    wordDocs.forEach(word -> Assert.assertTrue(assets.contains(word)));
  }
}