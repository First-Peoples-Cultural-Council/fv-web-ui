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

package ca.firstvoices.enrichers.operations;

/*
 * Contributors:
 *     Kristof Subryan <vtr_monk@mac.com>
 */

import ca.firstvoices.enrichers.utils.EnricherUtils;
import java.util.logging.Logger;
import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.util.PageProviderHelper;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.automation.jaxrs.io.documents.PaginableDocumentModelListImpl;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.ecm.platform.query.api.PageProvider;
import org.nuxeo.ecm.platform.query.api.PageProviderDefinition;
import org.nuxeo.ecm.platform.query.nxql.NXQLQueryBuilder;

@Operation(id = GetDocumentsByCustomOrder.ID, category = Constants.CAT_FETCH, label = "Custom "
    + "Order Query", description = "Returns a list of words that begin with a character")
public class GetDocumentsByCustomOrder {

  private static final Logger log = Logger.getLogger(
      GetDocumentsByCustomOrder.class.getCanonicalName()
  );

  public static final String ID = "Document.CustomOrderQuery";

  public static final String DESC = "DESC";

  public static final String ASC = "ASC";
  protected static final int LIMIT = 1000;
  @Context
  protected CoreSession session;
  @Context
  protected AutomationService automationService;
  @Param(name = "query", description = "The query to " + "perform.")
  protected String query;
  @Param(name = "currentPageIndex", alias = "page", required = false, description = "Target "
      + "listing page.")
  protected Integer currentPageIndex;
  @Param(name = "pageSize", required = false, description = "Entries number per page.")
  protected Integer pageSize;
  @Param(name = "sortBy", required = false, description = "Sort by properties (separated by "
      + "comma)")
  protected StringList sortBy;
  @Param(name = "sortOrder", required = false, description = "Sort order, ASC or DESC", widget =
      Constants.W_OPTION, values = {
      ASC, DESC})
  protected StringList sortOrder;
  @Param(name = "dialectId", required = false, description = "Id of the target dialect")
  protected String dialectId;
  @Param(name = "letter", required = false, description = "Desired letter")
  protected String letter;

  @SuppressWarnings("unchecked")
  @OperationMethod
  public DocumentModelList run() throws OperationException {

    String customOrder = "";
    if ((dialectId != null && !dialectId.isEmpty()) && (letter != null && !letter.isEmpty())) {
      customOrder = EnricherUtils.convertLetterToCustomOrder(session, dialectId, letter);
    }
    if (StringUtils.isEmpty(customOrder)) {
      //      We shouldn't get to this state when the archive has the custom order computed on it.
      //      Just in case, handle it gracefully by just querying dc:title.
      query = query + " AND dc:title ILIKE '" + NXQLQueryBuilder
          .prepareStringLiteral(letter, false, true) + "%'";

      log.warning(() ->
          "Custom order is not set on letter `" + letter + "` in dialect `" + dialectId + "`");

    } else if (customOrder.startsWith("%") || customOrder.startsWith("$") || customOrder
        .startsWith("&") || customOrder.startsWith("'") || customOrder.startsWith("*")
        || customOrder.startsWith("_")) {
      query = query + " AND fv:custom_order LIKE \"" + NXQL.escapeStringInner("\\") + customOrder
          + "%\"";
    } else if (customOrder.startsWith("\\")) {
      query = query + " AND fv:custom_order LIKE \"" + "\\\\\\" + customOrder + "%\"";
    } else {
      query = query + " AND fv:custom_order LIKE \"" + customOrder + "%\"";
    }

    PageProviderDefinition def = PageProviderHelper.getQueryPageProviderDefinition(query, null);

    Long targetPage = currentPageIndex != null ? currentPageIndex.longValue() : null;
    Long targetPageSize = pageSize != null ? pageSize.longValue() : null;

    PageProvider<DocumentModel> pp =
        (PageProvider<DocumentModel>) PageProviderHelper.getPageProvider(
        session, def, null, sortBy, sortOrder, targetPageSize, targetPage, null);

    PaginableDocumentModelListImpl res = new PaginableDocumentModelListImpl(pp);
    if (res.hasError()) {
      throw new OperationException(res.getErrorMessage());
    }
    return res;
  }
}
