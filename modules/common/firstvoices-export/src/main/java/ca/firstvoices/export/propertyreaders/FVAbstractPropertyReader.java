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

import ca.firstvoices.export.formatproducers.FVAbstractProducer;
import ca.firstvoices.export.utils.ExportColumnRecord;
import ca.firstvoices.export.workers.FVExportWorker;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;

public abstract class FVAbstractPropertyReader {

  protected static final Log log = LogFactory.getLog(FVExportWorker.class);
  public CoreSession session;
  protected StringList columns;
  protected ExportColumnRecord spec;

  protected String propertyToRead;

  protected String columnNameForOutput;

  protected Integer maxColumns;

  protected FVAbstractProducer specOwner;

  public FVAbstractPropertyReader(CoreSession session, ExportColumnRecord spec,
      FVAbstractProducer specOwner) {
    propertyToRead = spec.property;
    columnNameForOutput = spec.colID;
    maxColumns = spec.numCols;
    this.spec = spec;
    this.session = session;
    this.specOwner = specOwner;
  }

  public abstract ReaderType readerType();

  public abstract List<FVDataBinding> readPropertyFromObject(Object o);

  public Integer expectedColumnCount() {
    return maxColumns;
  }

  public String getPropertyToRead() {
    return propertyToRead;
  }

  public StringList getColumnNameForOutput() {
    if (columns != null) {
      return columns;
    }

    StringList output = new StringList();

    String modColumnName = columnNameForOutput;
    Integer counter = 1;

    for (Integer col = 0; col < maxColumns; col++) {
      output.add(modColumnName);
      modColumnName = columnNameForOutput + "_" + counter.toString();
      counter++;
    }

    columns = output;
    return output;
  }

  public List<FVDataBinding> writeEmptyRow() {
    List<FVDataBinding> output = new ArrayList<>();

    for (String col : columns) {
      output.add(new FVDataBinding(col, ""));
    }

    return output;
  }

  public List<FVDataBinding> propertyDoesNotExist(String columnName) {
    List<FVDataBinding> readValues = new ArrayList<>();

    readValues.add(new FVDataBinding(columnName, "Property is not entered"));

    return readValues;
  }

  public enum ReaderType {
    BOOLEAN, CATEGORY, COMPOUND, ID_PROP, SPEECH_PART, SIMPLE_LIST, WORD_TRANSLATION, PROPERTY
  }
}
