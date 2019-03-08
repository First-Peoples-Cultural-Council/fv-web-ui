/*
 * Contributors:
 *     Kristof Subryan <vtr_monk@mac.com>
 */
package ca.firstvoices.nuxeo.operations;


import ca.firstvoices.nuxeo.utils.EnricherUtils;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.util.Properties;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.ecm.platform.query.api.PageProviderService;

import java.util.HashMap;
import java.util.Map;

@Operation(id = DocumentEnrichedQuery.ID, category = Constants.CAT_FETCH, label = "Enriched Query",
        description = "Returns a query that is transformed, for example - includes a lookup for sub-categories in addition to parent category")
public class DocumentEnrichedQuery {

    public static final String ID = "Document.EnrichedQuery";

    public static final String CATEGORY_CHILDREN_ENRICHMENT = "category_children";

    public static final String DESC = "DESC";

    public static final String ASC = "ASC";

    @Context
    protected CoreSession session;

    @Context
    protected AutomationService automationService;

    @Param(name = "enrichment", required = false, description = "Enrichment to perform on query", widget = Constants.W_OPTION, values = {CATEGORY_CHILDREN_ENRICHMENT})
    protected String enrichment = "";

    @Param(name = "query", required = true, description = "The query to " + "perform.")
    protected String query;

    @Param(name = "language", required = false, description = "The query " + "language.", widget = Constants.W_OPTION, values = { NXQL.NXQL })
    protected String language = NXQL.NXQL;

    @Param(name = "currentPageIndex", required = false, description = "Target listing page.")
    protected Integer currentPageIndex;

    @Param(name = "pageSize", required = false, description = "Entries number" + " per page.")
    protected Integer pageSize;

    @Param(name = "queryParams", required = false, description = "Ordered " + "query parameters.")
    protected StringList queryParams;

    @Param(name = "sortBy", required = false, description = "Sort by " + "properties (separated by comma)")
    protected String sortBy;

    @Param(name = "sortOrder", required = false, description = "Sort order, " + "ASC or DESC", widget = Constants.W_OPTION, values = {
            ASC, DESC })
    protected String sortOrder;

    @Param(name = PageProviderService.NAMED_PARAMETERS, required = false, description = "Named parameters to pass to the page provider to "
            + "fill in query variables.")
    protected Properties namedParameters;

    @SuppressWarnings("unchecked")
    @OperationMethod
    public DocumentModelList run() throws OperationException {

        switch (enrichment) {
            case CATEGORY_CHILDREN_ENRICHMENT:
                query = EnricherUtils.expandCategoriesToChildren(session, query);
            break;
        }

        OperationContext ctx = new OperationContext(session);
        Map<String, Object> params = new HashMap<>();

        params.put("query", query);
        params.put("language", language);
        params.put("currentPageIndex", currentPageIndex);
        params.put("pageSize", pageSize);
        params.put("strParameters", queryParams);
        params.put("sortBy", sortBy);
        params.put("sortOrder", sortOrder);
        params.put("namedParameters", namedParameters);

        DocumentModelList dml = (DocumentModelList) automationService.run(ctx, "Repository.Query", params);

        return dml;
    }
}