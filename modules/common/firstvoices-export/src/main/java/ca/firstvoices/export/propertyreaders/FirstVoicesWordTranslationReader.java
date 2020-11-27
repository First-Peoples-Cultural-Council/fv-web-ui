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
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public class FirstVoicesWordTranslationReader extends FVAbstractPropertyReader {

  public FirstVoicesWordTranslationReader(CoreSession session, ExportColumnRecord spec,
      FVAbstractProducer specOwner) {
    super(session, spec, specOwner);
  }

  public ReaderType readerType() {
    return ReaderType.WORD_TRANSLATION;
  }

  public List<FVDataBinding> readPropertyFromObject(Object o) {
    DocumentModel word = (DocumentModel) o;
    List<FVDataBinding> readValues = new ArrayList<>();

    Object prop = word.getPropertyValue(propertyToRead);
    Object[] colA = columns.toArray();

    if (prop instanceof List) {
      ArrayList<HashMap<String, String>> property = (ArrayList<HashMap<String, String>>) prop;
      int counter = 0;

      for (int i = 0; i < maxColumns; i++) {
        if (property.size() > i) {
          HashMap<String, String> map = property.get(counter);
          Collection<String> hashMapValues = map.values();
          Iterator<String> iter = hashMapValues.iterator();

          String output = iter.next();
          if (iter.hasNext()) {
            output = output + " (" + iter.next() + ")";
          }

          readValues.add(new FVDataBinding((String) colA[i], output));
        } else {
          readValues.add(new FVDataBinding((String) colA[i], " "));
        }

        counter++;
      }
    } else {
      if (prop != null && !(prop instanceof List)) {
        log.warn("FirstVoicesWordTranslationReader: incorrect type");
      }
      readValues = writeEmptyRow();
    }

    return readValues;
  }
}
