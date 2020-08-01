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

package ca.firstvoices;

import static ca.firstvoices.schemas.DialectTypesConstants.FV_CHARACTER;
import static org.junit.Assert.assertEquals;

import ca.firstvoices.nativeorder.services.NativeOrderComputeService;
import ca.firstvoices.nativeorder.services.NativeOrderComputeServiceImpl;
import ca.firstvoices.nuxeo.operations.DocumentEnrichedQuery;
import ca.firstvoices.nuxeo.utils.EnricherUtils;
import ca.firstvoices.testUtil.AbstractFirstVoicesEnricherTest;
import java.util.HashMap;
import java.util.Map;
import javax.inject.Inject;
import org.junit.Ignore;
import org.junit.Test;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

public class EnricherUtilsTest extends AbstractFirstVoicesEnricherTest {

  @Inject
  private AutomationService automationService;

  @Test
  public void shouldExpandCategoriesToChildren() {

    String categoryQuery =
        "SELECT * FROM FVWord WHERE " + "fv-word:categories/* IN (\"" + category.getId() + "\")";

    String modifiedQuery = EnricherUtils.expandCategoriesToChildren(session, categoryQuery);

    String queryWithCategoriesAndChildren =
        "SELECT * FROM FVWord WHERE " + "fv-word:categories/* IN (\"" + category.getId() + "\",\""
            + subcategory.getId() + "\")";

    assertEquals(modifiedQuery, queryWithCategoriesAndChildren);
  }

  @Test
  public void wordHasCategory() {
    String[] categories = (String[]) word.getPropertyValue("fv-word:categories");
    assertEquals(subcategory.getId(), categories[0]);
  }

  /**
   * TODO Fix test. Does it fail due to elastic search not indexing the word fast enough? Calling
   * operation directly works.
   *
   * @throws OperationException
   */
  @Test
  @Ignore
  public void shouldReturnWordFromSubCategory() throws OperationException {

    String categoryQuery =
        "SELECT * FROM FVWord WHERE " + "fv-word:categories/* IN (\"" + category.getId() + "\")";

    OperationContext ctx = new OperationContext(session);
    Map<String, Object> params = new HashMap<>();

    params.put("query", categoryQuery);
    params.put("currentPageIndex", 0);
    params.put("pageSize", 10);
    params.put("enrichment", "category_children");

    DocumentModelList docs = (DocumentModelList) automationService
        .run(ctx, DocumentEnrichedQuery.ID, params);
    assertEquals(1, docs.size());
  }

  @Test
  public void testLettertoCustomOrder() {
    String[] letterArray = {"a", "aa", "ae", "b", "c", "d", "e", "'"};
    int[] wordOrder = {1, 3, 5, 8, 58, 61, 1, 91};
    int customOrderBase = NativeOrderComputeServiceImpl.BASE;

    for (int i = 0; i < letterArray.length; i++) {
      DocumentModel letterDoc = session
          .createDocumentModel(dialectDoc.getPathAsString() + "/Alphabet", letterArray[i],
              FV_CHARACTER);
      letterDoc.setPropertyValue("fvcharacter:alphabet_order", wordOrder[i]);
      letterDoc.setPropertyValue("fva:dialect", dialectDoc.getId());
      createDocument(session, letterDoc);
      session.save();
    }

    NativeOrderComputeService service = new NativeOrderComputeServiceImpl();
    service.computeDialectNativeOrderTranslation(session, dialectDoc, alphabetDoc);

    for (int i = 0; i < letterArray.length; i++) {
      String customOrder = EnricherUtils
          .convertLetterToCustomOrder(session, dialectDoc.getId(), letterArray[i]);
      String calculatedOrder = "" + (char) (customOrderBase + wordOrder[i]);
      assertEquals(calculatedOrder, customOrder);
    }
  }

  @Test
  public void testLetterNoCustomOrder() {
    String[] letterArray = {"a", "aa", "ae", "b", "c", "d", "e", "'"};

    for (int i = 0; i < letterArray.length; i++) {
      DocumentModel letterDoc = session
          .createDocumentModel(dialectDoc.getPathAsString() + "/Alphabet", letterArray[i],
              FV_CHARACTER);
      letterDoc.setPropertyValue("fva:dialect", dialectDoc.getId());
      createDocument(session, letterDoc);
      session.save();
    }

    NativeOrderComputeService service = new NativeOrderComputeServiceImpl();
    service.computeDialectNativeOrderTranslation(session, dialectDoc, alphabetDoc);

    for (int i = 0; i < letterArray.length; i++) {
      String customOrder = EnricherUtils
          .convertLetterToCustomOrder(session, dialectDoc.getId(), letterArray[i]);
      String calculatedOrder = "~" + letterArray[i];
      assertEquals(calculatedOrder, customOrder);
    }
  }
}
