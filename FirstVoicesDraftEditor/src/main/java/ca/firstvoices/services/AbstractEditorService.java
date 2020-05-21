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

import org.nuxeo.ecm.core.api.DocumentModel;

public abstract class AbstractEditorService {

  protected DocumentModel getDialect(DocumentModel doc) {
    DocumentModel parent = doc;
    while (parent != null && !"Root".equals(parent.getType()) && !"FVDialect"
        .equals(parent.getType())) {
      parent = doc.getCoreSession().getDocument(parent.getParentRef());
    }

    if ("Root".equals(parent.getType())) {
      return (null);
    } else {
      return parent;
    }

  }
}
