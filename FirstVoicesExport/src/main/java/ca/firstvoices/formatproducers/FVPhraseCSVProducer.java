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

package ca.firstvoices.formatproducers;

import static ca.firstvoices.utils.FVExportConstants.CSV_FORMAT;

import ca.firstvoices.propertyreaders.FVCompoundPropertyReader;
import ca.firstvoices.propertyreaders.FVPropertyReader;
import ca.firstvoices.propertyreaders.FVSimpleListPropertyReader;
import ca.firstvoices.propertyreaders.FirstVoicesWordTranslationReader;
import ca.firstvoices.utils.FVExportConstants;
import ca.firstvoices.utils.FVPhraseExportCSVColumns;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;

public class FVPhraseCSVProducer extends FVAbstractProducer {

  private static final Log log = LogFactory.getLog(FVPhraseCSVProducer.class);
  private FVSimpleCSVWriter csvWriter;

  public FVPhraseCSVProducer(CoreSession session, String fileName, StringList columns) {
    super(session, new FVPhraseExportCSVColumns());

    try {
      addReaders(columns);

      if (createTemporaryOutputFile(fileName, CSV_FORMAT)) {
        csvWriter = new FVSimpleCSVWriter(new FileWriter(outputFile));
      } else {
        throw new IOException(
            "FVPhraseCSVProducer: error creating temporary file for export of " + fileName);
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
    propertyReaders.add(new FVPropertyReader(session,
        spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.PHRASE), this));
    propertyReaders.add(new FVPropertyReader(session,
        spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.DESCR), this));
    propertyReaders.add(new FirstVoicesWordTranslationReader(session,
        spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.DOMINANT_LANGUAGE_DEFINITION),
        this));
    propertyReaders.add(new FVSimpleListPropertyReader(session,
        spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.CULTURAL_NOTE), this));
    propertyReaders.add(new FVPropertyReader(session,
        spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.REFERENCE), this));

    hasCompoundReaders = true; // have to set this flag manually as property readers are created
    // manually
    propertyReaders.add(new FVCompoundPropertyReader(session,
        spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.IMAGE), this));
    propertyReaders.add(new FVCompoundPropertyReader(session,
        spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.AUDIO), this));
    propertyReaders.add(new FVCompoundPropertyReader(session,
        spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.VIDEO), this));
  }
}
