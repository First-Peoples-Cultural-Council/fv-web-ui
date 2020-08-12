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

package ca.firstvoices.listeners;

import static ca.firstvoices.schemas.DialectTypesConstants.FV_ALPHABET;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_CHARACTER;
import static ca.firstvoices.schemas.DomainTypesConstants.FV_DIALECT;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.Filter;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;

public abstract class AbstractFirstVoicesDataListener implements EventListener {

  protected DocumentModel getDialect(DocumentModel doc) {
    CoreSession session = doc.getCoreSession();
    if (FV_DIALECT.equals(doc.getType())) {
      return doc; // doc is dialect
    }
    DocumentModel parent = session.getDocument(doc.getParentRef());
    while (parent != null && !FV_DIALECT.equals(parent.getType())) {
      parent = session.getDocument(parent.getParentRef());
    }
    return parent;
  }

  protected DocumentModel getAlphabet(DocumentModel doc) {
    if (FV_ALPHABET.equals(doc.getType())) {
      return doc;
    }
    DocumentModel dialect = getDialect(doc);
    if (dialect == null) {
      return null;
    }
    String alphabetQuery = "SELECT * FROM FVAlphabet WHERE ecm:ancestorId='" + dialect.getId()
        + "' AND ecm:isProxy = 0 AND ecm:isVersion = 0 AND ecm:isTrashed = 0";

    DocumentModelList results = doc.getCoreSession().query(alphabetQuery);

    return results.get(0);
  }

  protected DocumentModelList getCharacters(DocumentModel doc) {
    DocumentModel alphabet = getAlphabet(doc);
    //Alphabet must not be null
    assert alphabet != null;
    Filter trashedFilter = docModel -> !docModel.isTrashed();
    return doc.getCoreSession().getChildren(alphabet.getRef(), FV_CHARACTER, trashedFilter, null);
  }

  protected void rollBackEvent(Event event) {
    event.markBubbleException();
    event.markRollBack();
  }
}
