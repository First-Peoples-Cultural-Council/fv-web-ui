package ca.firstvoices.services;

import ca.firstvoices.models.CustomPreferencesObject;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.ecm.core.schema.FacetNames;
import org.nuxeo.runtime.api.Framework;

import java.io.IOException;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

public class FVUserProfileServiceImpl implements FVUserProfileService {

    private static final Log log = LogFactory.getLog(FVUserProfileServiceImpl.class);

    // this is configured with a property to be set easily in nuxeo.conf in different envs
    static String fvContextPath = Framework.getProperty("fv.contextPath", "app");

    public DocumentModelList getUserDialects(NuxeoPrincipal currentUser, CoreSession session) {
        DocumentModelList dialects = null;
        List<String> groups = currentUser.getGroups();

        if (groups != null && groups.size() >= 1) {
            Iterator it = groups.iterator();
            String inClause = "(\"" + groups.get(0) + "\"";
            it.next();
            while (it.hasNext()) {
                inClause += ",\"" + it.next() + "\"";
            }
            inClause += ")";

            String query = "SELECT * FROM FVDialect WHERE " + NXQL.ECM_MIXINTYPE + " <> '"
                    + FacetNames.HIDDEN_IN_NAVIGATION + "' AND " + NXQL.ECM_LIFECYCLESTATE + " <> '"
                    + LifeCycleConstants.DELETED_STATE + "'" + " AND ecm:isCheckedInVersion = 0 "
                    + " AND ecm:acl/*/principal IN " + inClause + " " + " AND ecm:isProxy = 0 ";

            dialects = session.query(query);
        }

        if (dialects == null) {
            dialects = new DocumentModelListImpl();
        }

        return dialects;
    }

    public String getDefaultDialectRedirectPath(CoreSession documentManager, NuxeoPrincipal currentUser, String baseURL, Boolean defaultHome) {
        String primary_dialect_path = null;
        String primary_dialect_short_url = null;
        String userPreferences = (String) currentUser.getModel().getPropertyValue("user:preferences");

        if (currentUser.isAnonymous()) {
            return null;
        }

        // Lookup dialect in default preferences
        if (userPreferences != null) {
            DocumentModel dialect = null;

            CustomPreferencesObject userPreferencesSettings;
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
                userPreferencesSettings = objectMapper.readValue(userPreferences,
                        new TypeReference<CustomPreferencesObject>() {
                        });
            } catch (IOException e) {
                log.error(e);
                return null;
            }

            String primary_dialect_obj = (String) userPreferencesSettings.getGeneralPreferences()
                    .get("primary_dialect");
            if (primary_dialect_obj != null && documentManager.exists(new IdRef(primary_dialect_obj))) {
                // MC-Nuxeo : I see that new inviated users don't have acess to this document even if the dialect its
                // set in theire preferences
                dialect = documentManager.getDocument(new IdRef(primary_dialect_obj));
            }

            if (dialect != null) {
                primary_dialect_short_url = (String) dialect.getPropertyValue("fvdialect:short_url");
                primary_dialect_path = dialect.getPathAsString();
            }
        }

        // Find first dialect user is member of...
        else {
            DocumentModelList dialects = getUserDialects(currentUser, documentManager);
            // MC-Nuxeo: fvdialect:short_url is always null; where is this set?
            if (dialects.size() > 0) {
                primary_dialect_short_url = (String) dialects.get(0).getPropertyValue("fvdialect:short_url");
                primary_dialect_path = dialects.get(0).getPathAsString();
            }
        }

        String finalPath = null;

        if (primary_dialect_short_url != null && !primary_dialect_short_url.isEmpty()) {
            // Users who are ONLY global 'members' should just go to the Sections URL
            if (currentUser.getGroups().contains("members") && currentUser.getGroups().size() == 1) {
                finalPath = fvContextPath + "/sections/" + primary_dialect_short_url;
            }
            // Other users can go to Workspaces
            else {
                finalPath = fvContextPath + "/Workspaces/" + primary_dialect_short_url;
            }
        } else if (primary_dialect_path != null) {
            // must encode only Dialect..
            finalPath = fvContextPath + "/explore" + primary_dialect_path;
        }

        if (finalPath == null && !defaultHome) {
            return null;
        }

        return Arrays.asList(baseURL, finalPath == null ? fvContextPath : finalPath)
                .stream()
                .map(s -> ((s != null && s.endsWith("/"))) ? s.substring(0, s.length() - 1) : s)
                .map(s -> ((s != null && s.startsWith("/"))) ? s.substring(1) : s)
                .collect(Collectors.joining("/"));
    }
}
