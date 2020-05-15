package ca.firstvoices.operations;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.AbstractMap.SimpleEntry;
import java.util.Map.Entry;

import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.util.Properties;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.usermanager.UserManager;

import static ca.firstvoices.services.FVUserGroupUpdateUtilities.updateFVProperty;
import static ca.firstvoices.utils.FVOperationCredentialsVerification.terminateOnInvalidCredentials_GroupUpdate;
import static ca.firstvoices.utils.FVRegistrationConstants.*;

/**
 *
 */
@Operation(id = FVUpdateGroup.ID, category = Constants.CAT_USERS_GROUPS, label = "FVUpdateGroup", description = "Updates group information. Possible actions are 'update'(default), 'append' and 'remove' .")
public class FVUpdateGroup {
    public static final String ID = "FVUpdateGroup";

    @Context
    protected UserManager userManager;

    @Context
    protected CoreSession session;

    @Param(name = "groupname")
    protected String groupName;

    @Param(name = "grouplabel", required = false)
    protected String groupLabel;

    @Param(name = "description", required = false)
    protected String groupDescription;

    @Param(name = "members", required = false)
    protected StringList members;

    @Param(name = "membersAction", required = false, values = { UPDATE, APPEND, REMOVE })
    protected String membersAction = UPDATE;

    @Param(name = "subGroups", required = false)
    protected StringList subGroups;

    @Param(name = "subGroupsAction", required = false, values = { UPDATE, APPEND, REMOVE })
    protected String subGroupsAction = UPDATE;

    @Param(name = "parentGroups", required = false)
    protected StringList parentGroups;

    @Param(name = "parentGroupsAction", required = false, values = { UPDATE, APPEND, REMOVE })
    protected String parentGroupsAction = UPDATE;

    @Param(name = "properties", required = false)
    protected Properties properties = new Properties();

    @OperationMethod
    public String run() throws OperationException {
        DocumentModel groupDoc = userManager.getGroupModel(groupName.toLowerCase());

        if (groupDoc == null) {
            throw new OperationException("Cannot update non-existent group: " + groupName);
        }

        if (terminateOnInvalidCredentials_GroupUpdate(session, groupName))
            return "You do not have permission to change " + groupDoc.getName(); // invalid credentials

        if (members != null) {
            updateFVProperty(membersAction, groupDoc, members, GROUP_SCHEMA, MEMBERS);
        }

        if (subGroups != null) {
            StringList alwaysLowerCase = new StringList();
            for (String gn : subGroups) {
                alwaysLowerCase.add(gn.toLowerCase());
            }

            updateFVProperty(subGroupsAction, groupDoc, alwaysLowerCase, GROUP_SCHEMA, SUB_GROUPS);
        }

        if (parentGroups != null) {
            StringList alwaysLowerCase = new StringList();
            for (String gn : parentGroups) {
                alwaysLowerCase.add(gn.toLowerCase());
            }
            updateFVProperty(parentGroupsAction, groupDoc, alwaysLowerCase, GROUP_SCHEMA, PARENT_GROUPS);
        }

        for (Entry<String, String> entry : Arrays.asList(new SimpleEntry<>(GROUP_LABEL, groupLabel),
                new SimpleEntry<>(GROUP_DESCRIPTION, groupDescription))) {
            String key = entry.getKey();
            String value = entry.getValue();
            if (StringUtils.isNotBlank(value)) {
                properties.put(key, value);
            }
        }
        for (Entry<String, String> entry : properties.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            if (key.startsWith(GROUP_COLON)) {
                key = key.substring(GROUP_COLON.length());
            }
            groupDoc.setProperty(GROUP_SCHEMA, key, value);
        }

        userManager.updateGroup(groupDoc);
        groupDoc = userManager.getGroupModel(groupName.toLowerCase());

        return "Updated " + groupDoc.getName();
    }
}
