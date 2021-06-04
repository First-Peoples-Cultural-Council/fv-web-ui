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

package ca.firstvoices.services;

import static ca.firstvoices.utils.FVRegistrationConstants.APPEND;
import static ca.firstvoices.utils.FVRegistrationConstants.REMOVE;
import static ca.firstvoices.utils.FVRegistrationConstants.UPDATE;
import ca.firstvoices.utils.FVRegistrationUtilities;
import java.util.ArrayList;
import java.util.List;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.DocumentModel;

public class FVUserGroupUpdateUtilities {

  /**
   * @param action
   * @param doc
   * @param data
   * @param schemaName
   * @param field
   */
  public static DocumentModel updateFVProperty(
      String action, DocumentModel doc, StringList data, String schemaName, String field) {
    List<String> arrayData = FVRegistrationUtilities.makeArrayFromStringList(data);

    if (!action.equals(UPDATE)) {
      ArrayList<String> property = (ArrayList<String>) doc.getProperty(schemaName, field);

      for (String g : arrayData) {
        switch (action) {
          case APPEND:
            property.add(g);
            break;
          case REMOVE:
            property.remove(g);
            break;
          default:
            break;
        }
      }

      arrayData = property;
    }

    doc.setProperty(schemaName, field, arrayData);

    return doc;
  }

  private FVUserGroupUpdateUtilities() {
    throw new IllegalStateException("Utility class");
  }
}
