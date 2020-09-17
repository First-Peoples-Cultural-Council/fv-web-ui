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
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;

import ca.firstvoices.characters.exceptions.FVCharacterInvalidException;
import ca.firstvoices.characters.listeners.AssetListener;
import ca.firstvoices.core.io.utils.DialectUtils;
import ca.firstvoices.core.io.utils.PropertyUtils;
import ca.firstvoices.core.io.utils.SessionUtils;
import ca.firstvoices.core.io.utils.filters.NotTrashedFilter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.text.StringEscapeUtils;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.Filter;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.runtime.api.Framework;

public class CleanupCharactersServiceImpl implements CleanupCharactersService {

  //In the future, all dublincore (and other schema) property values
  //should be kept in a constants file in FVData.
  private static final String DOCUMENT_TITLE = "dc:title";
  public static final String LC_CONFUSABLES = "fvcharacter:confusable_characters";
  public static final String UC_CONFUSABLES = "fvcharacter:upper_case_confusable_characters";
  private static final String DEFAULT_WARNING = "Can't have confusable character ";

  private final String[] types = {FV_PHRASE, FV_WORD};

  @Override
  public DocumentModel cleanConfusables(CoreSession session, DocumentModel document,
      Boolean saveDocument) {
    if (Arrays.stream(types).parallel()
        .noneMatch(document.getDocumentType().toString()::contains)) {
      return document;
    }

    DocumentModel dictionary = session.getDocument(document.getParentRef());
    DocumentModel dialect = session.getDocument(dictionary.getParentRef());

    List<DocumentModel> characters = getCharacters(dialect);

    if (characters.isEmpty()) {
      return document;
    }

    String propertyValue = (String) document.getPropertyValue(DOCUMENT_TITLE);

    // Ensure lambda uses final document
    DocumentModel filterDocument = document;

    characters = characters.stream()
        .map(c -> c.getId().equals(filterDocument.getId()) ? filterDocument : c)
        .collect(Collectors.toList());

    if (propertyValue != null) {
      Map<String, String> confusables = mapAndValidateConfusableCharacters(characters);
      String updatedPropertyValue = replaceConfusables(confusables, "", propertyValue);
      if (!updatedPropertyValue.equals(propertyValue)) {
        document.setPropertyValue(DOCUMENT_TITLE, updatedPropertyValue);
      }
    }

    // We can recompute the custom order on the asset here
    // to avoid recomputing the entire dialect
    CustomOrderComputeService customOrderComputeService =
        Framework.getService(CustomOrderComputeService.class);

    document = customOrderComputeService
        .computeAssetNativeOrderTranslation(session, document, false, false);

    if (Boolean.TRUE.equals(saveDocument)) {
      SessionUtils.saveDocumentWithoutEvents(session, document,
          true, Collections.singletonList(AssetListener.DISABLE_CHAR_ASSET_LISTENER));

      return session.saveDocument(document);
    }

    return document;
  }

  //Helper method for cleanConfusables
  private Map<String, String> mapAndValidateConfusableCharacters(List<DocumentModel> characters) {

    Map<String, String> confusables = new HashMap<>();

    for (DocumentModel character : characters) {
      confusables.putAll(validateConfusableCharacter(character, characters));
    }
    return confusables;
  }

  public Map<String, String> validateConfusableCharacter(DocumentModel character,
      List<DocumentModel> characters) {

    Map<String, String> confusables = new HashMap<>();

    List<String> characterValues = characters.stream()
        .map(c -> (String) c.getPropertyValue(DOCUMENT_TITLE)).collect(Collectors.toList());

    for (String confusableCharacter : PropertyUtils.getValuesAsList(character, LC_CONFUSABLES)) {
      String characterTitle = (String) character.getPropertyValue(DOCUMENT_TITLE);
      if (confusables.put(confusableCharacter, characterTitle) != null) {
        throw new FVCharacterInvalidException(
            DEFAULT_WARNING + confusableCharacter + " on " + characterTitle
                + " as it is mapped as a confusable character to another alphabet character.",
            400);
      }
      if (confusables.containsKey(characterTitle)) {
        throw new FVCharacterInvalidException(
            DEFAULT_WARNING + confusableCharacter + " on " + characterTitle
                + " as it is mapped as a confusable character to another alphabet character.",
            400);
      }
      if (characterValues.contains(confusableCharacter)) {
        throw new FVCharacterInvalidException(
            DEFAULT_WARNING + confusableCharacter + " on " + characterTitle
                + "as it is found in the dialect's alphabet.", 400);
      }
    }

    for (String confusableCharacter : PropertyUtils.getValuesAsList(character, UC_CONFUSABLES)) {
      String characterTitle = (String) character
          .getPropertyValue("fvcharacter:upper_case_character");
      if (StringUtils.isEmpty(characterTitle)) {
        throw new FVCharacterInvalidException(
            "Can't have uppercase confusable character if there is no uppercase character.",
            400);
      }
      if (confusables.put(confusableCharacter, characterTitle) != null) {
        throw new FVCharacterInvalidException(
            DEFAULT_WARNING + confusableCharacter + " on uppercase"
                + characterTitle
                + " as it is mapped as a confusable character to another alphabet character.",
            400);
      }
      if (confusables.containsKey(characterTitle)) {
        throw new FVCharacterInvalidException(
            DEFAULT_WARNING + confusableCharacter + " on uppercase"
                + characterTitle
                + " as it is mapped as a confusable character to another alphabet character.",
            400);
      }
      if (characterValues.contains(confusableCharacter)) {
        throw new FVCharacterInvalidException(
            DEFAULT_WARNING + confusableCharacter + " on uppercase"
                + characterTitle + " as it is found in the dialect's alphabet.", 400);
      }
    }

    return confusables;
  }

  @Override
  public void validateCharacters(List<DocumentModel> filteredCharacters,
      DocumentModel alphabet, DocumentModel updated) {
    //This method only covers characters, alphabet is covered separately

    //confirm that the updated document's
    //lower case char, upper case char, lower confusable list and upper confusable list are unique
    Set<String> updatedDocumentCharacters = new HashSet<>();

    String docTitle = (String) updated.getPropertyValue(DOCUMENT_TITLE);
    if (docTitle != null) {
      updatedDocumentCharacters.add(docTitle);
    }

    String upperChar = (String) updated.getPropertyValue("fvcharacter:upper_case_character");
    if (upperChar != null) {
      updatedDocumentCharacters.add(upperChar);
    }

    //must loop through each confusable individually
    //as addAll would return true if the confusable string list had duplicates AND new values
    ArrayList<String> allConfusables = new ArrayList<>();
    allConfusables.addAll(PropertyUtils.getValuesAsList(updated, LC_CONFUSABLES));
    allConfusables.addAll(PropertyUtils.getValuesAsList(updated, UC_CONFUSABLES));

    for (String str : allConfusables) {
      if (!updatedDocumentCharacters.add(str)) {
        throw new FVCharacterInvalidException(
            "The character " + str + " is duplicated somewhere in this document's uppercase,"
                + "lowercase or confusable characters ",
            400);
      }
    }

    //Updated character is validated internally, check all other characters
    Set<String> collectedCharacters = createCharacterHashMap(filteredCharacters);

    String[] ignoredCharacters = (String[]) alphabet
        .getPropertyValue("fv-alphabet:ignored_characters");
    if (ignoredCharacters != null) {
      collectedCharacters.addAll(Arrays.asList(ignoredCharacters));
    }

    String updatedCharacterSet = String.join(",", updatedDocumentCharacters);
    String collectedCharacterSet = String.join(",", collectedCharacters);
    //Confirm that updated character set is unique from all other characters
    if (!Collections.disjoint(updatedDocumentCharacters, collectedCharacters)) {
      throw new FVCharacterInvalidException(
          "The updated character set:\n" + updatedCharacterSet + "\nincludes a duplicate character"
              + " found in the character set:\n" + collectedCharacterSet,
          400);
    }
  }

  @Override
  public Set<String> getCharactersToSkipForDialect(DocumentModel dialect) {
    DocumentModelList characters = getCharacters(dialect);
    DocumentModel alphabet = getAlphabet(dialect);
    //Alphabet must not be null.
    assert alphabet != null;

    Set<String> charactersToSkip = createCharacterHashMap(characters);
    String[] ignoredCharacters = (String[]) alphabet
        .getPropertyValue("fv-alphabet:ignored_characters");
    if (ignoredCharacters != null) {
      charactersToSkip.addAll(Arrays.asList(ignoredCharacters));
    }

    return charactersToSkip;
  }

  @Override
  public void validateAlphabetIgnoredCharacters(List<DocumentModel> characters,
      DocumentModel alphabet) {
    //This method only covers alphabets, characters are covered separately
    Set<String> collectedCharacters = createCharacterHashMap(characters);

    String[] ignoredCharsArr = (String[]) alphabet
        .getPropertyValue("fv-alphabet:ignored_characters");

    if (ignoredCharsArr != null) {
      for (String str : ignoredCharsArr) {
        if (!collectedCharacters.add(str)) {
          throw new FVCharacterInvalidException(
              "The ignored character " + str + " is a duplicate character "
                  + "found in another character document",
              400);
        }
      }
    }
  }

  private Set<String> createCharacterHashMap(List<DocumentModel> characters) {
    Set<String> collectedCharacters = new HashSet<>();

    for (DocumentModel d : characters) {
      String docTitle = (String) d.getPropertyValue(DOCUMENT_TITLE);
      if (docTitle != null) {
        collectedCharacters.add(docTitle);
      }

      String upperChar = (String) d.getPropertyValue("fvcharacter:upper_case_character");
      if (upperChar != null) {
        collectedCharacters.add(upperChar);
      }

      String[] lowerConfusablesArr = (String[]) d.getPropertyValue(LC_CONFUSABLES);
      if (lowerConfusablesArr != null) {
        collectedCharacters.addAll(Arrays.asList(lowerConfusablesArr));
      }

      String[] upperConfusablesArr = (String[]) d.getPropertyValue(UC_CONFUSABLES);
      if (upperConfusablesArr != null) {
        collectedCharacters.addAll(Arrays.asList(upperConfusablesArr));
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

  public DocumentModel getAlphabet(DocumentModel doc) {
    if (FV_ALPHABET.equals(doc.getType())) {
      return doc;
    }
    DocumentModel dialect = DialectUtils.getDialect(doc);
    if (dialect == null) {
      return null;
    }
    String alphabetQuery = "SELECT * FROM FVAlphabet WHERE ecm:ancestorId='" + dialect.getId()
        + "' AND ecm:isProxy = 0 AND ecm:isVersion = 0 AND ecm:isTrashed = 0";

    DocumentModelList results = doc.getCoreSession().query(alphabetQuery);

    return results.get(0);
  }

  public DocumentModelList getCharacters(DocumentModel doc) {
    DocumentModel alphabet = getAlphabet(doc);
    //Alphabet must not be null
    assert alphabet != null;
    return doc.getCoreSession()
        .getChildren(alphabet.getRef(), FV_CHARACTER, new NotTrashedFilter(), null);
  }

  public DocumentModelList getCharactersWithConfusables(DocumentModel doc) {
    DocumentModel alphabet = getAlphabet(doc);
    assert alphabet != null;
    Filter hasConfusableFilter = docModel -> !docModel.isTrashed() && hasConfusableCharacters(
        docModel);
    return doc.getCoreSession()
        .getChildren(alphabet.getRef(), FV_CHARACTER, hasConfusableFilter, null);
  }

  private List<String> getAllLCConfusables(DocumentModel doc) {

    return getCharactersWithConfusables(doc).stream()
        .flatMap(charDoc ->
            (charDoc.getPropertyValue(LC_CONFUSABLES) == null) ? Stream
                .empty() : Arrays.stream((String[]) charDoc.getPropertyValue(LC_CONFUSABLES)))
        .collect(Collectors.toList());
  }

  private List<String> getAllUCConfusables(DocumentModel doc) {

    return getCharactersWithConfusables(doc).stream()
        .flatMap(charDoc ->
            (charDoc.getPropertyValue(UC_CONFUSABLES) == null) ? Stream
                .empty() : Arrays.stream((String[]) charDoc.getPropertyValue(UC_CONFUSABLES)))
        .collect(Collectors.toList());
  }

  public List<String> getAllConfusables(DocumentModel doc) {
    List<String> allConfusables = new ArrayList<>();
    allConfusables.addAll(getAllLCConfusables(doc));
    allConfusables.addAll(getAllUCConfusables(doc));

    return allConfusables;
  }

  @Override
  public DocumentModelList getAllWordsPhrasesForConfusable(CoreSession session,
      String confusableChar, int batchSize) {
    String query = "SELECT * FROM FVWord, FVPhrase WHERE "
        + "dc:title LIKE '%" + NXQL.escapeStringInner(confusableChar) + "%'"
        + " AND ecm:isTrashed = 0 AND ecm:isProxy = 0 AND ecm:isVersion = 0";

    DocumentModelList docs = session.query(query, null, batchSize, 0, true);
    return (docs == null) ? new DocumentModelListImpl() : docs;
  }

  @Override
  public boolean hasConfusableCharacters(DocumentModel charDoc) {
    boolean lcConfusableNotEmpty = ArrayUtils
        .isNotEmpty((String[]) charDoc.getPropertyValue(LC_CONFUSABLES));
    boolean ucConfusableNotEmpty = ArrayUtils
        .isNotEmpty((String[]) charDoc.getPropertyValue(UC_CONFUSABLES));

    return lcConfusableNotEmpty || ucConfusableNotEmpty;
  }

}
