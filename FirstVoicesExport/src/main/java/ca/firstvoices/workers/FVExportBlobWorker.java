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

package ca.firstvoices.workers;

import static ca.firstvoices.utils.FVExportConstants.BLOB_WORKER;
import static ca.firstvoices.utils.FVExportConstants.EXPORT_WORK_INFO;
import static ca.firstvoices.utils.FVExportConstants.MILLISECONDS;

import ca.firstvoices.utils.FVExportWorkInfo;
import java.io.File;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.impl.blob.FileBlob;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventProducer;
import org.nuxeo.ecm.core.event.impl.EventContextImpl;
import org.nuxeo.runtime.api.Framework;

/*
 * FVExportBlobWorker relocates temporary file and connects to a wrapper document created at the
 *  start of the export
 */
public class FVExportBlobWorker extends FVAbstractExportWork {

  private static final Log log = LogFactory.getLog(FVExportBlobWorker.class);

  public FVExportBlobWorker(String id, FVExportWorkInfo info) {
    super(id);
    super.setWorkInfo(info);
  }

  @Override
  public String getCategory() {
    return BLOB_WORKER;
  }

  @Override
  public String getTitle() {
    return "Move an export file to blob and create a wrapper.";
  }

  @Override
  public void work() {
    openSystemSession();

    File file = new File(workInfo.filePath);
    FileBlob fileBlob = new FileBlob(file, workInfo.mimeType, workInfo.encoding);

    DocumentModel wrapper = workInfo.wrapper;

    wrapper.setPropertyValue("file:content", fileBlob);

    workInfo.workDuration = (System.currentTimeMillis() - workInfo.workDuration) / MILLISECONDS;
    workInfo.setExportProgress(
        "EXPORT: Total work time : " + workInfo.workDuration + "seconds while processing "
            + workInfo.originalWorkloadSize + " documents.");
    workInfo.setExportProgressValue(100.0);

    session.saveDocument(wrapper); // ?
    session.save();

    if (workInfo.continueAutoEvent != null) {
      EventProducer eventProducer = Framework.getService(EventProducer.class);
      EventContextImpl ctx = new EventContextImpl(session, session.getPrincipal());

      ctx.setProperty(EXPORT_WORK_INFO, workInfo);

      Event event = ctx
          .newEvent(workInfo.continueAutoEvent); // move to next set of exports if invoked by
      // cyclic worker
      eventProducer.fireEvent(event);
    }
  }
}
