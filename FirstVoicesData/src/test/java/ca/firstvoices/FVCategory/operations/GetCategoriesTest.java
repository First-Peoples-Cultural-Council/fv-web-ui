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

package ca.firstvoices.FVCategory.operations;

import ca.firstvoices.exceptions.FVCategoryInvalidException;
import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import org.apache.logging.log4j.core.util.Assert;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModelList;

/**
 * @author david
 */

public class GetCategoriesTest extends AbstractFirstVoicesDataTest {

  @Test
  public void GetCategoriesForDialectTest() throws OperationException {
    OperationContext ctx = new OperationContext(session);
    ctx.setInput(dialect);

    //    Add some logic for a test setup here....

    DocumentModelList categories = (DocumentModelList) automationService.run(ctx, GetCategories.ID);

    //  Do some assertions based on the results of the test.

    Assert.isNonEmpty(categories);
    org.junit.Assert.assertTrue(categories.size() == 3);
    categories.forEach(c -> {
      org.junit.Assert.assertNotNull(c.getPropertyValue("dc:title"));
    });

  }

  @Test(expected = FVCategoryInvalidException.class)
  public void GetCategoriesForDialectIsNotADialectTest() throws OperationException {
    OperationContext ctx = new OperationContext(session);
    ctx.setInput(dictionary);
    automationService.run(ctx, GetCategories.ID);
  }

}
