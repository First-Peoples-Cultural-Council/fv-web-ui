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

package ca.firstvoices.editors.listeners;

import ca.firstvoices.editors.services.DraftEditorService;
import ca.firstvoices.editors.workers.FVEditLockWorker;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;

public class EditLockCheckListener implements EventListener {

  public static final String CHECK_EDITOR_LOCKS_EVENT_NAME = "checkEditLocks";
  private static final Log log = LogFactory.getLog(EditLockCheckListener.class);
  protected DraftEditorService service = Framework.getService(DraftEditorService.class);
  protected WorkManager workManager = Framework.getService(WorkManager.class);

  @Override
  public void handleEvent(Event event) {
    if (CHECK_EDITOR_LOCKS_EVENT_NAME.equals(event.getName())) {
      FVEditLockWorker doCheckLocks = new FVEditLockWorker();
      workManager.schedule(doCheckLocks, true);
    }
  }

}
