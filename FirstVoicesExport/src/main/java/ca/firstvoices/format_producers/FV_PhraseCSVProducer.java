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

import ca.firstvoices.property_readers.FV_CompoundPropertyReader;
import ca.firstvoices.property_readers.FV_PropertyReader;
import ca.firstvoices.property_readers.FV_SimpleListPropertyReader;
import ca.firstvoices.property_readers.FV_WordTranslationReader;
import ca.firstvoices.utils.FVExportConstants;
import ca.firstvoices.utils.FV_PhraseExportCSVColumns;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;

import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import static ca.firstvoices.utils.FVExportConstants.CSV_FORMAT;

public class FV_PhraseCSVProducer extends FV_AbstractProducer {

    private FV_SimpleCSVWriter csvWriter;

    private static final Log log = LogFactory.getLog(FV_PhraseCSVProducer.class);

    public FV_PhraseCSVProducer(CoreSession session, String fileName, StringList columns) {
        super(session, new FV_PhraseExportCSVColumns());

        try {
            addReaders(columns);

            if (createTemporaryOutputFile(fileName, CSV_FORMAT)) {
                csvWriter = new FV_SimpleCSVWriter(new FileWriter(outputFile));
            } else {
                throw new IOException("FV_PhraseCSVProducer: error creating temporary file for export of " + fileName);
            }
        } catch (IOException e) {
            log.error(e);
        }
    }

    @Override
    public void writeLine(List<String> outputLine) {
        try {
            csvWriter.writeNext(outputLine);

            csvWriter.flush();
        } catch (IOException e) {
            log.error(e);
        }
    }

    @Override
    protected void endProduction() {
        try {
            csvWriter.close();
        } catch (IOException e) {
            log.error(e);
        }
    }

    @Override
    protected void createDefaultPropertyReaders() {
        // Binding spec for this producer Key to a reader binding binding spec owner
        propertyReaders.add(new FV_PropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.PHRASE), this));
        propertyReaders.add(new FV_PropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.DESCR), this));
        propertyReaders.add(new FV_WordTranslationReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.DOMINANT_LANGUAGE_DEFINITION), this));
        propertyReaders.add(new FV_SimpleListPropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.CULTURAL_NOTE), this));
        propertyReaders.add(new FV_PropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.REFERENCE), this));

        hasCompoundReaders = true; // have to set this flag manually as property readers are created manually
        propertyReaders.add(new FV_CompoundPropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.IMAGE), this));
        propertyReaders.add(new FV_CompoundPropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.AUDIO), this));
        propertyReaders.add(new FV_CompoundPropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.VIDEO), this));
    }
}