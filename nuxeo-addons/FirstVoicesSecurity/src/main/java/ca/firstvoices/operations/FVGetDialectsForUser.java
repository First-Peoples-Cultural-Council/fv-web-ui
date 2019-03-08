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

import ca.firstvoices.utils.FVLoginUtils;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;

/**
 * Operation gets the dialects a user is a member of
 * TODO: Convert to service
 */
@Operation(id=FVGetDialectsForUser.ID, category=Constants.CAT_USERS_GROUPS, label="FVGetDialectsForUser", description="")
public class FVGetDialectsForUser {

    public static final String ID = "FVGetDialectsForUser";

	@Context
	protected CoreSession session;

    @OperationMethod
    public DocumentModelList run() {

    	NuxeoPrincipal currentUser = (NuxeoPrincipal) session.getPrincipal();
		return FVLoginUtils.getDialectsForUser(currentUser, session);
    }

}
