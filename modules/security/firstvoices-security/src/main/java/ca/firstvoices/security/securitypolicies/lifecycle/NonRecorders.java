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

package ca.firstvoices.security.securitypolicies.lifecycle;

import static ca.firstvoices.data.lifecycle.Constants.DISABLED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.NEW_STATE;

import java.util.Arrays;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.Access;
import org.nuxeo.ecm.core.model.Document;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.ecm.core.query.sql.model.Operator;
import org.nuxeo.ecm.core.query.sql.model.Predicate;
import org.nuxeo.ecm.core.query.sql.model.Reference;
import org.nuxeo.ecm.core.query.sql.model.SQLQuery;
import org.nuxeo.ecm.core.query.sql.model.SQLQuery.Transformer;
import org.nuxeo.ecm.core.query.sql.model.StringLiteral;
import org.nuxeo.ecm.core.query.sql.model.WhereClause;
import org.nuxeo.ecm.core.security.AbstractSecurityPolicy;

public class NonRecorders extends AbstractSecurityPolicy {

  public static final Transformer NOT_DISABLED_AND_NOT_NEW_TRANSFORMER =
      new NotDisabledAndNotNewTransformer();
  private static final Log log = LogFactory.getLog(NonRecorders.class);

  @Override
  public Access checkPermission(Document doc, ACP mergedAcp, NuxeoPrincipal principal,
      String permission, String[] resolvedPermissions, String[] additionalPrincipals) {

    log.debug("Checking permission: " + permission + " on doc: " + doc.getUUID() + " for user: "
        + principal.getName());
    // Skip administrators
    if (Arrays.asList(additionalPrincipals).contains("administrators")) {
      return Access.UNKNOWN;
    }

    List<String> additionalPrincipalsList = Arrays.asList(additionalPrincipals);

    // Security policy should only apply to non-proxied documents
    if (!doc.isProxy()) {
      // Users who aren't at least recorders should be denied
      // access documents with New or Disabled state
      if (!additionalPrincipalsList.contains("recorders") && !additionalPrincipalsList
          .contains("language_administrators")) {
        String docLifeCycle = doc.getLifeCycleState();
        if (docLifeCycle != null && (docLifeCycle.equals(NEW_STATE) || docLifeCycle
            .equals(DISABLED_STATE))) {
          log.debug("Access denied because the getLifeCycleState is " + docLifeCycle);
          return Access.DENY;
        }
      }
    }

    return Access.UNKNOWN;
  }

  @Override
  public SQLQuery.Transformer getQueryTransformer(String repositoryName) {
    return NOT_DISABLED_AND_NOT_NEW_TRANSFORMER;
  }

  @Override
  public boolean isExpressibleInQuery(String repositoryName) {
    return true;
  }

  /**
   * Transformer that adds {@code AND ecm:lifeCycleState <> 'Disabled' AND ecm:lifeCycleState <>
   * 'New'} to the query.
   */
  public static class NotDisabledAndNotNewTransformer implements SQLQuery.Transformer {

    public static final Predicate NOT_DISABLED = new Predicate(
        new Reference(NXQL.ECM_LIFECYCLESTATE), Operator.NOTEQ, new StringLiteral(DISABLED_STATE));
    public static final Predicate NOT_NEW = new Predicate(new Reference(NXQL.ECM_LIFECYCLESTATE),
        Operator.NOTEQ, new StringLiteral(NEW_STATE));
    private static final long serialVersionUID = 1L;

    @Override
    public SQLQuery transform(NuxeoPrincipal nxPrincipal, SQLQuery query) {

      log.debug("Transforming the query: " + query);
      // Skip Admins
      if (nxPrincipal.isAdministrator()) {
        return query;
      }

      // Modify the query for anonymous and non-recorders only
      if (nxPrincipal.isAnonymous() || (!nxPrincipal.isMemberOf("recorders") && !nxPrincipal
          .isMemberOf("language_administrators"))) {

        WhereClause where = query.where;
        Predicate predicate;

        if (where == null || where.predicate == null) {
          predicate = new Predicate(NOT_DISABLED, Operator.AND, NOT_NEW);
        } else {

          // Do not limit published assets in the Site and SharedData directories.
          // These generally do not follow fv-lifecycle
          if (where.toString().contains("ecm:path STARTSWITH '/FV/sections/Site/Resources/'")
              || where.toString().contains("ecm:path STARTSWITH '/FV/sections/SharedData/'")) {
            return query;
          }

          Predicate notDisabledAndNotNew = new Predicate(NOT_DISABLED, Operator.AND, NOT_NEW);
          predicate = new Predicate(notDisabledAndNotNew, Operator.AND, where.predicate);
        }
        // return query with updated WHERE clause
        SQLQuery newQuery = new SQLQuery(query.select, query.from, new WhereClause(predicate),
            query.groupBy, query.having, query.orderBy, query.limit, query.offset);
        log.debug("New transformed query: " + newQuery.getQueryString());
        return newQuery;
      }

      return query;
    }
  }

}
