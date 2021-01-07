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

import static ca.firstvoices.data.lifecycle.Constants.REPUBLISH_TRANSITION;

import ca.firstvoices.characters.listeners.AssetListener;
import ca.firstvoices.core.io.utils.DialectUtils;
import ca.firstvoices.core.io.utils.SessionUtils;
import ca.firstvoices.core.io.utils.StateUtils;
import ca.firstvoices.data.schemas.DialectTypesConstants;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.ArrayUtils;
import org.jetbrains.annotations.Nullable;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

public class CustomOrderComputeServiceImpl implements CustomOrderComputeService {

  public static final int BASE = 34;
  public static final String NO_ORDER_STARTING_CHARACTER = "~";
  public static final String SPACE_CHARACTER = "!";
  public static final String DOCUMENT_TITLE = "dc:title";
  public static final String FV_CUSTOM_ORDER = "fv:custom_order";


  private DocumentModel[] loadedCharacters = null;
  private DocumentModel alphabet = null;

  @Override
  // Called when a document is created or updated
  public DocumentModel computeAssetNativeOrderTranslation(CoreSession session, DocumentModel asset,
      boolean save, boolean publish) {
    if (!asset.isImmutable()) {
      loadedCharacters = loadCharacters(session, asset);
      computeCustomOrder(asset, alphabet, loadedCharacters);

      if (Boolean.TRUE.equals(save)) {
        SessionUtils.saveDocumentWithoutEvents(session, asset, true,
            Collections.singletonList(AssetListener.DISABLE_CHAR_ASSET_LISTENER));
      }

      if (Boolean.TRUE.equals(publish)) {
        updateProxyIfPublished(asset);
      }
    }

    return asset;
  }

  public DocumentModel computeCustomOrder(DocumentModel element,
      DocumentModel alphabet, DocumentModel[] chars) {

    String title = (String) element.getPropertyValue(DOCUMENT_TITLE);
    StringBuilder nativeTitle = new StringBuilder();
    List<String> fvChars = Arrays.stream(chars)
        .map(character -> (String) character.getPropertyValue(DOCUMENT_TITLE))
        .collect(Collectors.toList());
    List<String> upperChars = Arrays.stream(chars)
        .map(character -> (String) character.getPropertyValue("fvcharacter:upper_case_character"))
        .collect(Collectors.toList());

    while (title != null && title.length() > 0) {
      ArrayUtils.reverse(chars);

      String finalTitle = title;

      String ignoredCharacter = getIgnoredCharacter(alphabet, title);

      if (ignoredCharacter != null) {
        // We're ignoring this character intentionally
        title = title.substring(ignoredCharacter.length());
      } else {
        // Check if the character exists in the archive:
        DocumentModel characterDoc = Arrays.stream(chars).filter(
            charDoc -> isCorrectCharacter(finalTitle, fvChars, upperChars,
                (String) charDoc.getPropertyValue(DOCUMENT_TITLE),
                (String) charDoc.getPropertyValue("fvcharacter:upper_case_character"))).findFirst()
            .orElse(null);
        if (characterDoc != null) {
          // The character exists in the archive:
          String computedCharacterOrder = (String) characterDoc
              .getPropertyValue(FV_CUSTOM_ORDER);
          nativeTitle.append(computedCharacterOrder);
          String charDocTitle = (String) characterDoc.getPropertyValue(DOCUMENT_TITLE);
          title = title.substring(charDocTitle.length());
        } else {
          if (!" ".equals(title.substring(0, 1))) {
            // Character does not exist in the Archive's Alphabet
            nativeTitle.append(NO_ORDER_STARTING_CHARACTER).append(title, 0, 1);
          } else {
            // Character is a space
            nativeTitle.append(SPACE_CHARACTER);
          }
          title = title.substring(1);
        }
      }
    }

    String originalCustomSort = (String) element.getPropertyValue(FV_CUSTOM_ORDER);
    if (!nativeTitle.toString().equals(originalCustomSort)) {
      element.setPropertyValue(FV_CUSTOM_ORDER, nativeTitle.toString());
    }

    return element;
  }

  @Nullable
  private String getIgnoredCharacter(DocumentModel alphabet, String title) {
    String[] ignoredChars = (String[]) alphabet.getPropertyValue("fv-alphabet:ignored_characters");

    String ignoredCharacter = null;

    if (ignoredChars != null) {
      ignoredCharacter = Arrays.stream(ignoredChars).filter(title::startsWith).findFirst()
          .orElse(null);
    }
    return ignoredCharacter;
  }

  private void updateProxyIfPublished(DocumentModel doc) {
    // If document is published, update the field on the proxy
    if (StateUtils.isPublished(doc)) {
      StateUtils.followTransitionIfAllowed(doc, REPUBLISH_TRANSITION);
    }
  }

  private boolean isCorrectCharacter(String title, List<String> fvChars, List<String> upperChars,
      String charValue, String ucCharValue) {

    if ((title.startsWith(charValue)) || (ucCharValue != null && title.startsWith(ucCharValue))) {
      boolean incorrect;

      // Grab all the characters that begin with the current character
      // (for example, if "current character" is
      // iterating on "a", it will return "aa" if it is also in the alphabet)
      List<String> charsStartingWithCurrentCharLower = fvChars.stream()
          .filter(character -> character != null && character.startsWith(charValue))
          .collect(Collectors.toList());
      // Go through the characters that begin with the "current character",
      // and ensure that the title does not
      // start with any character in that list (save for the "current character"
      // that we're iterating on).
      incorrect = charsStartingWithCurrentCharLower.stream()
          .anyMatch(character -> !character.equals(charValue) && title.startsWith(character));
      // If there is no match and the character has an uppercase equivalent,
      // we want to repeat the process above with uppercase character.
      // We also check the lowercase in an example of yZ is the "uppercase" of yz.
      if (ucCharValue != null && !incorrect) {
        List<String> charsStartingWithCurrentCharUpper = upperChars.stream().filter(character -> {
          if (character == null) {
            return false;
          }
          return character.startsWith(ucCharValue) || character.startsWith(charValue);
        }).collect(Collectors.toList());
        incorrect = charsStartingWithCurrentCharUpper.stream().anyMatch(
            uCharacter -> !uCharacter.equals(ucCharValue) && title.startsWith(uCharacter));
      }

      // If it is the right character this value, "incorrect" will be false.
      return !incorrect;
    }
    return false;
  }

  public DocumentModel[] loadCharacters(CoreSession session, DocumentModel asset) {

    if (loadedCharacters == null) {
      DocumentModel dialect = DialectUtils.getDialect(asset);
      alphabet = session
          .getChild(dialect.getRef(), DialectTypesConstants.FV_ALPHABET_NAME);

      DocumentModelList chars = session.getChildren(alphabet.getRef());
      updateCustomOrderCharacters(session, alphabet, chars);
      return chars.stream().filter(character -> !character.isTrashed()
          && character.getPropertyValue("fvcharacter:alphabet_order") != null)
          .sorted(Comparator.comparing(d ->
              (Long) d.getPropertyValue("fvcharacter:alphabet_order")))
          .toArray(DocumentModel[]::new);
    } else {
      return loadedCharacters;
    }
  }

  @Override
  public void updateCustomOrderCharacters(CoreSession session,
      DocumentModel alphabet, DocumentModelList chars) {
    boolean wasUpdated = false;

    for (DocumentModel alphabetCharacter : chars) {
      Long alphabetOrder = (Long) alphabetCharacter.getPropertyValue("fvcharacter:alphabet_order");
      String originalCustomOrder =
          (String) alphabetCharacter.getPropertyValue(FV_CUSTOM_ORDER);
      String updatedCustomOrder =
          alphabetOrder == null
              ? NO_ORDER_STARTING_CHARACTER + alphabetCharacter.getPropertyValue(DOCUMENT_TITLE)
              : "" + ((char) (BASE + alphabetOrder));
      if (originalCustomOrder == null || !originalCustomOrder.equals(updatedCustomOrder)) {
        alphabetCharacter.setPropertyValue(FV_CUSTOM_ORDER, updatedCustomOrder);
        session.saveDocument(alphabetCharacter);

        wasUpdated = true;
      }
    }

    if (wasUpdated && StateUtils.isPublished(alphabet)) {
      // Republish alphabet if custom order was updated
      StateUtils.followTransitionIfAllowed(alphabet, REPUBLISH_TRANSITION);
    }
  }
}