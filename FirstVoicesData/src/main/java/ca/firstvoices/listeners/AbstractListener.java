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

package ca.firstvoices.listeners;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;

public abstract class AbstractListener implements EventListener {
    protected DocumentModel getDialect(DocumentModel doc) {
        CoreSession session = doc.getCoreSession();
        if ("FVDialect".equals(doc.getType())) {
            return doc; // doc is dialect
        }
        DocumentModel parent = session.getDocument(doc.getParentRef());
        while (parent != null && !"FVDialect".equals(parent.getType())) {
            parent = session.getDocument(parent.getParentRef());
        }
        return parent;
    }

    protected DocumentModel getAlphabet(DocumentModel doc) {
        if("FVAlphabet".equals(doc.getType())) {
            return doc;
        }
        DocumentModel dialect = getDialect(doc);
        if (dialect == null) {
            return null;
        }
        return doc.getCoreSession().getDocument(new PathRef(dialect.getPathAsString() + "/Alphabet"));
    }

    protected DocumentModelList getCharacters(DocumentModel doc) {
        DocumentModel alphabet = getAlphabet(doc);
        return doc.getCoreSession().getChildren(alphabet.getRef());
    }

    protected void rollBackEvent(Event event) {
        event.markBubbleException();
        event.markRollBack();
    }
}
