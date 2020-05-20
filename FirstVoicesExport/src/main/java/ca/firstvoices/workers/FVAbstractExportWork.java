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

import ca.firstvoices.utils.FVExportWorkInfo;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.work.AbstractWork;

/*
 Exporting FVWords and FVPhrases

 FVAbstractExportWork defines an approach to exporting words & phrases by language administrators.
 There are 2 types of inherited workers.
 FVExportWorker - providing an on-demand generation of CSV or PDF files when triggered by
 language administrator.
                  This worker will not perform any checks on if any words were updated and need
                  to be regenerated
                  in the one of the supported formats.
                  When created worker id will be defined as <INITIATING_PRINCIPAL> + "-" +
                  <DIALECT_NAME_TO_EXPORT>+"-" + <EXPORT_FORMAT>.
                  Worker id will be used as the file name for the output.
                  Benefits of this approach are:
                  - only one worker per format + dialect + principal may be running at a time
                  - there can be only 2 workers, 1 for each format, running at a time (based on
                  the previous rule)
                  - exported files are easily identifiable
                  - we can use ACLs associated with each file to restrict access for download
                  Exported files will be placed in Export directory which will be created in
                  each dialect hierarchy.
                  They can be downloaded, once completed, by the originator of the export.

FVCyclicExportWorker - is a more complex version of an exporter. It is not meant to be started
by a user but rather by the system (cron).
                  Its main purpose is to visit ALL Export folders in FV tree and keep them
                  updated to most current version of exported
                  words and phrases in each dialect.
                  Basically it is a worker which keeps export files in sync with the changes in
                  a dialect dictionary.
                  An export file has to be already created by a language administrator in order
                  to be updated.
                  This worker will not create any new files.
                  Update of the exported file depends on the parameters contained within meaning
                   the choices made by a language administrator,
                  with regards to format and information to be exported, will be replicated.
                  A new export file will be generated ONLY if there are words or phrases which
                  changed since the last export.
                  There will be only ONE FVCyclicExportWorker running at a time.
                  To reduce impact on the system cron will trigger start in the least busy
                  server operation times.

*/

public abstract class FVAbstractExportWork extends AbstractWork {

  protected FVExportWorkInfo workInfo;

  public FVAbstractExportWork(String id) {
    super(id);
    workInfo = new FVExportWorkInfo();
  }

  protected static double round(double value, int precision) {
    int scale = (int) Math.pow(10, precision);
    return (double) Math.round(value * scale) / scale;
  }

  public FVExportWorkInfo getWorkInfo() {
    return workInfo;
  }

  public void setWorkInfo(FVExportWorkInfo workInfo) {
    this.workInfo = workInfo;
  }

  public String getInitiatorName() {
    return workInfo.initiatorName;
  }

  public void setInitiatorName(String name) {
    workInfo.initiatorName = name;
  }

  public String getDialectName() {
    return workInfo.dialectName;
  }

  public void setDialectName(String dname) {
    workInfo.dialectName = dname;
  }

  public String getDialectGUID() {
    return workInfo.dialectGUID;
  }

  public void setDialectGUID(String dguid) {
    workInfo.dialectGUID = dguid;
  }

  public String getExportFormat() {
    return workInfo.exportFormat;
  }

  public void setExportFormat(String exportFormat) {
    workInfo.exportFormat = exportFormat;
  }

  public String getExportQuery() {
    return workInfo.exportQuery;
  }

  public void setExportQuery(String exportQuery) {
    workInfo.exportQuery = exportQuery;
  }

  public StringList getExportColumns() {
    return workInfo.columns;
  }

  public void setExportColumns(StringList clist) {
    workInfo.columns = clist;
  }

}
