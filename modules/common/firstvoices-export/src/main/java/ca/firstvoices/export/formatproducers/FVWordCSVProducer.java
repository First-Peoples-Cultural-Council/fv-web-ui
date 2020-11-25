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

package ca.firstvoices.export.formatproducers;

import static ca.firstvoices.export.utils.FVExportConstants.CSV_FORMAT;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.ASSIGNED_USR_ID;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.AUDIO;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.AVAILABLE_IN_CHILDRENS_ARCHIVE;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.AVAILABLE_IN_GAMES;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.CATEGORIES;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.CHANGE_DTTM;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.CONTRIBUTOR;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.CULTURAL_NOTE;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.DOMINANT_LANGUAGE_DEFINITION;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.IMAGE;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.LITERAL_TRANSLATION;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.PART_OF_SPEECH_ID;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.PHONETIC_INFO;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.REALTED_PHRASE;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.REFERENCE;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.TITLE;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.VIDEO;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.WORD_STATUS;
import ca.firstvoices.export.propertyreaders.FVBooleanPropertyReader;
import ca.firstvoices.export.propertyreaders.FVCategoryPropertyReader;
import ca.firstvoices.export.propertyreaders.FVCompoundPropertyReader;
import ca.firstvoices.export.propertyreaders.FVPartOfSpeechPropertyReader;
import ca.firstvoices.export.propertyreaders.FVPropertyReader;
import ca.firstvoices.export.propertyreaders.FVSimpleListPropertyReader;
import ca.firstvoices.export.propertyreaders.FirstVoicesWordTranslationReader;
import ca.firstvoices.export.utils.FVWordExportCSVColumns;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;

/*
    Producer assembling output formatted as CSV.
*/

public class FVWordCSVProducer extends FVAbstractProducer {

  private static Log log = LogFactory.getLog(FVWordCSVProducer.class);

  protected FVSimpleCSVWriter csvWriter;

  public FVWordCSVProducer(CoreSession session, String fileName, StringList columns) {
    super(session, new FVWordExportCSVColumns());

    try {
      addReaders(columns);

      if (!createTemporaryOutputFile(fileName, CSV_FORMAT)) {
        throw new IOException(
            "FVWordCSVProducer: error creating temporary file for export of " + fileName);
      }
    } catch (IOException e) {
      log.error(e);
    }
  }

  @Override
  protected void writeLine(List<String> outputLine) {
    try {
      getCsvWriter().writeNext(outputLine);

      getCsvWriter().flush();
    } catch (IOException e) {
      log.error(e);
    }
  }

  @Override
  protected void endProduction() {
    try {
      getCsvWriter().close();
    } catch (IOException e) {
      log.error(e);
    }
  }

  @Override
  protected void createDefaultPropertyReaders() {
    // Binding spec for this producer Key to reader binding binding spec owner
    propertyReaders.add(new FVPropertyReader(session, spec.getColumnExportRecord(TITLE), this));
    propertyReaders.add(new FVPartOfSpeechPropertyReader(session,
        spec.getColumnExportRecord(PART_OF_SPEECH_ID),
        this));
    propertyReaders.add(new FVPropertyReader(session,
        spec.getColumnExportRecord(PHONETIC_INFO),
        this));
    propertyReaders.add(new FirstVoicesWordTranslationReader(session,
        spec.getColumnExportRecord(DOMINANT_LANGUAGE_DEFINITION),
        this));
    propertyReaders.add(new FirstVoicesWordTranslationReader(session,
        spec.getColumnExportRecord(LITERAL_TRANSLATION),
        this));
    propertyReaders.add(new FVCategoryPropertyReader(session,
        spec.getColumnExportRecord(REALTED_PHRASE),
        this));
    propertyReaders.add(new FVSimpleListPropertyReader(session,
        spec.getColumnExportRecord(CULTURAL_NOTE),
        this));
    propertyReaders.add(new FVCategoryPropertyReader(session,
        spec.getColumnExportRecord(CATEGORIES),
        this));
    propertyReaders.add(new FVPropertyReader(session, spec.getColumnExportRecord(REFERENCE), this));
    propertyReaders.add(new FVBooleanPropertyReader(session,
        spec.getColumnExportRecord(AVAILABLE_IN_CHILDRENS_ARCHIVE),
        this));
    propertyReaders.add(new FVBooleanPropertyReader(session,
        spec.getColumnExportRecord(AVAILABLE_IN_GAMES),
        this));
    propertyReaders.add(new FVPropertyReader(session,
        spec.getColumnExportRecord(ASSIGNED_USR_ID),
        this));
    propertyReaders.add(new FVPropertyReader(session,
        spec.getColumnExportRecord(WORD_STATUS),
        this));
    propertyReaders.add(new FVSimpleListPropertyReader(session,
        spec.getColumnExportRecord(CONTRIBUTOR),
        this));
    propertyReaders.add(new FVPropertyReader(session,
        spec.getColumnExportRecord(CHANGE_DTTM),
        this));

    hasCompoundReaders = true; // have to set this flag manually as property readers are created
    // manually
    propertyReaders.add(new FVCompoundPropertyReader(session,
        spec.getColumnExportRecord(IMAGE),
        this));
    propertyReaders.add(new FVCompoundPropertyReader(session,
        spec.getColumnExportRecord(AUDIO),
        this));
    propertyReaders.add(new FVCompoundPropertyReader(session,
        spec.getColumnExportRecord(VIDEO),
        this));
  }

  protected FVSimpleCSVWriter getCsvWriter() throws IOException {
    if (csvWriter == null) {
      csvWriter = new FVSimpleCSVWriter(new FileWriter(outputFile));
    }
    return csvWriter;
  }
}
