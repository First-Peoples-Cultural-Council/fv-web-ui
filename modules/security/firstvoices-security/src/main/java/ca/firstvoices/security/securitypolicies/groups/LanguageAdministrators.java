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

package ca.firstvoices.security.securitypolicies.groups;

import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_DIALECT;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE_FAMILY;
import ca.firstvoices.security.utils.CustomSecurityConstants;
import java.util.Arrays;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.Access;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.core.model.Document;
import org.nuxeo.ecm.core.query.sql.model.SQLQuery.Transformer;
import org.nuxeo.ecm.core.security.AbstractSecurityPolicy;

/**
 * Language administrators policies
 */
public class LanguageAdministrators extends AbstractSecurityPolicy {

  private static final Log log = LogFactory.getLog(LanguageAdministrators.class);

  @Override
  public Access checkPermission(
      Document doc, ACP mergedAcp, NuxeoPrincipal principal, String permission,
      String[] resolvedPermissions, String[] additionalPrincipals) {

    List<String> additionalPrincipalsList = Arrays.asList(additionalPrincipals);

    log.debug("Checking permission: " + permission + " on doc: " + doc.getUUID() + " for user: "
        + principal.getName());

    // Skip administrators, system user and groups that aren't language administrators
    if (additionalPrincipalsList.contains("administrators") || principal
        .getName()
        .equals(SecurityConstants.SYSTEM_USERNAME) || !additionalPrincipalsList.contains(
        CustomSecurityConstants.LANGUAGE_ADMINS_GROUP)) {
      return Access.UNKNOWN;
    }

    // Skip permissions that are READ, this policy will not limit them
    if ("BROWSE".equals(permission)) {
      return Access.UNKNOWN;
    }

    String docType = doc.getType().getName();

    // Publishing permissions

    // Allow ADD_CHILDREN on section root (for when hierarchy needs to be created from scratch)
    if ("/FV/sections/Data".equals(doc.getPath()) && SecurityConstants.ADD_CHILDREN.equals(
        permission)) {
      return Access.GRANT;
    }

    // Proxy documents
    if (doc.isProxy()) {

      // TODO: Restrict language administrators from publishing to someone else's FVDialect

      // Allow WriteSecurity on dialect so permissions can be assigned when publishing
      if (FV_DIALECT.equals(docType) && SecurityConstants.WRITE_SECURITY.equals(permission)) {
        return Access.GRANT;
      }

      // TODO: Restrict this to THEIR language
      // Allow ADD_CHILDREN on Families, Languages and section root (for when hierarchy needs to
      // be created from
      // scratch)
      if (FV_LANGUAGE.equals(docType) || FV_LANGUAGE_FAMILY.equals(docType)
          && SecurityConstants.ADD_CHILDREN.equals(permission)) {
        return Access.GRANT;
      }
    }

    // Restrict deletion of FVDialect children (but not unpublishing)
    if (doc.getParent() != null && FV_DIALECT.equals(doc.getParent().getType().getName())
        && "Remove".equals(permission)) {
      log.debug("Acces denied because of Dialect parent and remove permission");
      return Access.DENY;
    }

    return Access.UNKNOWN;
  }

  @Override
  public boolean isExpressibleInQuery(String repositoryName) {
    return true;
  }

  @Override
  public Transformer getQueryTransformer(String repositoryName) {
    return Transformer.IDENTITY;
  }
}
