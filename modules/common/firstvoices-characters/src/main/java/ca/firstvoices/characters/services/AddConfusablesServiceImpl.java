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

import static ca.firstvoices.characters.listeners.CharacterListener.DISABLE_CHARACTER_LISTENER;

import ca.firstvoices.core.io.utils.SessionUtils;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.text.StringEscapeUtils;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IterableQueryResult;
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
    CharactersCoreService cs =
        Framework.getService(CharactersCoreService.class);

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

        DocumentModel alphabet = cs.getAlphabet(dialect.getCoreSession(), dialect);

        // Do a query for the alphabet characters that match the spreadsheet
        String query = "SELECT * FROM FVCharacter "
            + "WHERE ecm:parentId='" + alphabet.getId() + "' "
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
  public HashMap<String, HashSet<String>> getConfusablesFromAllDialects(CoreSession session,
      DocumentModel dialect, boolean processUpperCase) {
    CharactersCoreService cs =
        Framework.getService(CharactersCoreService.class);

    // Confusable map
    // key => lowercase or uppercase
    // value => list of confusables
    HashMap<String, HashSet<String>> confusables = new HashMap<>();

    DocumentModel alphabet = null;

    if (dialect != null) {
      alphabet = cs.getAlphabet(dialect.getCoreSession(), dialect);
    }

    // Grab all confusables across the site (except for current dialect)
    String query = String.format("SELECT "
        + "dc:title, "
        + "fvcharacter:confusable_characters/* "
        + "FROM FVCharacter "
        + "WHERE ecm:isTrashed = 0 "
        + "AND ecm:isProxy = 0 "
        + "AND ecm:isVersion = 0 "
        + "AND ecm:parentId <> '%s'", (alphabet == null) ? null : alphabet.getId());

    if (processUpperCase) {
      // Combining uppercase and lower case in one query will not return all the results
      // Due to some fields being null and not handled properly
      query = String.format("SELECT "
          + "fvcharacter:upper_case_character, "
          + "fvcharacter:upper_case_confusable_characters/* "
          + "FROM FVCharacter "
          + "WHERE ecm:isTrashed = 0 "
          + "AND ecm:isProxy = 0 "
          + "AND ecm:isVersion = 0 "
          + "AND ecm:parentId <> '%s'", (alphabet == null) ? null : alphabet.getId());
    }

    try (IterableQueryResult results = session
        .queryAndFetch(query, "NXQL")) {
      for (Map<String, Serializable> item : results) {
        String title =
            String.valueOf(item.get("dc:title"));
        String lowerCaseConfusable = StringEscapeUtils.unescapeJava(
            String.valueOf(item.get("fvcharacter:confusable_characters/*")));

        if (title != null) {
          if (confusables.containsKey(title)) {
            // Add to existing confusables list
            confusables.get(title).add(lowerCaseConfusable);
          } else {
            // Add to new list
            confusables.put(title, new HashSet<>(Collections.singletonList(lowerCaseConfusable)));
          }
        }

        if (item.get("fvcharacter:upper_case_character") != null) {
          String upperCase =
              String.valueOf(item.get("fvcharacter:upper_case_character"));
          String upperCaseConfusable = StringEscapeUtils.unescapeJava(
              String.valueOf(item.get("fvcharacter:upper_case_confusable_characters/*")));

          if (confusables.containsKey(upperCase)) {
            // Add to existing confusables list
            confusables.get(upperCase).add(upperCaseConfusable);
          } else {
            // Add to new list
            confusables.put(upperCase,
                new HashSet<>(Collections.singletonList(upperCaseConfusable)));
          }
        }
      }
    }

    return confusables;
  }

  @Override
  public void addConfusablesFromAllDialects(CoreSession session, DocumentModel dialect) {
    CharactersCoreService cs =
        Framework.getService(CharactersCoreService.class);

    HashMap<String, HashSet<String>> confusables =
        getConfusablesFromAllDialects(session, dialect, false);

    HashMap<String, HashSet<String>> uppercaseConfusables =
        getConfusablesFromAllDialects(session, dialect, true);

    confusables.putAll(uppercaseConfusables);

    DocumentModel alphabet = cs.getAlphabet(dialect.getCoreSession(), dialect);

    // Get all alphabet characters for the dialect
    String allCharactersQuery = String.format(
        "SELECT * FROM FVCharacter WHERE ecm:parentId='%s' "
        + "AND ecm:isProxy = 0 "
        + "AND ecm:isVersion = 0 "
        + "AND ecm:isTrashed = 0", alphabet.getId());

    DocumentModelList charactersDocs = session.query(allCharactersQuery);

    // Iterate over each alphabet character returned by the query
    for (DocumentModel doc : charactersDocs) {
      String charTitle = String.valueOf(doc.getPropertyValue("dc:title"));

      if (charTitle != null && confusables.containsKey(charTitle)) {
        // Update confusables for lowercase
        updateConfusableCharacters(session, doc, dialect,
            StringEscapeUtils.unescapeJava(charTitle),
            confusables.get(charTitle).toArray(new String[0]));
      }

      String upperCaseTitle =
          String.valueOf(doc.getPropertyValue("fvcharacter:upper_case_character"));

      if (upperCaseTitle != null && !upperCaseTitle.isEmpty()
          && confusables.containsKey(upperCaseTitle)) {
        // Update confusables for uppercase
        updateConfusableCharacters(session, doc, dialect,
            StringEscapeUtils.unescapeJava(upperCaseTitle),
            confusables.get(upperCaseTitle).toArray(new String[0]));
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

    return SessionUtils.saveDocumentWithoutEvents(session, characterDocument, true,
        Collections.singletonList(DISABLE_CHARACTER_LISTENER));
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
