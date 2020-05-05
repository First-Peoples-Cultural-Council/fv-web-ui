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

/*
 * Contributors:
 *     Kristof Subryan <vtr_monk@mac.com>
 */
package ca.firstvoices.nuxeo.operations;

import ca.firstvoices.nuxeo.utils.EnricherUtils;
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

@Operation(id = DocumentEnrichedQuery.ID, category = Constants.CAT_FETCH, label = "Enriched Query", description = "Returns a query that is transformed, for example - includes a lookup for sub-categories in addition to parent category")
public class DocumentEnrichedQuery {

    public static final String ID = "Document.EnrichedQuery";

    public static final String CATEGORY_CHILDREN_ENRICHMENT = "category_children";

    public static final String CUSTOM_ORDER_ENRICHMENT = "alphabet_starts_with";

    public static final String DESC = "DESC";

    public static final String ASC = "ASC";

    @Context
    protected CoreSession session;

    @Context
    protected AutomationService automationService;

    @Param(name = "enrichment", required = false, description = "Enrichment to perform on query", widget = Constants.W_OPTION, values = {
            CATEGORY_CHILDREN_ENRICHMENT, CUSTOM_ORDER_ENRICHMENT })
    protected String enrichment = "";

    @Param(name = "query", required = true, description = "The query to " + "perform.")
    protected String query;

    @Param(name = "language", required = false, description = "The query language.", widget = Constants.W_OPTION, values = {
            NXQL.NXQL })
    protected String lang = NXQL.NXQL;

    @Param(name = "currentPageIndex", alias = "page", required = false, description = "Target listing page.")
    protected Integer currentPageIndex;

    @Param(name = "pageSize", required = false, description = "Entries number per page.")
    protected Integer pageSize;

    @Param(name = "queryParams", required = false, description = "Ordered query parameters.")
    protected StringList strParameters;

    @Param(name = "sortBy", required = false, description = "Sort by properties (separated by comma)")
    protected StringList sortBy;

    @Param(name = "sortOrder", required = false, description = "Sort order, ASC or DESC", widget = Constants.W_OPTION, values = {
            ASC, DESC })
    protected StringList sortOrder;

    @Param(name = "dialectId", required = false, description = "Id of the target dialect")
    protected String dialectId;

    @Param(name = PageProviderService.NAMED_PARAMETERS, required = false, description = "Named parameters to pass to the page provider to fill in query variables.")
    protected Properties namedParameters;

    protected static final int LIMIT = 1000;

    @OperationMethod
    public DocumentModelList run() throws OperationException {

        switch (enrichment) {
        case CATEGORY_CHILDREN_ENRICHMENT:
            query = EnricherUtils.expandCategoriesToChildren(session, query);
            break;
        }

        PageProviderDefinition def = PageProviderHelper.getPageProviderDefinition("es_nxql_search");
        def.setPattern(query);

        Long targetPage = currentPageIndex != null ? currentPageIndex.longValue() : null;
        Long targetPageSize = pageSize != null ? pageSize.longValue() : null;

        ElasticSearchNxqlPageProvider pp = (ElasticSearchNxqlPageProvider) PageProviderHelper.getPageProvider(session,
                def, namedParameters, sortBy, sortOrder, targetPageSize, targetPage,
                strParameters != null ? strParameters.toArray(new String[0]) : null);

        PaginableDocumentModelListImpl res = new PaginableDocumentModelListImpl(pp);
        if (res.hasError()) {
            throw new OperationException(res.getErrorMessage());
        }
        return res;

    }
}