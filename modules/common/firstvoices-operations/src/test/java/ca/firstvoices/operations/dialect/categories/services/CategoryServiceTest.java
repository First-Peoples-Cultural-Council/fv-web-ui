package ca.firstvoices.operations.dialect.categories.services;

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CATEGORY;

import ca.firstvoices.operations.dialect.categories.exceptions.InvalidCategoryException;
import java.util.HashMap;
import java.util.Map;
import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import testUtil.AbstractFirstVoicesOperationsTest;

/**
 * @author david
 */
public class CategoryServiceTest extends AbstractFirstVoicesOperationsTest {

  @Test
  public void updateCategory() throws OperationException {

    Map<String, String> properties = new HashMap<>();
    properties.put("dc:title", "A Brand New Category Title");
    properties.put("dc:description", "A description of the category without a target.");

    Assert
        .assertNotEquals("A Brand New Category Title", childCategory.getPropertyValue("dc:title"));
    Assert.assertNotEquals("A description of the category without a target.",
        childCategory.getPropertyValue("dc:description"));

    DocumentModel doc = categoryService.updateCategory(childCategory, properties);

    Assert.assertEquals("A Brand New Category Title", doc.getPropertyValue("dc:title"));
    Assert.assertEquals("A description of the category without a target.",
        doc.getPropertyValue("dc:description"));
  }

  @Test(expected = InvalidCategoryException.class)
  public void cannotAssignParentToParentCategoryCategory() throws OperationException {
    DocumentModel newCategory = createDocument(session,
        session.createDocumentModel(categories.getPathAsString(), "New Category", FV_CATEGORY));
    Map<String, String> props = new HashMap<>();
    props.put("dc:title", "Parent Category Title");
    props.put("dc:description", "A description of the parent category.");
    props.put("ecm:parentRef", newCategory.getPathAsString());

    categoryService.updateCategory(parentCategory, props);
  }

  @Test(expected = InvalidCategoryException.class)
  public void updateCategoryOnlyAcceptsFVCategory() throws OperationException {
    categoryService.updateCategory(dialect, new HashMap<>());
  }

  //  TODO: TEST THAT UPDATING AN UNPUBLISHED CATEGORY ON A PUBLISHED DIALECT WILL PUBLISH IT

  //  TODO: TEST THAT UPDATING A CATEGORY ON AN UNPUBLISHED DIALECT WILL NOT PUBLISH IT

  //  TODO: TEST THAT UPDATING A PUBLISHED CATEGORY ON A PUBLISHED DIALECT WILL REPUBLISH IT

}
