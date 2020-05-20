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

package ca.firstvoices.dialect.categories.operations;

import static org.junit.Assert.assertEquals;

import ca.firstvoices.dialect.categories.exceptions.InvalidCategoryException;
import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import java.util.HashMap;
import java.util.Map;
import javax.inject.Inject;
import org.junit.Test;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;

public class TestUpdateCategory extends AbstractFirstVoicesDataTest {

  @Inject
  protected AutomationService automationService;

  @Test
  public void updateCategory() throws OperationException {

    Map<String, String> properties = new HashMap<>();
    properties.put("dc:title", "Category Title");
    properties.put("dc:description", "A description of the category without a target.");

    Map<String, Object> params = new HashMap<>();
    params.put("properties", properties);

    OperationContext ctx = new OperationContext(session);
    ctx.setInput(childCategory);

    DocumentModel doc = (DocumentModel) automationService.run(ctx, UpdateCategory.ID, params);
    assertEquals("A description of the category without a target.",
        doc.getPropertyValue("dc:description"));
  }

  @Test
  public void updateCategoryWithParameters() throws OperationException {

    childCategory.setPropertyValue("dc:title", "Category Title");
    childCategory
        .setPropertyValue("dc:description", "A description of the category with a target.");

    Map<String, String> properties = new HashMap<>();
    properties.put("dc:title", "Category Title");
    properties.put("dc:description", "A description of the category without a target.");
    properties.put("ecm:parentRef", parentCategory2.getId());

    Map<String, Object> params = new HashMap<>();
    params.put("properties", properties);

    OperationContext ctx = new OperationContext(session);
    ctx.setInput(childCategory);

    DocumentModel doc = (DocumentModel) automationService.run(ctx, UpdateCategory.ID, params);

    assertEquals(parentCategory2.getPathAsString() + "/Category Title", doc.getPathAsString());
  }

  @Test(expected = InvalidCategoryException.class)
  public void updateCategoryOperationOnlyAcceptsFVCategory() throws OperationException {

    OperationContext ctx = new OperationContext(session);
    ctx.setInput(dialect);
    Map<String, Object> params = new HashMap<>();

    automationService.run(ctx, UpdateCategory.ID, params);

  }

  @Test(expected = InvalidCategoryException.class)
  public void cannotAssignParentToParentCategoryCategoriesPath() throws OperationException {
    childCategory = session
        .move(childCategory.getRef(), new IdRef(parentCategory2.getId()), "Category Title");
    session.saveDocument(childCategory);

    Map<String, String> props = new HashMap<>();
    props.put("dc:title", "Parent Category Title");
    props.put("dc:description", "A description of the parent category.");
    props.put("ecm:parentRef", categories.getPathAsString());

    Map<String, Object> params = new HashMap<>();
    params.put("properties", props);
    OperationContext ctx = new OperationContext(session);

    ctx.setInput(parentCategory2);
    automationService.run(ctx, UpdateCategory.ID, params);
  }

  @Test(expected = InvalidCategoryException.class)
  public void cannotAssignParentToParentCategoryCategoriesId() throws OperationException {
    childCategory = session
        .move(childCategory.getRef(), new IdRef(parentCategory2.getId()), "Category Title");
    session.saveDocument(childCategory);

    Map<String, String> props = new HashMap<>();
    props.put("dc:title", "Parent Category Title");
    props.put("dc:description", "A description of the parent category.");
    props.put("ecm:parentRef", categories.getId());

    Map<String, Object> params = new HashMap<>();
    params.put("properties", props);
    OperationContext ctx = new OperationContext(session);

    ctx.setInput(parentCategory2);
    automationService.run(ctx, UpdateCategory.ID, params);
  }

}
