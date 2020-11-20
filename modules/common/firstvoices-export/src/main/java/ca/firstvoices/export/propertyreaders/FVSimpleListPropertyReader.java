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
import java.util.ArrayList;
import java.util.List;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

/*
 * FVSimpleListPropertyReader reads an array of strings which will be placed in multiple columns
 * The number of columns is specified in FVAbstractProducer.FirstVoicesCSVExportColumns spec.
 * FVAbstractProducer will generate additional columns for the property.
 * If there are more values than there are columns, additional values will not be displayed
 * If there are less values than there are columns, empty columns will be displayed
 *
 */
public class FVSimpleListPropertyReader extends FVAbstractPropertyReader {

  public FVSimpleListPropertyReader(CoreSession session, ExportColumnRecord spec,
      FVAbstractProducer specOwner) {
    super(session, spec, specOwner);
  }

  public ReaderType readerType() {
    return ReaderType.SIMPLE_LIST;
  }

  public List<FVDataBinding> readPropertyFromObject(Object o) {
    DocumentModel word = (DocumentModel) o;
    List<FVDataBinding> readValues = new ArrayList<>();

    Object prop = word.getPropertyValue(propertyToRead);
    Object[] colA = columns.toArray();

    if (prop != null) {
      if (prop instanceof String[]) {
        String[] stl = (String[]) prop;
        Integer stlCounter = -1; // stl - simple-type-list

        for (Integer c = 0; c < maxColumns; c++) {
          if (c < stl.length) {
            stlCounter++;
            readValues.add(new FVDataBinding((String) colA[c], stl[stlCounter]));
          } else {
            readValues.add(new FVDataBinding((String) colA[c], " "));
          }
        }
      } else {
        readValues = writeEmptyRow();
      }
    } else {
      readValues = writeEmptyRow();
    }

    return readValues;
  }
}
