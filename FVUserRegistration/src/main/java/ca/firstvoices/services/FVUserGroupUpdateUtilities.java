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

package ca.firstvoices.services;

import ca.firstvoices.utils.FVRegistrationUtilities;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.ArrayList;

import static ca.firstvoices.utils.FVRegistrationConstants.*;

public class FVUserGroupUpdateUtilities {

    /**
     * @param action
     * @param doc
     * @param data
     * @param schemaName
     * @param field
     */
    public static DocumentModel updateFVProperty(String action, DocumentModel doc, StringList data, String schemaName,
                                                 String field) {
        ArrayList<String> arrayData = FVRegistrationUtilities.makeArrayFromStringList(data);

        if (!action.equals(UPDATE)) {
            ArrayList<String> pA = (ArrayList<String>) doc.getProperty(schemaName, field);

            for (String g : arrayData) {
                switch (action) {
                    case APPEND:
                        pA.add(g);
                        break;
                    case REMOVE:
                        pA.remove(g);
                        break;
                }
            }

            arrayData = pA;
        }

        doc.setProperty(schemaName, field, arrayData);

        return doc;
    }
}
