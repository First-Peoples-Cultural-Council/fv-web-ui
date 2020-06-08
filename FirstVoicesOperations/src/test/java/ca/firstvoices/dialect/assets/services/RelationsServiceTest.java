package ca.firstvoices.dialect.assets.services;

import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.runtime.api.Framework;
import testUtil.AbstractFirstVoicesOperationsTest;

/**
 * @author david
 */
public class RelationsServiceTest extends AbstractFirstVoicesOperationsTest {

  @Test
  public void testGetRelations() {

    RelationsService relationsService = Framework.getService(RelationsService.class);

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

}
