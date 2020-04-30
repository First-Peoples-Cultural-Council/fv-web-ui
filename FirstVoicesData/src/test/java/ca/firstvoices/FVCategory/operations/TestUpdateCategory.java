package ca.firstvoices.FVCategory.operations;

import static org.junit.Assert.assertEquals;

import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import java.util.HashMap;
import java.util.Map;
import javax.inject.Inject;
import org.junit.Test;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;

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

    @Test(expected = NuxeoException.class)
    public void updateCategoryOperationOnlyAcceptsFVCategory() throws OperationException {

        OperationContext ctx = new OperationContext(session);
        ctx.setInput(dialect);
        Map<String, Object> params = new HashMap<>();

        automationService.run(ctx, UpdateCategory.ID, params);

    }
}
