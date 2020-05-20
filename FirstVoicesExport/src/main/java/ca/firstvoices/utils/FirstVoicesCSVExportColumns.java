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

package ca.firstvoices.utils;

import java.util.HashMap;

/*
 * Binding class for connecting instructions from UI, to column names in export output to
 * readers to be applied
 * during export
 */
public class FirstVoicesCSVExportColumns {

  protected HashMap<String, ExportColumnRecord> columnRecordHashMap;

  protected FirstVoicesCSVExportColumns() {
    columnRecordHashMap = new HashMap<>();
  }

  public ExportColumnRecord getColumnExportRecord(String columnToExport) {
    return columnRecordHashMap.get(columnToExport);
  }

  public HashMap<String, ExportColumnRecord> getColumnRecordHashMap() {
    return columnRecordHashMap;
  }
}
