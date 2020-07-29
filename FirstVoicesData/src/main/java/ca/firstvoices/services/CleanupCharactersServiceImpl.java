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

import static ca.firstvoices.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_WORD;

import ca.firstvoices.exceptions.FVCharacterInvalidException;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.apache.commons.text.StringEscapeUtils;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.PathRef;

public class CleanupCharactersServiceImpl extends AbstractFirstVoicesDataService implements
    CleanupCharactersService {

  private final String[] types = {FV_PHRASE, FV_WORD};
  private static final String DOCUMENT_TITLE = "dc:title";

  @Override
  public DocumentModel cleanConfusables(CoreSession session, DocumentModel document) {
    if (Arrays.stream(types).parallel()
        .noneMatch(document.getDocumentType().toString()::contains)) {
      return document;
    }

    DocumentModel dictionary = session.getDocument(document.getParentRef());
    DocumentModel dialect = session.getDocument(dictionary.getParentRef());
    DocumentModel alphabet = session
        .getDocument(new PathRef(dialect.getPathAsString() + "/Alphabet"));
    List<DocumentModel> characters = session.getChildren(alphabet.getRef());

    if (characters.size() == 0) {
      return document;
    }

    String propertyValue = (String) document.getPropertyValue(DOCUMENT_TITLE);

    characters = characters.stream().filter(c -> !c.isTrashed())
        .map(c -> c.getId().equals(document.getId()) ? document : c).collect(Collectors.toList());

    if (propertyValue != null) {
      Map<String, String> confusables = mapAndValidateConfusableCharacters(characters);
      String updatedPropertyValue = replaceConfusables(confusables, "", propertyValue);
      if (!updatedPropertyValue.equals(propertyValue)) {
        document.setPropertyValue(DOCUMENT_TITLE, updatedPropertyValue);
      }
    }
    document.setPropertyValue("fv:update_confusables_required", false);
    return session.saveDocument(document);
  }

  @Override
  //Keeping method as it is used elsewhere in cleanConfusables
  public Map<String, String> mapAndValidateConfusableCharacters(List<DocumentModel> characters)
      throws FVCharacterInvalidException {
    Map<String, String> confusables = new HashMap<>();
    List<String> characterValues = characters.stream().filter(c -> !c.isTrashed())
        .map(c -> (String) c.getPropertyValue(DOCUMENT_TITLE)).collect(Collectors.toList());
    for (DocumentModel d : characters) {
      String[] lowercaseConfusableList = (String[]) d
          .getPropertyValue("fvcharacter:confusable_characters");
      String[] uppercaseConfusableList = (String[]) d
          .getPropertyValue("fvcharacter:upper_case_confusable_characters");
      if (lowercaseConfusableList != null) {
        for (String confusableCharacter : lowercaseConfusableList) {
          String characterTitle = (String) d.getPropertyValue(DOCUMENT_TITLE);
          if (confusables.put(confusableCharacter, characterTitle) != null) {
            throw new FVCharacterInvalidException(
                "Can't have confusable character " + confusableCharacter + " on " + characterTitle
                    + " as it is mapped as a confusable character to another alphabet character.",
                400);
          }
          if (confusables.containsKey(characterTitle)) {
            throw new FVCharacterInvalidException(
                "Can't have confusable character " + confusableCharacter + " on " + characterTitle
                    + " as it is mapped as a confusable character to another alphabet character.",
                400);
          }
          if (characterValues.contains(confusableCharacter)) {
            throw new FVCharacterInvalidException(
                "Can't have confusable character " + confusableCharacter + " on " + characterTitle
                    + "as it is found in the dialect's alphabet.", 400);
          }
        }
      }
      if (uppercaseConfusableList != null) {
        for (String confusableCharacter : uppercaseConfusableList) {
          String characterTitle = (String) d.getPropertyValue("fvcharacter:upper_case_character");
          if (characterTitle.equals("")) {
            throw new FVCharacterInvalidException(
                "Can't have uppercase confusable character if there is no uppercase character.",
                400);
          }
          if (confusables.put(confusableCharacter, characterTitle) != null) {
            throw new FVCharacterInvalidException(
                "Can't have confusable character " + confusableCharacter + " on uppercase"
                    + characterTitle
                    + " as it is mapped as a confusable character to another alphabet character.",
                400);
          }
          if (confusables.containsKey(characterTitle)) {
            throw new FVCharacterInvalidException(
                "Can't have confusable character " + confusableCharacter + " on uppercase"
                    + characterTitle
                    + " as it is mapped as a confusable character to another alphabet character.",
                400);
          }
          if (characterValues.contains(confusableCharacter)) {
            throw new FVCharacterInvalidException(
                "Can't have confusable character " + confusableCharacter + " on uppercase"
                    + characterTitle + " as it is found in the dialect's alphabet.", 400);
          }
        }
      }
    }
    return confusables;
  }

  @Override
  public boolean validateCharacters(List<DocumentModel> filteredCharacters,
      DocumentModel alphabet, DocumentModel updated) {
    //This method only covers characters, alphabet is covered separately

    //confirm that the updated document's
    //lower case char, upper case char, lower confusable list and upper confusable list are unique
    Set<String> updatedDocumentCharacters = new HashSet<>();

    boolean lower = updatedDocumentCharacters
        .add((String) updated.getPropertyValue(DOCUMENT_TITLE));
    boolean upper = updatedDocumentCharacters
        .add((String) updated.getPropertyValue("fvcharacter:upper_case_character"));

    //must loop through each confusable individually
    //as addAll would return true if the confusable string list had duplicates AND new values
    boolean lowerConfusable = false;
    String[] lowerConfusableStrArr = (String[]) updated
        .getPropertyValue("fvcharacter:confusable_characters");
    if (lowerConfusableStrArr != null) {
      for (String str : lowerConfusableStrArr) {
        boolean unique = updatedDocumentCharacters.add(str);
        if (!unique) {
          lowerConfusable = false;
          break;
        } else {
          lowerConfusable = true;
        }
      }
    } else {
      lowerConfusable = true;
    }

    boolean upperConfusable = false;
    String[] upperConfusableStrArr = (String[]) updated
        .getPropertyValue("fvcharacter:upper_case_confusable_characters");
    if (upperConfusableStrArr != null) {
      for (String str : upperConfusableStrArr) {
        boolean unique = updatedDocumentCharacters.add(str);
        if (!unique) {
          upperConfusable = false;
          break;
        } else {
          upperConfusable = true;
        }
      }
    } else {
      upperConfusable = true;
    }

    if (!(lower && upper && lowerConfusable && upperConfusable)) {
      throw new FVCharacterInvalidException(
          "A character is duplicated somewhere in this document's uppercase, "
              + "lowercase or confusable characters ",
          400);
    }

    //Updated character is validated internally, check all other characters
    Set<String> collectedCharacters = createCharacterHashMap(filteredCharacters);

    if (alphabet
        .getPropertyValue("fv-alphabet:ignored_characters") != null) {
      collectedCharacters.addAll(Arrays.asList((String[]) alphabet
          .getPropertyValue("fv-alphabet:ignored_characters")));
    }

    //Confirm that updated character set is unique from all other characters
    boolean setsUnique = Collections.disjoint(updatedDocumentCharacters, collectedCharacters);
    if (!setsUnique) {
      throw new FVCharacterInvalidException(
          "The updated character includes a duplicate character "
              + "found in another character document",
          400);
    }

    return true;
  }

  @Override
  public boolean validateAlphabetIgnoredCharacters(List<DocumentModel> characters,
      DocumentModel alphabet) {
    //This method only covers alphabets, characters are covered separately

    Set<String> collectedCharacters = createCharacterHashMap(characters);

    boolean ignoredCharsUnique = false;
    String[] ignoredCharsArr = (String[]) alphabet
        .getPropertyValue("fv-alphabet:ignored_characters");
    if (ignoredCharsArr != null) {
      for (String str : ignoredCharsArr) {
        boolean unique = collectedCharacters.add(str);
        if (!unique) {
          ignoredCharsUnique = false;
          break;
        } else {
          ignoredCharsUnique = true;
        }
      }
    } else {
      ignoredCharsUnique = true;
    }

    if (!ignoredCharsUnique) {
      throw new FVCharacterInvalidException(
          "The ignored characters list includes a duplicate character "
              + "found in another character document",
          400);
    }
    return true;
  }

  private Set<String> createCharacterHashMap(List<DocumentModel> characters) {
    Set<String> collectedCharacters = new HashSet<>();

    for (DocumentModel d : characters) {
      collectedCharacters.add((String) d.getPropertyValue(DOCUMENT_TITLE));
      collectedCharacters.add((String) d.getPropertyValue("fvcharacter:upper_case_character"));

      if (d
          .getPropertyValue("fvcharacter:confusable_characters") != null) {
        collectedCharacters.addAll(Arrays.asList((String[]) d
            .getPropertyValue("fvcharacter:confusable_characters")));
      }
      if (d
          .getPropertyValue("fvcharacter:upper_case_confusable_characters") != null) {
        collectedCharacters.addAll(Arrays.asList((String[]) d
            .getPropertyValue("fvcharacter:upper_case_confusable_characters")));
      }

    }

    return collectedCharacters;
  }


  private String replaceConfusables(Map<String, String> confusables, String current,
      String updatedPropertyValue) {
    if (updatedPropertyValue.length() == 0) {
      return current;
    }

    for (Map.Entry<String, String> entry : confusables.entrySet()) {
      String k = StringEscapeUtils.unescapeJava(entry.getKey());
      String v = entry.getValue();
      if (updatedPropertyValue.startsWith(k)) {
        return replaceConfusables(confusables, current + v,
            updatedPropertyValue.substring(k.length()));
      }
    }

    char charAt = updatedPropertyValue.charAt(0);

    return replaceConfusables(confusables, current + charAt, updatedPropertyValue.substring(1));
  }

}
