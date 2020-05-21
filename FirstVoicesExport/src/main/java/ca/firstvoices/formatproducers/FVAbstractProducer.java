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

import static ca.firstvoices.utils.FVExportConstants.EXPORT_WORK_INFO;
import static ca.firstvoices.utils.FVExportConstants.FINISH_EXPORT_BY_WRAPPING_BLOB;
import static ca.firstvoices.utils.FVExportUtils.makePropertyReader;

import ca.firstvoices.propertyreaders.FVAbstractPropertyReader;
import ca.firstvoices.propertyreaders.FVDataBinding;
import ca.firstvoices.utils.ExportColumnRecord;
import ca.firstvoices.utils.FVExportWorkInfo;
import ca.firstvoices.utils.FirstVoicesCSVExportColumns;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventProducer;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

/*
 * FVAbstractProducer is a driver of any export process related to producing a list of words
 * and their
 * associated properties. FVAbstractProducer does not know or care about the format of the export.
 * It knows how to assemble a list of readers, create a temporary file for output.
 * Given an object from a worker which runs the process of of export, it knows to generate a raw
 *  line of data
 * to be processed by subclass specifically design to handle particular data type and format.
 * FVAbstractProducer is also able to distinguish between a single out raw data line or
 * multi-line output and act accordingly
 * to feed it to a subclass.
 * FVAbstractProducer is also able to collect all the column names for all properties to be
 * included in the export file.
 *
 * It is responsibility of the subclass to create a file writer and perform writes.
 *
 */
public abstract class FVAbstractProducer {

  protected static final Log log = LogFactory.getLog(FVAbstractProducer.class);

  protected List<FVAbstractPropertyReader> propertyReaders; // list of readers associated with
  // producer

  protected File outputFile; // temporary file for export

  protected String originalFileName; // original file name as it was created

  protected FirstVoicesCSVExportColumns spec; // binding between columns, properties and readers

  protected CoreSession session; // producer session

  protected Boolean hasCompoundReaders = false;

  FVAbstractProducer(CoreSession session, FirstVoicesCSVExportColumns spec) {
    this.propertyReaders = new ArrayList<>();
    this.session = session;
    this.spec = spec;
  }

  /**
   * @param outputLine - data to be provided to format/data specific subclass
   */
  abstract void writeLine(List<String> outputLine);

  /**
   * Each subclass has to provide a default set of readers which are used in case user does not
   * provide a set of columns defining export.
   */
  abstract void createDefaultPropertyReaders();

  /**
   * Each subclass may define any processing just before temporary file will be closed.
   */
  abstract void endProduction();

  public FirstVoicesCSVExportColumns getSpec() {
    return spec;
  }

  /**
   * Gathers column names from all the known readers and lets subclass write/use it to output to
   * temporary file.
   */
  public void writeColumnNames() {
    List<String> outputLine = getColumnNames();

    writeLine(outputLine);
  }

  /**
   * @param rowData - data set produced by all the readers. It always represents a row of data from
   *                db query and is always associated with the main object (word or phrase).
   */
  public void writeRowData(List<FVDataBinding> rowData) {
    List<String> outputLine;

    if (hasCompoundReaders) {
      List<List<FVDataBinding>> multiLines = createOutputFromCompound(rowData);

      for (List<FVDataBinding> line : multiLines) {
        outputLine = createLineFromData(line);
        writeLine(outputLine);
      }
    } else {
      outputLine = createLineFromData(rowData);
      writeLine(outputLine);
    }
  }

  /**
   * @param dialect  - associated with the produced export
   * @param workInfo - complete work information as provided by an export worker
   */
  // this close has to be called after subclass completes its own close
  public void close(DocumentModel dialect, FVExportWorkInfo workInfo) {
    endProduction(); // subclass can do last moment processing or information write

    // finish by generating event for the export listener to move created temp file to a blob
    // within Nuxeo data
    // space

    workInfo.fileNameAsSaved = outputFile.getName();
    workInfo.fileName = originalFileName;
    workInfo.filePath = outputFile.getPath();
    workInfo.fileLength = outputFile.length();

    // generate new request event to move temporary file to its final location
    // and attach it to a wrapper which will represent it to users
    DocumentEventContext documentEventContext = new DocumentEventContext(session,
        session.getPrincipal(), dialect);
    documentEventContext.setProperty(EXPORT_WORK_INFO, workInfo);

    Event event = documentEventContext
        .newEvent(FINISH_EXPORT_BY_WRAPPING_BLOB); // notify about export completion
    EventProducer eventProducer = Framework.getService(EventProducer.class);
    eventProducer.fireEvent(event);
  }

  /**
   * @param columns - list of columns requested for export
   */
  public void addReaders(StringList columns) {
    // '*' means ALL properties should be exported
    if (columns.contains("*")) {
      // To be provided by a subclass
      // Ideally it should include ALL properties to be ready
      createDefaultPropertyReaders();
    } else {
      for (String col : columns) {
        ExportColumnRecord colR = spec.getColumnExportRecord(col);

        if (colR != null && colR.useForExport) {
          try {
            FVAbstractPropertyReader instance = makePropertyReader(session, colR, this);

            // check if compound readers are present as it will change assemply of the raw data
            if (instance.readerType() == FVAbstractPropertyReader.ReaderType.COMPOUND) {
              hasCompoundReaders = true;
            }

            propertyReaders.add(instance);
          } catch (Exception e) {
            log.error(e);
          }
        } else {
          // log.warn
        }
      }
    }
  }

  /**
   * @param fileName - name to be used for the temporary file fileName will be used to name the
   *                 wrapper holding finished exported document
   * @param suffix   - this is format type CSV or PDF
   * @return - true if temporary file was successfully created
   */
  public Boolean createTemporaryOutputFile(String fileName, String suffix) {
    try {
      originalFileName = fileName;
      outputFile = File.createTempFile(fileName, "." + suffix.toLowerCase());

      return true;
    } catch (IOException e) {
      log.error(e);
    }

    return false;
  }

  /**
   * @param o - object from which gathered readers will collect property values
   * @return - list of assembled data for processing which follows
   */
  public List<FVDataBinding> readPropertiesWithReadersFrom(Object o) {
    List<FVDataBinding> listToReturn = new ArrayList<>();

    for (FVAbstractPropertyReader pr : propertyReaders) {
      List<FVDataBinding> listToAdd = pr.readPropertyFromObject(o);

      listToReturn.addAll(listToAdd);
    }

    return listToReturn;
  }

  /**
   * @param data - row data produced by readPropertiesWithReadersFrom
   * @return list of values to be used for output
   */
  private List<String> createLineFromData(List<FVDataBinding> data) {
    List<String> output = new ArrayList<>();

    for (FVDataBinding column : data) {
      output.add((String) column.getReadProperty());
    }

    return output;
  }

  /**
   * @return list of column names to be written out
   */
  private List<String> getColumnNames() {
    List<String> output = new ArrayList<>();

    for (FVAbstractPropertyReader reader : propertyReaders) {
      StringList columnNames = reader.getColumnNameForOutput();

      output.addAll(columnNames);
    }

    return output;
  }

  /**
   * @param rowData - row data in a compound form
   * @return list of row data correctly formed for a compound object
   */
  private List<List<FVDataBinding>> createOutputFromCompound(List<FVDataBinding> rowData) {
    List<List<FVDataBinding>> listToReturn = new ArrayList<>();
    int numOutputLines = 1; // maximum number of output lines to be generated
    int scan = 1; // since some columns may have more than 1 row we will need to rescan
    // provided data multiple times
    do {
      List<FVDataBinding> singleLine = new ArrayList<>();

      for (FVDataBinding o : rowData) {
        int ol = o.outputLinesInProperty(); // number of lines in 'o'
        if (ol >= scan) {
          if (ol > numOutputLines) {
            numOutputLines = ol; // update maximum number of lines needed
          }

          if (o.isMultiLine()) {
            FVDataBinding lineObject = (FVDataBinding) o.getColumnObject(scan - 1);
            List<FVDataBinding> compoundColumnObjects = (List<FVDataBinding>) lineObject
                .getListOfColumnObjects();

            for (FVDataBinding colObj : compoundColumnObjects) {
              singleLine.add(colObj);
            }
          } else {
            singleLine.add(o);
          }
        } else {
          // create empty fillers for lines where there is no data
          if (o.isMultiLine()) {
            singleLine.addAll(writeBlankRowData(o.getNumberOfCompoundColumn()));
          } else {
            singleLine.add(new FVDataBinding(o.getOutputColumnName(), ""));
          }
        }
      }

      scan++; // scan again until we extracted all compund values

      listToReturn.add(singleLine);

    } while (scan <= numOutputLines);

    return listToReturn;
  }

  /**
   * @param columns - number of empty column object to generate to represent no data
   * @return - list with empty column values to pad properties in a compound object
   */
  private List<FVDataBinding> writeBlankRowData(int columns) {
    List<FVDataBinding> output = new ArrayList<>();

    for (int i = 0; i < columns; i++) {
      output.add(new FVDataBinding("", ""));
    }

    return output;

  }

}
