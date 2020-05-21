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

import static ca.firstvoices.utils.FVExportConstants.AUTO_NEXT_EXPORT_WORKER;
import static ca.firstvoices.utils.FVExportConstants.AUTO_PRODUCE_FORMATTED_DOCUMENT;
import static ca.firstvoices.utils.FVExportConstants.CYCLIC_WORKER_ID;
import static ca.firstvoices.utils.FVExportConstants.DOCS_TO_EXPORT;
import static ca.firstvoices.utils.FVExportConstants.EXPORT_WORK_INFO;
import static ca.firstvoices.utils.FVExportConstants.FINISH_EXPORT_BY_WRAPPING_BLOB;
import static ca.firstvoices.utils.FVExportConstants.INHERITED_FROM_OTHER;
import static ca.firstvoices.utils.FVExportConstants.PRODUCE_FORMATTED_DOCUMENT;
import static ca.firstvoices.utils.FVExportUtils.makeExportWorkerID;

import ca.firstvoices.utils.FVExportUtils;
import ca.firstvoices.utils.FVExportWorkInfo;
import ca.firstvoices.workers.FVAbstractExportWork;
import ca.firstvoices.workers.FVCyclicExportWorker;
import ca.firstvoices.workers.FVExportBlobWorker;
import ca.firstvoices.workers.FVExportWorker;
import java.util.ArrayList;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;

/*
 *
 */
public class FVExportListener implements EventListener {

  private static final Log log = LogFactory.getLog(FVExportListener.class);

  protected WorkManager workManager;

  @Override
  public void handleEvent(Event event) {
    EventContext ctx = event.getContext();

    switch (event.getName()) {
      case PRODUCE_FORMATTED_DOCUMENT: // starting point for an export operations
        FVExportWorkInfo info = (FVExportWorkInfo) ctx.getProperty(EXPORT_WORK_INFO);

        String id = makeExportWorkerID(info);

        if (checkForRunningWorkerBeforeProceeding(id)) {
          getWorkManager().schedule(produceWorker(ctx, new FVExportWorker(id)), true);
        }
        break;

      case FINISH_EXPORT_BY_WRAPPING_BLOB: // conclusion of the export - send document to be
        // included in a wrapper
        getWorkManager().schedule(produceBlobWorker(ctx), true);
        break;

      case AUTO_PRODUCE_FORMATTED_DOCUMENT: // placeholder for cyclic export
        if (checkForRunningWorkerBeforeProceeding(CYCLIC_WORKER_ID)) {
          getWorkManager().schedule(produceWorker(ctx, new FVCyclicExportWorker()), true);
        }
        break;

      case AUTO_NEXT_EXPORT_WORKER: // cyclic: move to work on next export document
        break;
      default:
        break;
    }
  }

  private boolean checkForRunningWorkerBeforeProceeding(String workId) {
    return !FVExportUtils.checkForRunningWorkerBeforeProceeding(workId, workManager);
  }

  private FVAbstractExportWork produceBlobWorker(EventContext ctx) {
    FVExportWorkInfo info = (FVExportWorkInfo) ctx.getProperty(EXPORT_WORK_INFO);
    FVExportBlobWorker work = new FVExportBlobWorker(String.valueOf(System.nanoTime()), info);
    return work;
  }

  private FVAbstractExportWork produceWorker(EventContext ctx, FVAbstractExportWork work) {
    if (ctx.hasProperty(EXPORT_WORK_INFO)) {
      work.setWorkInfo((FVExportWorkInfo) ctx.getProperty(EXPORT_WORK_INFO));

      StringList pc = work.getExportColumns();

      work.setExportColumns(pc);

      work.setDocuments(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
          (ArrayList<String>) ctx.getProperty(DOCS_TO_EXPORT));
    } else {
      FVExportWorkInfo workInfo = new FVExportWorkInfo();

      workInfo.workDuration = System.currentTimeMillis();
      workInfo.dialectGUID = INHERITED_FROM_OTHER;
      workInfo.dialectName = INHERITED_FROM_OTHER;
      workInfo.exportFormat = INHERITED_FROM_OTHER;
      workInfo.initiatorName = INHERITED_FROM_OTHER;
      workInfo.exportElement = INHERITED_FROM_OTHER;
      workInfo.continueAutoEvent = AUTO_NEXT_EXPORT_WORKER; // continue to next export document set

      work.setExportQuery(INHERITED_FROM_OTHER);
      work.setInitiatorName("System");
      work.setDialectName(INHERITED_FROM_OTHER);
      work.setDialectGUID(INHERITED_FROM_OTHER);
      work.setExportFormat(INHERITED_FROM_OTHER);

      work.setWorkInfo(workInfo);
    }

    return work;
  }

  protected WorkManager getWorkManager() {
    if (workManager == null) {
      workManager = Framework.getService(WorkManager.class);
    }
    return workManager;
  }
}
