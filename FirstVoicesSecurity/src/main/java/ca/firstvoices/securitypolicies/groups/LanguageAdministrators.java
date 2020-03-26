package ca.firstvoices.securitypolicies.groups;

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

import ca.firstvoices.utils.CustomSecurityConstants;

/**
 * Language administrators policies
 */
public class LanguageAdministrators extends AbstractSecurityPolicy {

    private static final Log log = LogFactory.getLog(LanguageAdministrators.class);

    @Override
    public Access checkPermission(Document doc, ACP mergedAcp, NuxeoPrincipal principal, String permission,
            String[] resolvedPermissions, String[] additionalPrincipals) throws SecurityException {

        List<String> additionalPrincipalsList = Arrays.asList(additionalPrincipals);

        log.debug("Checking permission: " + permission + " on doc: " + doc.getUUID() + " for user: "
                + principal.getName());

        // Skip administrators, system user and groups that aren't language administrators
        if (additionalPrincipalsList.contains("administrators")
                || principal.getName().equals(SecurityConstants.SYSTEM_USERNAME)
                || !additionalPrincipalsList.contains(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP)) {
            return Access.UNKNOWN;
        }

        // Skip permissions that are READ, this policy will not limit them
        if ("BROWSE".equals(permission)) {
            return Access.UNKNOWN;
        }

        String docType = doc.getType().getName();

        // Publishing permissions

        // Allow ADD_CHILDREN on section root (for when hierarchy needs to be created from scratch)
        if ("/FV/sections/Data".equals(doc.getPath()) && SecurityConstants.ADD_CHILDREN.equals(permission)) {
            return Access.GRANT;
        }

        // Proxy documents
        if (doc.isProxy()) {

            // TODO: Restrict language administrators from publishing to someone else's FVDialect
            /*
             * if ( "FVDialect".equals(docType) ) { if ( !Access.GRANT.equals(mergedAcp.getAccess(additionalPrincipals,
             * new String[]{SecurityConstants.EVERYTHING})) ) { return Access.DENY; } }
             */

            // Allow WriteSecurity on dialect so permissions can be assigned when publishing
            if ("FVDialect".equals(docType) && SecurityConstants.WRITE_SECURITY.equals(permission)) {
                return Access.GRANT;
            }

            // TODO: Restrict this to THEIR language
            // Allow ADD_CHILDREN on Families, Languages and section root (for when hierarchy needs to be created from
            // scratch)
            if ("FVLanguage".equals(docType)
                    || "FVLanguageFamily".equals(docType) && SecurityConstants.ADD_CHILDREN.equals(permission)) {
                return Access.GRANT;
            }
        }

        // Restrict deletion of FVDialect children (but not unpublishing)
        if (doc.getParent() != null && "FVDialect".equals(doc.getParent().getType().getName())
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
