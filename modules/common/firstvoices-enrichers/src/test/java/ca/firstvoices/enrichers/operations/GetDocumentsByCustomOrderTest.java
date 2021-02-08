/*
 *
 *  *
 *  * Copyright 2020 First People's Cultural Council
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  * /
 *
 */

package ca.firstvoices.enrichers.operations;

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CHARACTER;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;
import static ca.firstvoices.testUtil.helpers.DocumentTestHelpers.createDocument;

import ca.firstvoices.characters.services.CustomOrderComputeService;
import ca.firstvoices.runner.FirstVoicesCoreTestsFeature;
import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.inject.Inject;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

/**
 * @author david
 */
@RunWith(FeaturesRunner.class)
@Features({FirstVoicesCoreTestsFeature.class})
@Deploy({
    "FirstVoicesNuxeo:OSGI-INF/extensions/ca.firstvoices.enrichers.operations.xml",
    "FirstVoicesNuxeo:OSGI-INF/extensions/ca.firstvoices.pageproviders.xml",
    "FirstVoicesNuxeo:OSGI-INF/extensions/ca.firstvoices.nuxeo.enrichers.xml",
    "FirstVoicesCharacters:OSGI-INF/services/charactersCore-contrib.xml",
    "FirstVoicesCharacters:OSGI-INF/services/customOrderCompute-contrib.xml"
})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
public class GetDocumentsByCustomOrderTest extends AbstractFirstVoicesDataTest {

  private Map<String, String> params;

  private static final String[] orderedWords =
      {"aada gadaalee", "adoḵs", "agwii-gin̓am", "laahitkw", "lag̱am-bax̱", "la'oo'a'a"};

  @Inject
  private CustomOrderComputeService cos;

  @Before
  public void setup() {
    String[] letterArray = {"a", "aa", "ae", "b", "c", "d", "e", "'"};
    int[] wordOrder = {1, 3, 5, 8, 58, 61, 1, 91};

    for (int i = 0; i < letterArray.length; i++) {
      DocumentModel letterDoc = session.createDocumentModel(dialect.getPathAsString() + "/Alphabet",
          letterArray[i],
          FV_CHARACTER);
      letterDoc.setPropertyValue("fvcharacter:alphabet_order", wordOrder[i]);
      letterDoc.setPropertyValue("fva:dialect", dialect.getId());
      createDocument(session, letterDoc);
      session.save();
    }

    String query = "SELECT * FROM FVWord WHERE ecm:parentId = '" + dictionary.getRef()
        + "' AND ecm:isVersion = 0 AND ecm:isTrashed = 0 ";

    params = new HashMap<>();
    params.put("query", query);
    params.put("dialectId", dialect.getId());
    params.put("letter", "a");

    session.save();
  }

  @Test
  public void getDocumentsByCustomOrderOperationTest() throws OperationException {
    // Ensure alphabet is calculated
    cos.updateCustomOrderCharacters(session, alphabet);

    // Create words and compute custom order
    createWordsorPhrases(orderedWords, FV_WORD, true);

    session.save();

    OperationContext ctx = new OperationContext(session);

    DocumentModelList documentModelList =
        (DocumentModelList) automationService.run(ctx, GetDocumentsByCustomOrder.ID, params);

    List<String> aWords = Arrays.asList("adoḵs", "agwii-gin̓am");

    Assert.assertEquals(2, documentModelList.size());
    documentModelList.forEach(doc -> Assert.assertTrue(aWords.contains(doc.getPropertyValue(
        "dc:title"))));
  }

  @Test
  public void getDocumentsByCustomOrderWithoutComputedWordsTest() throws OperationException {
    // Clear dictionary
    session.removeChildren(dictionary.getRef());

    createWordsorPhrases(orderedWords, FV_WORD, false);

    OperationContext ctx = new OperationContext(session);
    DocumentModelList documentModelList =
        (DocumentModelList) automationService.run(ctx, GetDocumentsByCustomOrder.ID, params);

    // Since the custom order isn't recomputed on the archive, it's expected it will have "aa"
    // in the list.
    List<String> aWords = Arrays.asList("aada gadaalee", "adoḵs", "agwii-gin̓am");

    Assert.assertEquals(3, documentModelList.size());
    documentModelList.forEach(doc -> Assert.assertTrue(aWords.contains(doc.getPropertyValue(
        "dc:title"))));
  }


  protected DocumentModel createWordorPhrase(String value, String typeName, String pv, String v) {
    DocumentModel document =
        session.createDocumentModel(dictionary.getPathAsString(), value, typeName);
    if (pv != null) {
      document.setPropertyValue(pv, v);
    }

    document.setPropertyValue("fva:dialect", dialect.getId());

    document = createDocument(session, document);

    return document;
  }

  protected void createWordsorPhrases(String[] orderedValues,
                                      String typeName,
                                      boolean computeOrder) {
    Integer i = 0;
    for (String value : orderedValues) {
      DocumentModel createdDoc =
          createWordorPhrase(value, typeName, "fv:reference", String.valueOf(i));

      if (computeOrder) {
        cos.computeAssetNativeOrderTranslation(session, createdDoc, true, false);
      }

      i++;
    }

    session.save();
  }

}
