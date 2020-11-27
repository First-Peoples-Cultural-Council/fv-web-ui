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

package ca.firstvoices.export.operations;

import static ca.firstvoices.export.utils.FVExportConstants.CSV_FORMAT;
import static ca.firstvoices.export.utils.FVExportConstants.FVPHRASE;
import static ca.firstvoices.export.utils.FVExportConstants.FVWORD;
import static ca.firstvoices.export.utils.FVExportConstants.PDF_FORMAT;
import ca.firstvoices.export.utils.ExportColumnRecord;
import ca.firstvoices.export.utils.FVPhraseExportCSVColumns;
import ca.firstvoices.export.utils.FVWordExportCSVColumns;
import java.util.Map;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.util.StringList;

@Operation(id = FVSupportedExportColumns.ID,
    category = Constants.CAT_DOCUMENT,
    label = "Get " + "list of supported export columns.",
    description = "Returns supported column labels in " + "export to CSV or PDF. ")
public class FVSupportedExportColumns {

  public static final String ID = "Document.FVSupportedExportColumns";

  @Param(name = "format", values = {CSV_FORMAT, PDF_FORMAT}) protected String format = CSV_FORMAT;

  @Param(name = "exportElement", values = {FVWORD, FVPHRASE}) protected String exportElement =
      FVPHRASE;

  @OperationMethod
  public StringList run() {
    if (format.equals("PDF")) {
      return null;
    }

    StringList returnList;

    if (exportElement.equals(FVWORD)) {
      returnList = supportedWordQueriesCSV();
    } else {
      returnList = supportedPhraseQueriesCSV();
    }

    return returnList;
  }

  private StringList supportedWordQueriesCSV() {
    FVWordExportCSVColumns wc = new FVWordExportCSVColumns();

    return getValidExportColumns(wc.getColumnRecordHashMap());
  }

  private StringList supportedPhraseQueriesCSV() {
    FVPhraseExportCSVColumns pc = new FVPhraseExportCSVColumns();

    return getValidExportColumns(pc.getColumnRecordHashMap());
  }

  private StringList getValidExportColumns(Map<String, ExportColumnRecord> map) {
    StringList list = new StringList();

    for (Map.Entry<String, ExportColumnRecord> k : map.entrySet()) {
      if (k.getValue().useForExport) {
        list.add(k.getKey());
      }
    }

    return list;
  }

}
