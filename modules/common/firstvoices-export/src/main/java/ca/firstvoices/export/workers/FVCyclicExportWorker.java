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

import static ca.firstvoices.export.utils.FVExportConstants.CYCLIC_EXPORT_WORKER_CATEGORY;
import static ca.firstvoices.export.utils.FVExportConstants.CYCLIC_WORKER_ID;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/*
   Worker description is in FVAbstractExportWorker file.
*/

public class FVCyclicExportWorker extends FVAbstractExportWork {

  private static final Log log = LogFactory.getLog(FVCyclicExportWorker.class);

  public FVCyclicExportWorker() {
    super(CYCLIC_WORKER_ID);
  } // we will not need more than one

  @Override
  public String getCategory() {
    return CYCLIC_EXPORT_WORKER_CATEGORY;
  }

  @Override
  public String getTitle() {
    return "Produce formatted document when triggered by cron.";
  }

  @Override
  public void work() {

    // make a list of all known exports in FV
    // start new update cycle
    // things to consider
    // - using temp file for storing outstanding work?
    // - how to drive updates
    // - how to check if export needs to be updated
    // - how to trigger autoamtic re-run of the worker, outside of cron, to process all exports
    log.warn("FVCyclicExportWorker is not implemented yet.");
  }
}
