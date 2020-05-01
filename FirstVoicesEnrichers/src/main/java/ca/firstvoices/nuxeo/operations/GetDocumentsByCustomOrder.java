/*
 * Contributors:
 *     Kristof Subryan <vtr_monk@mac.com>
 */
package ca.firstvoices.nuxeo.operations;

//import org.hibernate.mapping.Map;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.util.PageProviderHelper;
import org.nuxeo.ecm.automation.core.util.Properties;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.automation.jaxrs.io.documents.PaginableDocumentModelListImpl;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.ecm.platform.query.api.PageProviderDefinition;
import org.nuxeo.ecm.platform.query.api.PageProviderService;
import org.nuxeo.elasticsearch.provider.ElasticSearchNxqlPageProvider;

import org.nuxeo.ecm.automation.OperationContext;
import java.util.*;


import ca.firstvoices.nuxeo.utils.EnricherUtils;

@Operation(id = GetDocumentsByCustomOrder.ID, category = Constants.CAT_FETCH, label = "Custom Order Query", description = "Returns a query that is transformed, for example - includes a lookup for sub-categories in addition to parent category")
public class GetDocumentsByCustomOrder {

    public static final String ID = "Document.CustomOrderQuery";

    public static final String DESC = "DESC";

    public static final String ASC = "ASC";

    @Context
    protected CoreSession session;

    @Context
    protected AutomationService automationService;

    @Param(name = "query", required = true, description = "The query to " + "perform.")
    protected String query;

    @Param(name = "currentPageIndex", alias = "page", required = false, description = "Target listing page.")
    protected Integer currentPageIndex;

    @Param(name = "pageSize", required = false, description = "Entries number per page.")
    protected Integer pageSize;

    @Param(name = "sortBy", required = false, description = "Sort by properties (separated by comma)")
    protected StringList sortBy;

    @Param(name = "sortOrder", required = false, description = "Sort order, ASC or DESC", widget = Constants.W_OPTION, values = {
            ASC, DESC })
    protected StringList sortOrder;

    @Param(name = "dialectId", required = false, description = "Id of the target dialect")
    protected String dialectId;

    @Param(name = "letter", required = false, description = "Desired letter")
    protected String letter;

    protected static final int LIMIT = 1000;

    @OperationMethod
    public DocumentModelList run() throws OperationException {

        String customOrder = "";
        if((dialectId != null && !dialectId.isEmpty()) && (letter != null && !letter.isEmpty())) 
            customOrder = EnricherUtils.convertLetterToCustomOrder(session, dialectId, letter);

        if(customOrder.startsWith("%") || customOrder.startsWith("$") || customOrder.startsWith("&") || 
            customOrder.startsWith("'") || customOrder.startsWith("*") || customOrder.startsWith("_")) {
            query = query +
                " AND fv:custom_order LIKE \"" + NXQL.escapeStringInner("\\") + customOrder + "%\"";
        }else if(customOrder.startsWith("\\")){ 
            query = query + 
                " AND fv:custom_order LIKE \"" + "\\\\\\" + customOrder + "%\"";
        }else{
            query = query +
                " AND fv:custom_order LIKE \"" + customOrder + "%\"";
        }
        OperationContext ctx = new OperationContext(session);
        
        Map<String,Object> params = new HashMap<String,Object>();
        params.put("currentPageIndex",currentPageIndex);
        params.put("query", query);
        params.put("pageSize",pageSize);
        params.put("sortBy", sortBy);
        params.put("sortOrder",sortOrder);

        DocumentModelList res = (DocumentModelList) automationService.run(ctx, "Document.Query", params);
        return res;

    }
}