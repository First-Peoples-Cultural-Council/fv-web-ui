/*
 *
 * Copyright 2020 First People's Cultural Council
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * /
 */

package ca.firstvoices.property_readers;

import ca.firstvoices.format_producers.FV_AbstractProducer;
import ca.firstvoices.utils.ExportColumnRecord;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.ArrayList;
import java.util.List;

public class FV_PropertyReader extends FV_AbstractPropertyReader {

    public FV_PropertyReader(CoreSession session, ExportColumnRecord spec, FV_AbstractProducer specOwner) {
        super(session, spec, specOwner);
    }

    public ReaderType readerType() {
        return ReaderType.PROPERTY;
    }

    public List<FV_DataBinding> readPropertyFromObject(Object o) {
        DocumentModel word = (DocumentModel) o;
        List<FV_DataBinding> readValues = new ArrayList<>();
        Object prop = word.getPropertyValue(propertyToRead);

        if (prop != null) {
            String propertyValue = (String) prop;

            readValues.add(new FV_DataBinding(columnNameForOutput, propertyValue));
        } else {
            readValues.add(new FV_DataBinding(columnNameForOutput, " "));
        }

        return readValues;
    }

}
