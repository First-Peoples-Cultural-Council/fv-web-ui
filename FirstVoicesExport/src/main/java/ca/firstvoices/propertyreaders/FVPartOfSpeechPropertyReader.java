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

package ca.firstvoices.propertyreaders;

import ca.firstvoices.formatproducers.FVAbstractProducer;
import ca.firstvoices.utils.ExportColumnRecord;
import java.util.ArrayList;
import java.util.List;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public class FVPartOfSpeechPropertyReader extends FVAbstractPropertyReader {

  public FVPartOfSpeechPropertyReader(CoreSession session, ExportColumnRecord spec,
      FVAbstractProducer specOwner) {
    super(session, spec, specOwner);
  }

  public ReaderType readerType() {
    return ReaderType.SPEECH_PART;
  }

  public List<FVDataBinding> readPropertyFromObject(Object o) {
    DocumentModel word = (DocumentModel) o;
    List<FVDataBinding> readValues = new ArrayList<>();
    Object prop = word.getPropertyValue(propertyToRead);

    if (prop != null) {
      if (prop instanceof String) {
        readValues.add(new FVDataBinding(columnNameForOutput, prop));
      } else {
        readValues.add(new FVDataBinding(columnNameForOutput, "unknown instance"));
      }
    } else {
      readValues.add(new FVDataBinding(columnNameForOutput, ""));
    }

    return readValues;
  }
}
