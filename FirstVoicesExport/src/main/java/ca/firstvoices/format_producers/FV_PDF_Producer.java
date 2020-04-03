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

package ca.firstvoices.format_producers;

/*
    Producer assembling output formatted as PDF.
*/

import ca.firstvoices.property_readers.FV_DataBinding;
import org.nuxeo.ecm.automation.core.util.StringList;

import java.util.List;

public class FV_PDF_Producer extends FV_AbstractProducer {

    FV_PDF_Producer(String fileName, StringList columns) {
        super(null, null);
    }

    @Override
    public void writeRowData(List<FV_DataBinding> rowData) {
    }

    public void writeLine(List<String> outputLine) {
    }

    protected void endProduction() {
    }

    protected void createDefaultPropertyReaders() {
    }
}
