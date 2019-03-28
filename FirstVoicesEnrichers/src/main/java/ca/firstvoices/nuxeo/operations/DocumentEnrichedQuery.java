/*
 * Contributors:
 *     Kristof Subryan <vtr_monk@mac.com>
 */
package ca.firstvoices.nuxeo.operations;

import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.IterableQueryResult;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.elasticsearch.api.ElasticSearchService;
import org.nuxeo.elasticsearch.api.EsIterableQueryResultImpl;
import org.nuxeo.elasticsearch.query.NxQueryBuilder;
import org.nuxeo.runtime.api.Framework;

import ca.firstvoices.nuxeo.utils.EnricherUtils;

@Operation(id = DocumentEnrichedQuery.ID, category = Constants.CAT_FETCH, label = "Enriched Query", description = "Returns a query that is transformed, for example - includes a lookup for sub-categories in addition to parent category")
public class DocumentEnrichedQuery {

    public static final String ID = "Document.EnrichedQuery";

    public static final String CATEGORY_CHILDREN_ENRICHMENT = "category_children";

    public static final String DESC = "DESC";

    public static final String ASC = "ASC";

    @Context
    protected CoreSession session;

    @Context
    protected AutomationService automationService;

    @Param(name = "enrichment", required = false, description = "Enrichment to perform on query", widget = Constants.W_OPTION, values = {
            CATEGORY_CHILDREN_ENRICHMENT })
    protected String enrichment = "";

    @Param(name = "query", required = true, description = "The query to " + "perform.")
    protected String query;

    @Param(name = "language", required = false, description = "The query "
            + "language.", widget = Constants.W_OPTION, values = { NXQL.NXQL })
    protected String language = NXQL.NXQL;

    protected static final int LIMIT = 1000;

    @OperationMethod
    public DocumentModelList run() throws OperationException {

        switch (enrichment) {
        case CATEGORY_CHILDREN_ENRICHMENT:
            query = EnricherUtils.expandCategoriesToChildren(session, query);
            break;
        }

        DocumentModelList docs = new DocumentModelListImpl();

        ElasticSearchService ess = Framework.getService(ElasticSearchService.class);
        if (ess == null) {
            return docs;
        }

        NxQueryBuilder nxEsDocs = new NxQueryBuilder(session).nxql(query).limit(LIMIT).onlyElasticsearchResponse();

        try (IterableQueryResult iqr = new EsIterableQueryResultImpl(ess, ess.scroll(nxEsDocs, LIMIT))) {
            iqr.forEach(res -> {
                String docRef = res.get(NXQL.ECM_UUID).toString();
                docs.add(session.getDocument(new IdRef(docRef)));
            });
        }
        return docs;
    }
}