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

package ca.firstvoices.listeners;

import static ca.firstvoices.utils.FVRegistrationConstants.CHECK_REGISTRATION_TIMEOUT_EVENT_NAME;
import ca.firstvoices.workers.FVRegistrationTimeOutWorker;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;

/**
 *
 */
public class FVRegistrationTimeOutListener implements EventListener {

  private static final Log log = LogFactory.getLog(FVRegistrationTimeOutListener.class);

  @Override
  public void handleEvent(Event event) {
    if (CHECK_REGISTRATION_TIMEOUT_EVENT_NAME.equals(event.getName())) {
      FVRegistrationTimeOutWorker doCheckRegTimeOut = new FVRegistrationTimeOutWorker();
      Framework.getService(WorkManager.class).schedule(doCheckRegTimeOut, true);
    }
  }
}
