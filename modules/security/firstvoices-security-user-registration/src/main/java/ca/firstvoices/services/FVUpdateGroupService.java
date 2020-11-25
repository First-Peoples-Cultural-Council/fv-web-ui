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

package ca.firstvoices.services;

import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.DocumentModel;

public interface FVUpdateGroupService {

  void updateGroupMembers(String action, DocumentModel groupDoc, StringList data);

  void updateGroupSubgroups(String action, DocumentModel groupDoc, StringList data);

  void updateGroupParentGroups(String action, DocumentModel groupDoc, StringList data);
}

/*
updateFVProperty(String action, DocumentModel doc, StringList data, String schemaName, String
field )
        DocumentModel groupDoc = userManager.getGroupModel(groupName.toLowerCase());

        if (groupDoc == null)
        {
            throw new OperationException("Cannot update non-existent group: " + groupName);
        }

        if( terminateOnInvalidCredentials_GU( session, userManager, groupName ) ) return; //
        invalid credentials

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

            updateFVProperty( subGroupsAction, groupDoc, alwaysLowerCase, GROUP_SCHEMA,
            SUB_GROUPS );
        }

        if (parentGroups != null )
        {
            StringList alwaysLowerCase = new StringList();
            for(String gn : parentGroups )
            {
                alwaysLowerCase.add( gn.toLowerCase());
            }
            updateFVProperty( parentGroupsAction, groupDoc, alwaysLowerCase, GROUP_SCHEMA,
            PARENT_GROUPS );
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
