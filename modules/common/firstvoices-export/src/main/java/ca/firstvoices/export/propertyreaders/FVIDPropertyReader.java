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
import org.nuxeo.ecm.core.api.IdRef;

public class FVIDPropertyReader extends FVAbstractPropertyReader {

  public FVIDPropertyReader(CoreSession session, ExportColumnRecord spec,
      FVAbstractProducer specOwner) {
    super(session, spec, specOwner);
  }

  public ReaderType readerType() {
    return ReaderType.ID_PROP;
  }

  public List<FVDataBinding> readPropertyFromObject(Object o) {
    DocumentModel word = (DocumentModel) o;
    List<FVDataBinding> readValues = new ArrayList<>();
    Object prop = word.getPropertyValue(propertyToRead);

    if (prop != null) {
      String propertyValue = (String) prop;
      DocumentModel refDoc = session.getDocument(new IdRef(propertyValue));

      if (refDoc != null) {
        readValues.add(new FVDataBinding(columnNameForOutput, refDoc.getPropertyValue("dc:title")));
      } else {
        readValues.add(new FVDataBinding(columnNameForOutput, "Invalid UUID: " + propertyValue));
      }
    } else {
      readValues.add(new FVDataBinding(columnNameForOutput, " "));
    }

    return readValues;
  }
}
