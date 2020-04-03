/*
 *
 * Copyright 2020 First People's Cultural Council
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * /
 */

package ca.firstvoices.operations;

import ca.firstvoices.utils.ExportColumnRecord;
import ca.firstvoices.utils.FV_PhraseExportCSVColumns;
import ca.firstvoices.utils.FV_WordExportCSVColumns;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.util.StringList;

import java.util.HashMap;

import static ca.firstvoices.utils.FVExportConstants.*;

@Operation(id = FVSupportedExportColumns.ID, category = Constants.CAT_DOCUMENT, label = "Get list of supported export columns.", description = "Returns supported column labels in export to CSV or PDF. ")
public class FVSupportedExportColumns {

    public static final String ID = "Document.FVSupportedExportColumns";

    @Param(name = "format", values = { CSV_FORMAT, PDF_FORMAT })
    protected String format = CSV_FORMAT;

    @Param(name = "exportElement", values = { FVWORD, FVPHRASE })
    protected String exportElement = FVPHRASE;

    /**
     * @return - list of strings with names of columns which can be used to specify columns for export
     */
    @OperationMethod
    public StringList run() {
        if (format.equals("PDF"))
            return null;

        StringList returnList;

        if (exportElement.equals(FVWORD)) {
            returnList = supportedWordQueries_CSV();
        } else {
            returnList = supprtedPhraseQueries_CSV();
        }

        return returnList;
    }

    private StringList supportedWordQueries_CSV() {
        FV_WordExportCSVColumns wc = new FV_WordExportCSVColumns();

        return getValidExportColumns(wc.getColumnRecordHashMap());
    }

    private StringList supprtedPhraseQueries_CSV() {
        FV_PhraseExportCSVColumns pc = new FV_PhraseExportCSVColumns();

        return getValidExportColumns(pc.getColumnRecordHashMap());
    }

    private StringList getValidExportColumns(HashMap<String, ExportColumnRecord> map) {
        StringList list = new StringList();

        for (String k : map.keySet()) {
            if (map.get(k).useForExport) {
                list.add(k);
            }
        }

        return list;
    }

}
