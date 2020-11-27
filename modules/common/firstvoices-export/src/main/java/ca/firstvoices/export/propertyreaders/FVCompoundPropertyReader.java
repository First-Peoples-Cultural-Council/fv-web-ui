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

package ca.firstvoices.export.propertyreaders;

import static ca.firstvoices.export.utils.FVExportUtils.makePropertyReader;
import ca.firstvoices.export.formatproducers.FVAbstractProducer;
import ca.firstvoices.export.utils.ExportColumnRecord;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;

/*
 * FVCompoundPropertyReader reads properties which are String[] and have to be de-referenced
 * to read their values. For now FVCompoundPropertyReader handles Media type properties (Image,
 *  Audio, Video).
 */

public class FVCompoundPropertyReader extends FVAbstractPropertyReader {

  private static final Log log = LogFactory.getLog(FVCompoundPropertyReader.class);
  private final List<FVDataBinding> compound;
  private final List<FVAbstractPropertyReader> compoundReaders;

  public FVCompoundPropertyReader(
      CoreSession session, ExportColumnRecord spec, FVAbstractProducer specOwner) {
    super(session, spec, specOwner);
    compound = spec.compound;
    maxColumns = compound.size();

    // storage for compoundReaders needs to be initialized before making readers
    compoundReaders = new ArrayList<>();
    makeReaders();
  }

  public ReaderType readerType() {
    return ReaderType.COMPOUND;
  }

  /*
   * Format of the returned compound value from FVCompoundPropertyReader
   * List of
   * FVDataBinding
   *    - outputColumnName = <Compound reader column descriptor ex. IMAGE>
   *    - readPropertyValue -> List of        (each generated row )
   *                           FVDataBinding - Row 0
   *                              - outputColumnName = <Compound reader column descriptor ex.
   * IMAGE>
   *                              - readPropertyValue ->  List of
   *                                                      FVDataBinding - Column-0
   *                                                         - outputColumnName = <Actual column
   *  0 name>
   *                                                         - readPropertyValue = <column value>
   *                                                      .
   *                                                      .
   *                                                      .
   *                                                      FVDataBinding - Column-N
   *                                                         - outputColumnName = <Actual column
   *  N name>
   *                                                         - readPropertyValue = <column value>
   *                           .
   *                           .
   *                           .
   *                           FVDataBinding - Row M
   *                              - outputColumnName = <Compound reader column descriptor ex.
   * IMAGE>
   *                              - readPropertyValue ->  List of
   *                                                      FVDataBinding - Column-0
   *                                                        - outputColumnName = <Actual column
   * 0 name>
   *                                                        - readPropertyValue = <column value>
   *
   *                                                      .
   *                                                      .
   *                                                      .
   *                                                      FVDataBinding - Column-N
   *                                                         - outputColumnName = <Actual column
   *  N name>
   *                                                         - readPropertyValue = <column value>
   *
   *
   *
   *  Note: Because not all properties will produce values for a column in multiple rows
   *        where there is no value a blank representative is inserted for missing property value.
   *        Reminder of formatting will be concluded in FVAbstractProducer where blank
   * representatives
   *        will be inserted to match the longest column in the compound read data.
   *
   */

  /**
   * @param o - input object
   * @return list of read values
   */
  public List<FVDataBinding> readPropertyFromObject(Object o) {
    DocumentModel doc = (DocumentModel) o;

    List<FVDataBinding> compoundOutput = new ArrayList<>();

    Object obj = doc.getPropertyValue(propertyToRead);

    if (obj instanceof String[]) {
      String[] list = (String[]) obj; // list of object to be de-referenced

      if (list.length != 0) {
        // checking if there are any present
        for (String guid : list) {
          DocumentModel refDoc = session.getDocument(new IdRef(guid));

          List<FVDataBinding> output = new ArrayList<>();

          if (refDoc == null) {
            throw new IllegalArgumentException("FVCompoundPropertyReader: Invalid document");
          }

          for (FVAbstractPropertyReader prop : compoundReaders) {
            List<FVDataBinding> listToAdd;

            try {
              listToAdd = prop.readPropertyFromObject(refDoc);
            } catch (Exception e) {
              listToAdd = propertyDoesNotExist(prop.columnNameForOutput);
            }

            output.addAll(listToAdd);
          }

          compoundOutput.add(createCompoundProperty(columnNameForOutput, output));
        }
      }
    }


    if (compoundOutput.isEmpty()) {
      compoundOutput.add(createCompoundProperty(columnNameForOutput, writeEmptyRow()));
    }

    return createCompoundListOutput(columnNameForOutput, compoundOutput);
  }

  /**
   * @return string list of all (actual) column names for properties which are a part of compound
   */
  @Override
  public StringList getColumnNameForOutput() {
    if (columns != null) {
      return columns;
    }

    columns = new StringList();

    for (FVDataBinding p : compound) {
      columns.add(p.outputColumnName);
    }

    return columns;
  }

  /**
   * FVCompoundPropertyReader has to generate its own list of readers
   */
  private void makeReaders() {
    if (!compoundReaders.isEmpty()) {
      return;
    }

    for (FVDataBinding pvc : compound) {
      try {
        ExportColumnRecord spec = specOwner.getSpec().getColumnExportRecord(pvc.getKey());
        FVAbstractPropertyReader instance = makePropertyReader(session, spec, specOwner);
        compoundReaders.add(instance);
      } catch (Exception e) {
        log.error(e);
      }
    }
  }

  // below are wrappers to prepare read property values for returning to producer
  private FVDataBinding createCompoundProperty(String colName, List<FVDataBinding> list) {
    return new FVDataBinding(colName, list);
  }

  private List<FVDataBinding> createCompoundListOutput(String colName, List<FVDataBinding> list) {
    List<FVDataBinding> compoundReturnOutput = new ArrayList<>();
    compoundReturnOutput.add(new FVDataBinding(colName, list));
    return compoundReturnOutput;
  }

}
