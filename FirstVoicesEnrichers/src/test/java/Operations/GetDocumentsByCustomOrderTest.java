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

package Operations;

import ca.firstvoices.nativeorder.services.NativeOrderComputeServiceImpl;
import ca.firstvoices.nuxeo.operations.GetDocumentsByCustomOrder;
import ca.firstvoices.testUtil.AbstractFirstVoicesEnricherTest;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

/**
 * @author david
 */
public class GetDocumentsByCustomOrderTest extends AbstractFirstVoicesEnricherTest {

  private Map<String, String> params;


  @Before
  public void setup() {
    super.setUp();

    String[] letterArray = {"a", "aa", "ae", "b", "c", "d", "e", "'"};
    int[] wordOrder = {1, 3, 5, 8, 58, 61, 1, 91};

    for (int i = 0; i < letterArray.length; i++) {
      DocumentModel letterDoc = session
          .createDocumentModel(dialectDoc.getPathAsString() + "/Alphabet", letterArray[i],
              "FVCharacter");
      letterDoc.setPropertyValue("fvcharacter:alphabet_order", wordOrder[i]);
      letterDoc.setPropertyValue("fva:dialect", dialectDoc.getId());
      createDocument(session, letterDoc);
      session.save();
    }

    String[] orderedWords = {"aada gadaalee", "adoḵs", "agwii-gin̓am", "laahitkw", "lag̱am-bax̱",
        "la'oo'a'a"};

    createWordsorPhrases(orderedWords, "FVWord");

    String query = "SELECT * FROM FVWord WHERE ecm:parentId = '" + dictionaryDoc.getRef()
        + "' AND ecm:isVersion = 0 AND ecm:isTrashed = 0 ";

    params = new HashMap<>();
    params.put("query", query);
    params.put("dialectId", dialectDoc.getId());
    params.put("letter", "a");
  }

  @Test
  public void GetDocumentsByCustomOrderTest() throws OperationException {
    NativeOrderComputeServiceImpl nativeOrderComputeService = new NativeOrderComputeServiceImpl();
    nativeOrderComputeService.computeDialectNativeOrderTranslation(dialectDoc);
    OperationContext ctx = new OperationContext(session);

    DocumentModelList documentModelList = (DocumentModelList) automationService
        .run(ctx, GetDocumentsByCustomOrder.ID, params);

    List<String> aWords = Arrays.asList("adoḵs", "agwii-gin̓am");

    Assert.assertTrue(documentModelList.size() == 2);
    documentModelList.forEach(doc -> {
      Assert.assertTrue(aWords.contains(doc.getPropertyValue("dc:title")));
    });

  }

  @Test
  public void GetDocumentsByCustomOrderWithoutComptuedWordsTest() throws OperationException {
    OperationContext ctx = new OperationContext(session);
    DocumentModelList documentModelList = (DocumentModelList) automationService
        .run(ctx, GetDocumentsByCustomOrder.ID, params);

    Assert.assertTrue(documentModelList.size() == 0);

    DocumentModel documentModel = session.getDocument(alphabetDoc.getRef());

    Assert.assertTrue(
        documentModel.getPropertyValue("fv-alphabet:update_confusables_required").equals(true));

  }

}
