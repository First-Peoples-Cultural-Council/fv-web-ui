/*
 * (C) Copyright ${year} Nuxeo SA (http://nuxeo.com/) and contributors.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser General Public License
 * (LGPL) version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl-2.1.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * Contributors:
 *     dyona
 */

package ca.firstvoices.operations;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.collectors.DocumentModelCollector;
import org.nuxeo.ecm.automation.core.util.DocumentHelper;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.DocumentNotFoundException;
import org.nuxeo.ecm.core.api.security.SecurityConstants;

import ca.firstvoices.utils.CustomSecurityConstants;

/**
 *
 */
@Operation(id=FVDialectPublishedDocumentPermissions.ID, category=Constants.CAT_USERS_GROUPS, label="FVDialectPublishedDocumentPermissions", description="")
public class FVDialectPublishedDocumentPermissions extends AbstractFVDialectOperation {

    @Context
    protected CoreSession session;

    public static final String ID = "FVDialectPublishedDocumentPermissions";

    private static final Log log = LogFactory.getLog(FVDialectPublishedDocumentPermissions.class);

    @OperationMethod(collector=DocumentModelCollector.class)
    public DocumentModel run(DocumentModel input) {

    	// If not published document return
    	if (!input.isProxy()) {
    		return input;
    	}

    	HashMap<String, String> groupsToCreate = new HashMap<String, String>();

    	try {
           	groupsToCreate.put(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP, SecurityConstants.EVERYTHING);
        	groupsToCreate.put(CustomSecurityConstants.RECORDERS_GROUP, CustomSecurityConstants.CAN_ASK_FOR_PUBLISH);
        	groupsToCreate.put(CustomSecurityConstants.RECORDERS_APPROVERS_GROUP, CustomSecurityConstants.APPROVE);

        	for (Map.Entry<String, String> group : groupsToCreate.entrySet()) {

        		processGroup(input, group);

        		// If published document, give Language Administrators access to parent to ask for permission to publish
        		if (CustomSecurityConstants.LANGUAGE_ADMINS_GROUP.equals(group.getKey())) {
        			DocumentModel parentDoc = session.getParentDocument(input.getRef());

        			if (parentDoc != null && "FVLanguage".equals(parentDoc.getType()))
        			{
        				String groupName = generateGroupNameFromDialect(input.getName(), group.getKey());
        				ACE parentRecordACE = new ACE(groupName, CustomSecurityConstants.CAN_ASK_FOR_PUBLISH, true);
    		        	ACP parentDocACP = parentDoc.getACP();
    		        	parentDocACP.addACE(ACL.LOCAL_ACL, parentRecordACE);
    		        	parentDoc.setACP(parentDocACP, true);

    		        	DocumentHelper.saveDocument(parentDoc.getCoreSession(), parentDoc);
        	    	}
        		}
        	}

    	}
    	catch (DocumentNotFoundException e){
    		log.warn("Could not find document.", e);
    	}
    	catch (Exception e){
    		log.warn("Could not create groups automatically.", e);
    	}

    	return input;
    }

	@Override
	protected ArrayList<String> addParentsToGroup(ArrayList<String> currentParents, DocumentModel groupDocModel, Map.Entry<String, String> currentGroup, DocumentModel input) {
		return currentParents;
	}
}
