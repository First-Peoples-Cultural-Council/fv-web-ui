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

public class FVBooleanPropertyReader extends FVAbstractPropertyReader {

  public FVBooleanPropertyReader(CoreSession session, ExportColumnRecord spec,
      FVAbstractProducer specOwner) {
    super(session, spec, specOwner);
  }

  public ReaderType readerType() {
    return ReaderType.BOOLEAN;
  }

  public List<FVDataBinding> readPropertyFromObject(Object o) {
    DocumentModel word = (DocumentModel) o;
    List<FVDataBinding> readValues = new ArrayList<>();
    Boolean prop = (Boolean) word.getPropertyValue(propertyToRead);

    if (prop == null) {
      prop = false;
    }

    String propertyValue = prop ? "true" : "false";

    readValues.add(new FVDataBinding(columnNameForOutput, propertyValue));

    return readValues;
  }
}
