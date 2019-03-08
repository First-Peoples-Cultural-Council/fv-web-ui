package ca.firstvoices.services;

import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.DocumentModel;

public class FVUpdateGroupServiceImpl {

    public void updateGroupMembers( String action, DocumentModel groupDoc, StringList data )
    {

    }

    public void updateGroupSubgroups( String action, DocumentModel groupDoc, StringList data )
    {

    }

    public void updateGroupParentGroups( String action, DocumentModel groupDoc, StringList data )
    {

    }

}

/*
       DocumentModel groupDoc = userManager.getGroupModel(groupName.toLowerCase());

        if (groupDoc == null)
        {
            throw new OperationException("Cannot update non-existent group: " + groupName);
        }

        if( terminateOnInvalidCredentials_GU( session, userManager, groupName ) ) return; // invalid credentials

        if( members != null )
        {
            updateFVProperty( membersAction, groupDoc, members, GROUP_SCHEMA, MEMBERS );
        }

        if (subGroups != null)
        {
            StringList alwaysLowerCase = new StringList();
            for(String gn : subGroups )
            {
                alwaysLowerCase.add( gn.toLowerCase());
            }

            updateFVProperty( subGroupsAction, groupDoc, alwaysLowerCase, GROUP_SCHEMA, SUB_GROUPS );
        }

        if (parentGroups != null )
        {
            StringList alwaysLowerCase = new StringList();
            for(String gn : parentGroups )
            {
                alwaysLowerCase.add( gn.toLowerCase());
            }
            updateFVProperty( parentGroupsAction, groupDoc, alwaysLowerCase, GROUP_SCHEMA, PARENT_GROUPS );
        }

        for (Entry<String, String> entry : Arrays.asList(
                new SimpleEntry<>(GROUP_LABEL, groupLabel),
                new SimpleEntry<>(GROUP_DESCRIPTION, groupDescription)))
        {
            String key = entry.getKey();
            String value = entry.getValue();
            if (StringUtils.isNotBlank(value))
            {
                properties.put(key, value);
            }
        }
        for (Entry<String, String> entry : properties.entrySet())
        {
            String key = entry.getKey();
            String value = entry.getValue();
            if (key.startsWith(GROUP_COLON)) {
                key = key.substring(GROUP_COLON.length());
            }
            groupDoc.setProperty(GROUP_SCHEMA, key, value);
        }

        userManager.updateGroup(groupDoc);
        groupDoc = userManager.getGroupModel(groupName.toLowerCase());

 */