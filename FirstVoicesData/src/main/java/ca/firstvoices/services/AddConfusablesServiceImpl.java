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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.text.StringEscapeUtils;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.directory.Session;
import org.nuxeo.ecm.directory.api.DirectoryService;
import org.nuxeo.runtime.api.Framework;

public class AddConfusablesServiceImpl implements AddConfusablesService {

  private static final Log log = LogFactory.getLog(AddConfusablesServiceImpl.class);

  @Override
  public void addConfusables(CoreSession session, DocumentModel dialect) {
    DirectoryService directoryService = Framework.getService(DirectoryService.class);
    try (Session directorySession = directoryService.open("confusable_characters")) {

      // Get all rows in the confusable_characters vocabulary
      DocumentModelList entries = directorySession.getEntries();

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
            + "AND dc:title='" + character + "' " + "AND fva:dialect='" + dialectUID + "' "
            + "AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";

        String upperCharacterQuery =
            "SELECT * FROM FVCharacter " + "WHERE fva:dialect='" + dialectUID + "' "
                + "AND fvcharacter:upper_case_character='" + character + "' "
                + "AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";

        DocumentModelList lowerCharDocs = session.query(query);
        DocumentModelList upperCharDocs = session.query(upperCharacterQuery);
        List<DocumentModel> charactersDocs = new ArrayList<>();
        charactersDocs.addAll(lowerCharDocs);
        charactersDocs.addAll(upperCharDocs);

        // Iterate over each alphabet character returned by the query
        for (DocumentModel doc : charactersDocs) {
          updateConfusableCharacters(session, doc, dialect, character, confusables);
        }
      }
    }
  }

  @Override
  public DocumentModel updateConfusableCharacters(CoreSession session,
      DocumentModel characterDocument, DocumentModel dialect, String characterToUpdate,
      String[] newConfusables) {
    String dialectName = dialect.getPropertyValue("dc:title").toString();

    // If a character was matched by title then update the lowercase confusable characters
    if (characterDocument.getPropertyValue("dc:title").equals(characterToUpdate)) {
      String[] existing = (String[]) characterDocument
          .getPropertyValue("fvcharacter:confusable_characters");
      if (existing != null) {
        ArrayList<String> newArrayList = new ArrayList<>(Arrays.asList(existing));
        characterDocument.setPropertyValue("fvcharacter:confusable_characters",
            getNewConfusables(existing, newConfusables));
        log.info(dialectName + ": Added " + Arrays.toString(newArrayList.toArray()) + " to "
            + characterToUpdate);
      } else {
        characterDocument.setPropertyValue("fvcharacter:confusable_characters", newConfusables);
        log.info(dialectName + ": Added " + Arrays.toString(newConfusables) + " to "
            + characterToUpdate);
      }
      // If a characterToUpdate was matched to an uppercase characterToUpdate
      // then update the uppercase confusable characters
    } else {
      String[] existing = (String[]) characterDocument
          .getPropertyValue("fvcharacter:upper_case_confusable_characters");
      if (existing != null) {
        ArrayList<String> newArrayList = new ArrayList<>(Arrays.asList(existing));
        characterDocument.setPropertyValue("fvcharacter:upper_case_confusable_characters",
            getNewConfusables(existing, newConfusables));
        log.info(dialectName + ": Added " + Arrays.toString(newArrayList.toArray()) + " to "
            + characterToUpdate);
      } else {
        characterDocument
            .setPropertyValue("fvcharacter:upper_case_confusable_characters", newConfusables);
        log.info(dialectName + ": Added " + Arrays.toString(newConfusables) + " to "
            + characterToUpdate);
      }
    }

    return session.saveDocument(characterDocument);
  }

  // Helper method to check existing confusables and only add new ones if they don't already exist
  private ArrayList<String> getNewConfusables(String[] existing, String[] confusables) {
    Set<String> set = new HashSet<>();
    set.addAll(Arrays.asList(existing));
    set.addAll(Arrays.asList(confusables));
    return new ArrayList<>(set);
  }

}
