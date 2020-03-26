package ca.firstvoices.securitypolicies.groups;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.Access;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.core.model.Document;
import org.nuxeo.ecm.core.query.sql.model.SQLQuery.Transformer;
import org.nuxeo.ecm.core.security.AbstractSecurityPolicy;

import ca.firstvoices.utils.CustomSecurityConstants;

/**
 * Language recorders policies
 */
public class LanguageRecorders extends AbstractSecurityPolicy {

    private static final Log log = LogFactory.getLog(LanguageRecorders.class);

    // A list of document types with ReadWrite Permissions
    private static ArrayList<String> allowedDocumentTypes = new ArrayList<String>();

    /**
     * Check if user has permission on current document, to avoid using groups for filtering.
     *
     * @param mergedAcp
     * @param additionalPrincipalsList
     * @param permission
     * @return
     */
    private Boolean hasPermissionInACP(ACP mergedAcp, List<String> additionalPrincipalsList, String permission) {

        for (ACL acl : mergedAcp.getACLs()) {
            for (ACE ace : acl.getACEs()) {
                if (ace.isGranted() && additionalPrincipalsList.contains(ace.getUsername())
                        && ace.getPermission().equals(permission)) {
                    return true;
                }
            }
        }

        return false;
    }

    @Override
    public boolean isRestrictingPermission(String permission) {

        if (permission.equals(SecurityConstants.ADD_CHILDREN) || permission.equals(SecurityConstants.WRITE)
                || permission.equals(SecurityConstants.WRITE_PROPERTIES)
                || permission.equals(CustomSecurityConstants.CAN_ASK_FOR_PUBLISH)
                || permission.equals(SecurityConstants.REMOVE_CHILDREN)
                || permission.equals(SecurityConstants.REMOVE)) {
            return true;
        }

        return false;
    }

    @Override
    public Access checkPermission(Document doc, ACP mergedAcp, NuxeoPrincipal principal, String permission,
            String[] resolvedPermissions, String[] additionalPrincipals) throws SecurityException {

        List<String> resolvedPermissionsList = Arrays.asList(resolvedPermissions);
        List<String> additionalPrincipalsList = Arrays.asList(additionalPrincipals);

        log.debug("Checking permission: " + permission + " on doc: " + doc.getUUID() + " for user: "
                + principal.getName());

        // Skip administrators, system and users who aren't recorders
        if (additionalPrincipalsList.contains("administrators")
                || principal.getName().equals(SecurityConstants.SYSTEM_USERNAME)
                || !Arrays.asList(additionalPrincipals).contains("recorders")) {
            return Access.UNKNOWN;
        }

        // Skip permissions that are READ, this policy will not limit them
        if ("BROWSE".equals(permission)) {
            return Access.UNKNOWN;
        }

        String docType = doc.getType().getName();
        String docTypeParent = null;

        if (doc.getParent() != null) {
            docTypeParent = doc.getParent().getType().getName();
        }

        // mergedAcp.getAccess(principal.getName(), CustomSecurityConstants.RECORD);

        // Permissions apply to recorders only
        if (hasPermissionInACP(mergedAcp, additionalPrincipalsList, CustomSecurityConstants.RECORD)) {

            if (allowedDocumentTypes.isEmpty()) {
                allowedDocumentTypes.add("FVCategories");
                allowedDocumentTypes.add("FVContributors");
                allowedDocumentTypes.add("FVDictionary");
                allowedDocumentTypes.add("FVLabelDictionary");
                allowedDocumentTypes.add("FVResources");
                allowedDocumentTypes.add("FVBook");
                allowedDocumentTypes.add("FVBooks");
                allowedDocumentTypes.add("FVBookEntry");
                allowedDocumentTypes.add("FVPortal");
            }

            // Allow adding children and removing children on allowed types
            if (allowedDocumentTypes.contains(docType)
                    && (resolvedPermissionsList.contains(SecurityConstants.ADD_CHILDREN)
                            || resolvedPermissionsList.contains(SecurityConstants.REMOVE_CHILDREN))) {
                return Access.GRANT;
            }

            // Allow Publishing, Writing and Removing on allowed document type children
            if (docTypeParent != null && allowedDocumentTypes.contains(docTypeParent)
                    && (resolvedPermissionsList.contains(SecurityConstants.WRITE_PROPERTIES)
                            || resolvedPermissionsList.contains(SecurityConstants.REMOVE)
                            || resolvedPermissionsList.contains(SecurityConstants.WRITE))) {
                return Access.GRANT;
            }
        }

        // Recorders can only publish to their allowed types (OK to use groups as this is globally applicable)
        if (additionalPrincipalsList.contains(CustomSecurityConstants.RECORDERS_GROUP)
                || additionalPrincipalsList.contains(CustomSecurityConstants.RECORDERS_APPROVERS_GROUP)) {
            if (!allowedDocumentTypes.contains(docType)
                    && (resolvedPermissionsList.contains(CustomSecurityConstants.CAN_ASK_FOR_PUBLISH))) {
                log.debug("Access denied on Resolvers: ");

                return Access.DENY;
            }
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
