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

package ca.firstvoices.characters.services;

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_ALPHABET;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CHARACTER;

import ca.firstvoices.core.io.utils.DialectUtils;
import java.util.ArrayList;
import java.util.stream.Collectors;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

public class CharactersCoreServiceImpl implements CharactersCoreService {

  public static final String FV_CUSTOM_ORDER = "fv:custom_order";

  @Override
  public DocumentModelList getCharacters(CoreSession session,
      DocumentModel doc) {
    return getCharacters(session, doc, FV_CUSTOM_ORDER);
  }

  @Override
  public DocumentModelList getCharacters(CoreSession session,
      DocumentModel doc, String sortOrderField) {
    DocumentModel alphabet = getAlphabet(session, doc);

    String query = String.format("SELECT * "
        + " FROM %s"
        + " WHERE ecm:parentId='%s' "
        + " AND ecm:isTrashed = 0"
        + " AND ecm:isVersion = 0"
        + " ORDER BY %s ASC", FV_CHARACTER, alphabet.getId(), sortOrderField);

    return session.query(query);
  }

  @Override
  public ArrayList<String> getCustomOrderValues(CoreSession session, DocumentModel doc) {
    return getCharacterValues(session, doc, FV_CUSTOM_ORDER, FV_CUSTOM_ORDER);
  }

  public ArrayList<String> getCharacterValues(CoreSession session, DocumentModel doc,
      String valueToReturn, String sortOrder) {
    DocumentModelList charactersByCustomOrder =
        getCharacters(session, doc, sortOrder);

    return charactersByCustomOrder.stream()
        .map(character ->
            String.valueOf(character.getPropertyValue(valueToReturn)))
        .collect(Collectors.toCollection(ArrayList::new));
  }

  @Override
  public DocumentModel getAlphabet(CoreSession session,
      DocumentModel doc) {
    if (FV_ALPHABET.equals(doc.getType())) {
      return doc;
    }
    DocumentModel dialect = DialectUtils.getDialect(doc);
    if (dialect == null) {
      return null;
    }
    String alphabetQuery = "SELECT * FROM FVAlphabet WHERE ecm:ancestorId='" + dialect.getId()
        + "' AND ecm:isProxy = 0 AND ecm:isVersion = 0 AND ecm:isTrashed = 0";

    DocumentModelList results = session.query(alphabetQuery);

    return results.get(0);
  }
}
