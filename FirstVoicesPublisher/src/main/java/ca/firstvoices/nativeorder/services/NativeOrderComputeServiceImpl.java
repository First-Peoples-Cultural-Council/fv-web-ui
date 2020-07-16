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

package ca.firstvoices.nativeorder.services;

import static ca.firstvoices.lifecycle.Constants.PUBLISHED_STATE;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.services.AbstractService;
import ca.firstvoices.services.UnpublishedChangesService;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.ArrayUtils;
import org.jetbrains.annotations.Nullable;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.runtime.api.Framework;

public class NativeOrderComputeServiceImpl extends AbstractService implements
    NativeOrderComputeService {

  public static final int BASE = 34;
  public static final String NO_ORDER_STARTING_CHARACTER = "~";
  public static final String SPACE_CHARACTER = "!";

  @Override
  public void updateCustomOrderCharacters(CoreSession session, DocumentModelList chars) {
    chars.forEach(c -> {
      Long alphabetOrder = (Long) c.getPropertyValue("fvcharacter:alphabet_order");
      String originalCustomOrder = (String) c.getPropertyValue("fv:custom_order");
      String updatedCustomOrder =
          alphabetOrder == null ? NO_ORDER_STARTING_CHARACTER + c.getPropertyValue("dc:title")
              : "" + ((char) (BASE + alphabetOrder));
      if (originalCustomOrder == null || !originalCustomOrder.equals(updatedCustomOrder)) {
        c.setPropertyValue("fv:custom_order", updatedCustomOrder);
        session.saveDocument(c);
      }
    });
  }

  @Override
  public void computeAssetNativeOrderTranslation(CoreSession session, DocumentModel asset) {
    if (!asset.isImmutable()) {
      DocumentModel dialect = getDialect(asset);
      DocumentModel[] chars = loadCharacters(session, dialect);
      DocumentModel alphabet = session
          .getDocument(new PathRef(dialect.getPathAsString() + "/Alphabet"));
      computeCustomOrder(session, asset, alphabet, chars);
    }
  }

  @Override
  public void computeDialectNativeOrderTranslation(CoreSession session, DocumentModel dialect,
      DocumentModel alphabet) {
    DocumentModel[] chars = loadCharacters(session, dialect);
    DocumentModelList wordsAndPhrases = session.query(
        "SELECT * FROM FVWord, FVPhrase WHERE ecm:ancestorId='" + dialect.getId()
            + "' AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0");
    wordsAndPhrases.forEach(doc -> computeCustomOrder(session, doc, alphabet, chars));
  }

  private void computeCustomOrder(CoreSession session, DocumentModel element,
      DocumentModel alphabet, DocumentModel[] chars) {

    if (element.isImmutable()) {
      return;
    }

    String title = (String) element.getPropertyValue("dc:title");
    StringBuilder nativeTitle = new StringBuilder();
    List<String> fvChars = Arrays.stream(chars)
        .map(character -> (String) character.getPropertyValue("dc:title"))
        .collect(Collectors.toList());
    List<String> upperChars = Arrays.stream(chars)
        .map(character -> (String) character.getPropertyValue("fvcharacter:upper_case_character"))
        .collect(Collectors.toList());

    String originalCustomSort = (String) element.getPropertyValue("fv:custom_order");

    while (title.length() > 0) {
      ArrayUtils.reverse(chars);

      String finalTitle = title;

      DocumentModel characterDoc = Arrays.stream(chars).filter(
          charDoc -> isCorrectCharacter(finalTitle, fvChars, upperChars,
              (String) charDoc.getPropertyValue("dc:title"),
              (String) charDoc.getPropertyValue("fvcharacter:upper_case_character"))).findFirst()
          .orElse(null);

      String ignoredCharacter = getIgnoredCharacter(alphabet, title);

      if (ignoredCharacter != null) {
        title = title.substring(ignoredCharacter.length());
      } else {
        if (characterDoc != null) {
          String computedCharacterOrder = (String) characterDoc.getPropertyValue("fv:custom_order");
          nativeTitle.append(computedCharacterOrder);
          String charDocTitle = (String) characterDoc.getPropertyValue("dc:title");
          title = title.substring(charDocTitle.length());
        } else {
          if (!" ".equals(title.substring(0, 1))) {
            nativeTitle.append(NO_ORDER_STARTING_CHARACTER).append(title, 0, 1);
          } else {
            nativeTitle.append(SPACE_CHARACTER);
          }
          title = title.substring(1);
        }
      }
    }

    if (!nativeTitle.toString().equals(originalCustomSort)) {
      element.setPropertyValue("fv:custom_order", nativeTitle.toString());
      session.saveDocument(element);
      updateProxyIfPublished(session, element);
    }
  }

  @Nullable
  private String getIgnoredCharacter(DocumentModel alphabet, String finalTitle) {
    String[] ignoredChars = (String[]) alphabet.getPropertyValue("fv-alphabet:ignored_characters");

    String ignoredCharacter = null;

    if (ignoredChars != null) {
      ignoredCharacter = Arrays.stream(ignoredChars).filter(i -> finalTitle.startsWith(i))
          .findFirst().orElse(null);
    }
    return ignoredCharacter;
  }

  private void updateProxyIfPublished(CoreSession session, DocumentModel element) {
    // If document is published, update the field on the proxy but only if no other changes
    // exist in order to avoid publishing an archive's other changes prematurely.
    FirstVoicesPublisherService firstVoicesPublisherService = Framework
        .getService(FirstVoicesPublisherService.class);

    UnpublishedChangesService unpublishedChangesService = Framework
        .getService(UnpublishedChangesService.class);

    boolean unpublishedChangesExist = unpublishedChangesService
        .checkUnpublishedChanges(session, element);

    if (!unpublishedChangesExist && element.getCurrentLifeCycleState().equals(PUBLISHED_STATE)) {
      firstVoicesPublisherService.republish(element);
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

  private DocumentModel[] loadCharacters(CoreSession session, DocumentModel dialect) {
    DocumentModelList chars = session
        .getChildren(new PathRef(dialect.getPathAsString() + "/Alphabet"));
    updateCustomOrderCharacters(session, chars);
    return chars.stream().filter(character -> !character.isTrashed()
        && character.getPropertyValue("fvcharacter:alphabet_order") != null)
        .sorted(Comparator.comparing(d -> (Long) d.getPropertyValue("fvcharacter:alphabet_order")))
        .toArray(DocumentModel[]::new);
  }
}
