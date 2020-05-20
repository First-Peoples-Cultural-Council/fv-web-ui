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

package ca.firstvoices.operations;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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
@Operation(id = FVSetListenerFlag.ID, category = Constants.CAT_SERVICES, label =
    "FVSetListenerFlag", description = "")
public class FVSetListenerFlag {

  public static final String ID = "FVSetListenerFlag";
  private static Log log = LogFactory.getLog(FVSetListenerFlag.class);
  @Context
  protected CoreSession session;

  @Param(name = "listenerName", required = true)
  protected String listenerName;

  @Param(name = "state", required = true)
  protected String state;

  protected EventServiceAdmin eventServiceAdmin = Framework.getService(EventServiceAdmin.class);

  @OperationMethod
  public void run() {
    eventServiceAdmin.setListenerEnabledFlag(listenerName, state.equals("Enabled"));
  }

}
