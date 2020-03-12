package ca.firstvoices.operations;

import static ca.firstvoices.services.FVUserGroupUpdateUtilities.updateFVProperty;
import static ca.firstvoices.utils.FVRegistrationConstants.*;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.COMPANY_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.EMAIL_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.FIRSTNAME_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.GROUPS_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.LASTNAME_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.SCHEMA_NAME;

import java.security.Principal;
import java.util.AbstractMap.SimpleEntry;
import java.util.Arrays;
import java.util.Map.Entry;
import org.apache.commons.lang3.StringUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.util.Properties;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.impl.blob.StringBlob;
import org.nuxeo.ecm.core.io.registry.MarshallerHelper;
import org.nuxeo.ecm.platform.usermanager.NuxeoPrincipalImpl;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.platform.usermanager.io.NuxeoPrincipalJsonWriter;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;

import static ca.firstvoices.utils.FVOperationCredentialsVerification.terminateOnInvalidCredentials_UserUpdate;

/**
 *
 */
@Operation(id = FVUpdateUser.ID, aliases = {
        "Services.UpdateUser" }, category = Constants.CAT_USERS_GROUPS, label = "FVUpdateUser", description = "Updates user information. Possible actions are 'update'(default), 'append' and 'remove' .")
public class FVUpdateUser {

    public static final String ID = "FVUpdateUser";

    @Context
    protected CoreSession session;

    @Param(name = "username")
    protected String username;

    // @Param(name = "password", required = false)
    // protected String password;

    @Param(name = "email", required = false)
    protected String email;

    @Param(name = "firstName", required = false)
    protected String firstName;

    @Param(name = "lastName", required = false)
    protected String lastName;

    @Param(name = "company", required = false)
    protected String company;

    @Param(name = "groups", required = false)
    protected StringList groups;

    @Param(name = "groupsAction", required = false, values = { UPDATE, APPEND, REMOVE })
    protected String groupsAction;

    @Param(name = "properties", required = false)
    protected Properties properties = new Properties();

    @Param(name = "languagePreference", required = false)
    protected String languagePreference;

    private ObjectMapper mapper = new ObjectMapper();

    @OperationMethod
    public DocumentModel run() throws OperationException {
        NuxeoPrincipal currentUser = (NuxeoPrincipal) session.getPrincipal();
        UserManager userManager = Framework.getService(UserManager.class);
        DocumentModel userDoc = userManager.getUserModel(username);

        if (userDoc == null) {
            throw new DocumentNotFoundException("Cannot update non-existent user: " + username);
        }

        if (!userManager.getPrincipal(username).equals(currentUser)) {
            throw new DocumentSecurityException("You can only edit yourself");
        }

        if (groups != null) {
            StringList alwaysLowerCase = new StringList();
            for (String gn : groups) {
                alwaysLowerCase.add(gn.toLowerCase());
            }

            updateFVProperty(groupsAction, userDoc, alwaysLowerCase, SCHEMA_NAME, GROUPS_COLUMN);
        }

        for (Entry<String, String> entry : Arrays.asList( //
                // new SimpleEntry<>(PASSWORD_COLUMN, password), //
                new SimpleEntry<>(EMAIL_COLUMN, email), //
                new SimpleEntry<>(FIRSTNAME_COLUMN, firstName), //
                new SimpleEntry<>(LASTNAME_COLUMN, lastName), //
                new SimpleEntry<>(COMPANY_COLUMN, company),
                new SimpleEntry<>("languagePreference", languagePreference))) {
            String key = entry.getKey();
            String value = entry.getValue();
            if (StringUtils.isNotBlank(value)) {
                properties.put(key, value);
            }
        }
        for (Entry<String, String> entry : properties.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            if (key.startsWith(USER_COLON)) {
                key = key.substring(USER_COLON.length());
            }
            userDoc.setProperty(SCHEMA_NAME, key, value);
        }

        Framework.doPrivileged(() -> userManager.updateUser(userDoc));

        // Before returning JSON, blank out password
        userDoc.setProperty(SCHEMA_NAME, "password", null);

        return userDoc;
    }
}
