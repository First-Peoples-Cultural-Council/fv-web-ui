package ca.firstvoices.dialect.assets.operations;

import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModelList;
import testUtil.AbstractFirstVoicesOperationsTest;

/**
 * @author david
 */
public class GetRelationsForAssetTest extends AbstractFirstVoicesOperationsTest {


  @Test
  public void getRelationsForAsset() throws OperationException {
    String[] words = {"aada gadaalee", "adoḵs", "agwii-gin̓am", "laahitkw", "lag̱am-bax̱",
        "la'oo'a'a",};

    createWordsorPhrases(words, "FVWord");

    DocumentModelList wordDocs = session.query(
        "SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId() + "' " + "ORDER BY "
            + "fv:custom_order DESC");

    String[] propertyValue = new String[]{ childCategory.getId() };

    wordDocs.forEach(word -> {
      word.setPropertyValue("fv:related_assets", propertyValue);
      session.saveDocument(word);
    });

    OperationContext ctx = new OperationContext(session);
    ctx.setInput(childCategory);

    DocumentModelList assets = (DocumentModelList) automationService.run(ctx, GetRelationsForAsset.ID);

    wordDocs.forEach(word -> {
      Assert.assertTrue(assets.contains(word.getId()));
    });
  }
}
