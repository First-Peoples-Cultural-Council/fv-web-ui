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

import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.event.EventServiceAdmin;
import org.nuxeo.runtime.api.Framework;

/**
 * Method to disable or enable a specific listener for debugging or bulk upload.
 */
@Operation(id=FVSetListenerFlag.ID, category=Constants.CAT_SERVICES, label="FVSetListenerFlag", description="")
public class FVSetListenerFlag {

    public static final String ID = "FVSetListenerFlag";

    @Context
    protected CoreSession session;

    @Param(name = "listenerName", required = true)
    protected String listenerName;

    @Param(name = "state", required = true)
    protected String state;

    protected EventServiceAdmin eventServiceAdmin = Framework.getService(EventServiceAdmin.class);

    @OperationMethod
    public void run() {

    	try {
    	    eventServiceAdmin.setListenerEnabledFlag(listenerName, (state.equals("Enabled")) ? true : false );
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }

}
