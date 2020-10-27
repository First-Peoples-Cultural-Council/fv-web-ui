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

package ca.firstvoices.enrichers;

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CHARACTER;
import static ca.firstvoices.testUtil.helpers.DocumentTestHelpers.createDocument;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import ca.firstvoices.characters.services.CustomOrderComputeService;
import ca.firstvoices.characters.services.CustomOrderComputeServiceImpl;
import ca.firstvoices.nuxeo.operations.DocumentEnrichedQuery;
import ca.firstvoices.nuxeo.utils.EnricherUtils;
import ca.firstvoices.runner.FirstVoicesCoreTestsFeature;
import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import java.util.HashMap;
import java.util.Map;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Deploys;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({FirstVoicesCoreTestsFeature.class})
@Deploys(@Deploy("FirstVoicesCharacters:OSGI-INF/services/customOrderCompute-contrib.xml"))
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
public class EnricherUtilsTest extends AbstractFirstVoicesDataTest {

  @Inject private AutomationService automationService;

  private DocumentModel category;
  private DocumentModel subcategory;
  private DocumentModel word;

  @Before
  public void setup() {
    word = dataCreator.getReference(session, "testWord1");
    category = dataCreator.getReference(session, "testCategory");
    subcategory = dataCreator.getReference(session, "testSubcategory");
  }

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
  @Ignore("Fix test. Need to adjust TestDataCreator to be able to load a subcategory for FVWord")
  public void wordHasCategory() {
    String[] categories = (String[]) word.getPropertyValue("fv-word:categories");
    assertTrue("At least one category exists for this word", categories.length > 0);
  }

  @Test
  @Ignore("Fix test. Does it fail due to elastic search not indexing the word fast enough? Calling "
      + "operation directly works.")
  public void shouldReturnWordFromSubCategory() throws OperationException {

    String categoryQuery =
        "SELECT * FROM FVWord WHERE " + "fv-word:categories/* IN (\"" + category.getId() + "\")";

    OperationContext ctx = new OperationContext(session);
    Map<String, Object> params = new HashMap<>();

    params.put("query", categoryQuery);
    params.put("currentPageIndex", 0);
    params.put("pageSize", 10);
    params.put("enrichment", "category_children");

    DocumentModelList docs =
        (DocumentModelList) automationService.run(ctx, DocumentEnrichedQuery.ID, params);
    assertEquals(1, docs.size());
  }

  @Test
  public void testLettertoCustomOrder() {
    String[] letterArray = {"a", "aa", "ae", "b", "c", "d", "e", "'"};
    int[] wordOrder = {1, 3, 5, 8, 58, 61, 1, 91};
    int customOrderBase = CustomOrderComputeServiceImpl.BASE;

    DocumentModelList allChars = new DocumentModelListImpl();

    for (int i = 0; i < letterArray.length; i++) {
      DocumentModel letterDoc = session.createDocumentModel(dialect.getPathAsString() + "/Alphabet",
          letterArray[i],
          FV_CHARACTER);
      letterDoc.setPropertyValue("fvcharacter:alphabet_order", wordOrder[i]);
      letterDoc.setPropertyValue("fva:dialect", dialect.getId());
      allChars.add(createDocument(session, letterDoc));
      session.save();
    }

    CustomOrderComputeService customOrderComputeService =
        Framework.getService(CustomOrderComputeService.class);
    customOrderComputeService.updateCustomOrderCharacters(session, allChars);

    for (int i = 0; i < letterArray.length; i++) {
      String customOrder =
          EnricherUtils.convertLetterToCustomOrder(session, dialect.getId(), letterArray[i]);
      String calculatedOrder = "" + (char) (customOrderBase + wordOrder[i]);
      assertEquals(calculatedOrder, customOrder);
    }
  }

  @Test
  public void testLetterNoCustomOrder() {
    String[] letterArray = {"a", "aa", "ae", "b", "c", "d", "e", "'"};

    DocumentModelList allChars = new DocumentModelListImpl();

    for (int i = 0; i < letterArray.length; i++) {
      DocumentModel letterDoc = session.createDocumentModel(dialect.getPathAsString() + "/Alphabet",
          letterArray[i],
          FV_CHARACTER);
      letterDoc.setPropertyValue("fva:dialect", dialect.getId());
      allChars.add(createDocument(session, letterDoc));
      session.save();
    }

    CustomOrderComputeService customOrderComputeService =
        Framework.getService(CustomOrderComputeService.class);
    customOrderComputeService.updateCustomOrderCharacters(session, allChars);

    for (int i = 0; i < letterArray.length; i++) {
      String customOrder =
          EnricherUtils.convertLetterToCustomOrder(session, dialect.getId(), letterArray[i]);
      String calculatedOrder = "~" + letterArray[i];
      assertEquals(calculatedOrder, customOrder);
    }
  }
}
