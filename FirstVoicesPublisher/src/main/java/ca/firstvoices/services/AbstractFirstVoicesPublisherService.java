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

import org.nuxeo.ecm.core.api.*;

import java.util.Comparator;

public abstract class AbstractFirstVoicesPublisherService {

    protected DocumentModel[] loadAlphabet(CoreSession session, DocumentModel input) {
        DocumentModel dialect = getDialect(session, input);

        DocumentModelList chars = session.getChildren(new PathRef(dialect.getPathAsString() + "/Alphabet"));
        return chars
                .stream()
                .filter(character -> !character.isTrashed() && character.getPropertyValue("fvcharacter:alphabet_order") != null)
                .sorted(Comparator.comparing(d -> (Long) d.getPropertyValue("fvcharacter:alphabet_order")))
                .toArray(DocumentModel[]::new);
    }

    protected DocumentModel getDialect(DocumentModel doc) {
        return getDialect(doc.getCoreSession(), doc);
    }

    protected DocumentModel getDialect(CoreSession s, DocumentModel doc) {
        if ("FVDialect".equals(doc.getType())) {
            return doc; // doc is dialect
        }

        CoreSession coreSession = s;

        if (s == null) {
            coreSession = doc.getCoreSession();
        }

        DocumentRef parentRef = doc.getParentRef();
        DocumentModel parent = coreSession.getDocument(parentRef);
        if (parent != null) {
            return getDialect(coreSession, parent);
        } else {
            return null;
        }
    }
}
