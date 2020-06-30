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

import static ca.firstvoices.schemas.DomainTypesConstants.FV_DIALECT;

import java.util.ArrayList;
import java.util.Arrays;
import org.nuxeo.ecm.core.api.DocumentModel;

public abstract class AbstractFirstVoicesDataService {

  protected DocumentModel getDialect(DocumentModel doc) {
    if (FV_DIALECT.equals(doc.getType())) {
      return doc; // doc is dialect
    }
    DocumentModel parent = doc.getCoreSession().getParentDocument(doc.getRef());
    while (parent != null && !FV_DIALECT.equals(parent.getType())) {
      parent = doc.getCoreSession().getParentDocument(parent.getRef());
    }
    return parent;
  }

  protected ArrayList<String> getPropertyValueAsArray(DocumentModel input, String dependency) {

    ArrayList<String> propertyValueArray = new ArrayList<String>();

    try {
      String[] propertyValues = (String[]) input.getPropertyValue(dependency);

      if (propertyValues != null) {
        propertyValueArray = new ArrayList<String>(Arrays.asList(propertyValues));
      }
    } catch (ClassCastException e) {
      // Convert a string to a string array for simplicity
      propertyValueArray = new ArrayList<String>();
      propertyValueArray.add((String) input.getPropertyValue(dependency));
    }

    return propertyValueArray;
  }
}
