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

import ca.firstvoices.core.io.utils.SessionUtils;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.text.StringEscapeUtils;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.model.Property;
import org.nuxeo.ecm.core.api.model.impl.ArrayProperty;
import org.nuxeo.ecm.directory.Session;
import org.nuxeo.ecm.directory.api.DirectoryService;
import org.nuxeo.runtime.api.Framework;

public class AddConfusablesServiceImpl implements AddConfusablesService {

  private static final Log log = LogFactory.getLog(AddConfusablesServiceImpl.class);
  private final CleanupCharactersService cleanupCharactersService = Framework
      .getService(CleanupCharactersService.class);

  @Override
  public void addConfusables(CoreSession session, DocumentModel dialect) {
    DirectoryService directoryService = Framework.getService(DirectoryService.class);
    try (Session directorySession = directoryService.open("confusable_characters")) {

      // Get all rows in the confusable_characters vocabulary
      DocumentModelList entries = directorySession.query(Collections.emptyMap());

      // Iterate through each entry
      for (DocumentModel entry : entries) {
        // Get the character unicode of the entry
        String character = StringEscapeUtils.unescapeJava(entry.getPropertyValue("id").toString());

        // Get the confusable unicode value(s) as an array
        String[] confusables = Arrays
            .stream(entry.getPropertyValue("confusable_unicode").toString().split(","))
            .map(StringEscapeUtils::unescapeJava).toArray(String[]::new);

        String dialectUID = dialect.getId();

        // Do a query for the alphabet characters that match the spreadsheet
        String query = "SELECT * FROM FVCharacter " + "WHERE fva:dialect='" + dialectUID + "' "
            + "AND (dc:title='" + character + "' OR fvcharacter:upper_case_character='" + character
            + "') AND ecm:isProxy = 0 AND ecm:isVersion = 0 AND ecm:isTrashed = 0";

        DocumentModelList charactersDocs = session.query(query);

        // Iterate over each alphabet character returned by the query
        for (DocumentModel doc : charactersDocs) {
          // Update confusables
          updateConfusableCharacters(session, doc, dialect, character, confusables);
        }
      }
    }
  }

  @Override
  public DocumentModel updateConfusableCharacters(CoreSession session,
      DocumentModel characterDocument, DocumentModel dialect, String characterToUpdate,
      String[] newConfusables) {

    //Map used to validate confusables
    Set<String> charactersToSkip = cleanupCharactersService
        .getCharactersToSkipForDialect(dialect);

    String dialectName = dialect.getPropertyValue("dc:title").toString();

    Property characterTitle = characterDocument.getProperty("dc:title");

    // If a character was matched by title then update the lowercase confusable characters
    if (characterToUpdate.equals(characterTitle.getValue())) {

      ArrayProperty lcConfusableCharactersProp = (ArrayProperty) characterDocument
          .getProperty("fvcharacter:confusable_characters");

      String[] existing = (String[]) lcConfusableCharactersProp.getValue();
      if (existing != null) {
        String[] confusablesToAdd = validatedConfusables(charactersToSkip,
            getNewConfusables(existing, newConfusables));
        String[] combinedList = ArrayUtils.addAll(existing, confusablesToAdd);
        lcConfusableCharactersProp.setValue((Serializable) combinedList);
        log.info(dialectName + ": Added " + Arrays.toString(confusablesToAdd)
            + " to "
            + characterToUpdate);
      } else {
        String[] confusablesToAdd = validatedConfusables(charactersToSkip,
            newConfusables);
        lcConfusableCharactersProp.setValue(confusablesToAdd);
        log.info(dialectName + ": Added " + Arrays.toString(confusablesToAdd) + " to "
            + characterToUpdate);
      }
      // If a characterToUpdate was matched to an uppercase characterToUpdate
      // then update the uppercase confusable characters
    } else {
      ArrayProperty ucConfusableCharactersProp = (ArrayProperty) characterDocument
          .getProperty("fvcharacter:upper_case_confusable_characters");

      String[] existing = (String[]) ucConfusableCharactersProp.getValue();

      if (existing != null) {
        String[] confusablesToAdd = validatedConfusables(charactersToSkip,
            getNewConfusables(existing, newConfusables));

        String[] combinedList = ArrayUtils.addAll(existing, confusablesToAdd);
        ucConfusableCharactersProp.setValue((Serializable) combinedList);

        log.info(dialectName + ": Added " + Arrays.toString(confusablesToAdd) + " to "
            + characterToUpdate);
      } else {
        String[] confusablesToAdd = validatedConfusables(charactersToSkip,
            newConfusables);

        ucConfusableCharactersProp.setValue(confusablesToAdd);

        log.info(dialectName + ": Added " + Arrays.toString(confusablesToAdd) + " to "
            + characterToUpdate);
      }
    }

    return SessionUtils.saveDocumentWithoutEvents(session, characterDocument, true, null);
  }

  // Helper method to check existing confusables and only add new ones if they don't already exist
  private String[] getNewConfusables(String[] existing, String[] confusables) {
    Set<String> set = new HashSet<>();
    set.addAll(Arrays.asList(existing));
    set.addAll(Arrays.asList(confusables));
    ArrayList<String> newConfusables = new ArrayList<>(set);

    return newConfusables.toArray(new String[0]);
  }

  //Helper method that ensures the added confusables are not duplicates or included in the alphabet
  private String[] validatedConfusables(Set<String> validationMap,
      String[] confusablesToAdd) {
    ArrayList<String> validatedConfusables = new ArrayList<>();
    for (String confusable : confusablesToAdd) {
      if (!validationMap.contains(confusable)) {
        validatedConfusables.add(confusable);
      }
    }

    return validatedConfusables.toArray(new String[0]);
  }

}
