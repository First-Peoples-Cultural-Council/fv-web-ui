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

package ca.firstvoices.export.workers;

import static ca.firstvoices.export.utils.FVExportConstants.FVWORD;
import static ca.firstvoices.export.utils.FVExportConstants.ON_DEMAND_WORKER_CATEGORY;
import ca.firstvoices.export.formatproducers.FVAbstractProducer;
import ca.firstvoices.export.formatproducers.FVPhraseCSVProducer;
import ca.firstvoices.export.formatproducers.FVWordCSVProducer;
import ca.firstvoices.export.propertyreaders.FVDataBinding;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentLocation;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;

/*
        Worker description is in FVAbstractExportWorker file.

        FVExportWorker starts export for words and phrases
*/

public class FVExportWorker extends FVAbstractExportWork {

  private static final Log log = LogFactory.getLog(FVExportWorker.class);

  public FVExportWorker(String id) {
    super(id);
  }

  @Override
  public String getCategory() {
    return ON_DEMAND_WORKER_CATEGORY;
  }

  @Override
  public String getTitle() {
    return "Produce formatted document when triggered by user.";
  }

  @Override
  public void work() {
    if (!getDocuments().isEmpty()) {
      openSystemSession();

      List<DocumentLocation> listToProcess = getDocuments();

      FVAbstractProducer fileOutputProducer;

      if (workInfo.getExportElement().equals(FVWORD)) {
        fileOutputProducer =
            new FVWordCSVProducer(session, workInfo.getFileName(), workInfo.getColumns());
      } else {
        fileOutputProducer =
            new FVPhraseCSVProducer(session, workInfo.getFileName(), workInfo.getColumns());
      }

      fileOutputProducer.writeColumnNames();

      int size = listToProcess.size();
      double originalSize = size;
      int counter = 1;

      workInfo.setExportProgress("Exporting... " + size + " words.");

      while (!listToProcess.isEmpty()) {
        size = listToProcess.size();

        if (counter % 51 == 0) {
          counter = 0;
          double currentSize = size;
          double percent = round(100 * (1 - (currentSize / originalSize)), 1);
          workInfo.setExportProgressValue(percent);
          workInfo.setExportProgress(percent + "% done.");
        }

        DocumentLocation docLocation = listToProcess.get(size - 1);
        listToProcess.remove(size - 1);

        if (docLocation != null) {
          DocumentModel doc = session.getDocument(docLocation.getIdRef());

          if (doc != null) {
            List<FVDataBinding> output = fileOutputProducer.readPropertiesWithReadersFrom(doc);

            assert (output != null) : "Null output from producer";

            fileOutputProducer.writeRowData(output);
            counter++;

          }
        } else {
          log.warn("NUll docLocation in FVExportWorker.");
        }
      }

      fileOutputProducer.close(session.getDocument(new IdRef(getDialectGUID())), getWorkInfo());
    }

  }
}
