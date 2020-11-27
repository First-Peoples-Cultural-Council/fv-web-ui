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
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;

public class FVCategoryPropertyReader extends FVAbstractPropertyReader {

  private static Log log = LogFactory.getLog(FVCategoryPropertyReader.class);

  public FVCategoryPropertyReader(CoreSession session, ExportColumnRecord spec,
      FVAbstractProducer specOwner) {
    super(session, spec, specOwner);
  }

  @Override
  public ReaderType readerType() {
    return ReaderType.CATEGORY;
  }

  @Override
  public List<FVDataBinding> readPropertyFromObject(Object o) {
    DocumentModel word = (DocumentModel) o;
    List<FVDataBinding> readValues = new ArrayList<>();
    Object[] categoryIds = (Object[]) word.getPropertyValue(propertyToRead);
    if (categoryIds == null) {
      log.warn("No category set on the word: " + word.getTitle());
      return writeEmptyRow();
    }

    Object[] colA = columns.toArray();
    // StringList categories = new StringList();

    int colCounter = 0;

    for (Object categoryId : categoryIds) {
      if (categoryId == null) {
        log.warn("Null Category in FVCategoryPropertyReader");
        readValues.add(new FVDataBinding((String) colA[colCounter], ""));
        colCounter++;
        continue;
      }

      try {
        if (!(categoryId instanceof String)) {
          throw new Exception("Wrong GUID type for category");
        }

        DocumentModel categoryDoc = session.getDocument(new IdRef((String) categoryId));

        readValues.add(new FVDataBinding((String) colA[colCounter], categoryDoc.getTitle()));
        colCounter++;
      } catch (Exception e) {
        log.warn("Null category document in FVCategoryPropertyReader.");
        readValues.add(new FVDataBinding((String) colA[colCounter], "Null category document"));
        colCounter++;
        log.error(e);
      }
    }

    for (; colCounter < maxColumns; colCounter++) {
      readValues.add(new FVDataBinding((String) colA[colCounter], ""));
    }

    return readValues;
  }

}
