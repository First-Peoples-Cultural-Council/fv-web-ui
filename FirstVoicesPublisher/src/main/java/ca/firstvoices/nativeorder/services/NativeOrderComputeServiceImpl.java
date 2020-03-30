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
package ca.firstvoices.nativeorder.services;

import ca.firstvoices.services.AbstractFirstVoicesPublisherService;
import org.nuxeo.ecm.core.api.*;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author loopingz
 */
public class NativeOrderComputeServiceImpl extends AbstractFirstVoicesPublisherService implements NativeOrderComputeService {

    private CoreSession session;

    @Override
    public void computeNativeOrderTranslation(CoreSession coreSession, DocumentModel asset) {
        session = coreSession;

        String type = asset.getType();

        if (type.equals("FVDialect")) {
            computeForDialect(asset);
        } else if (type.equals("FVCharacter")) {
            computeOnCharacterChange(asset);
        } else if (type.equals("FVPhrase") || type.equals("FVWord")) {
            computeOnWordOrPhraseChange(asset);
        } else {
            throw new NuxeoException("Cannot compute native order on document type: " + type);
        }
    }

    private void computeOnWordOrPhraseChange(DocumentModel wordOrPhrase) {
        if (!wordOrPhrase.isImmutable()) {
            DocumentModel dialect = getDialectForDoc(session, wordOrPhrase);
            // First get the native alphabet
            DocumentModel[] chars = loadAlphabet(dialect);
            String nativeTitle = translateNativeTitle(chars, wordOrPhrase);
            String originalCustomSort = (String) wordOrPhrase.getPropertyValue("fv:custom_order");

            if (originalCustomSort == null || !nativeTitle.equals(originalCustomSort)) {
                session.saveDocument(wordOrPhrase);
            }
        }
    }

    private void computeOnCharacterChange(DocumentModel character) {
        DocumentModel dialect = getDialectForDoc(session, character);
        DocumentModel[] chars = Arrays.stream(loadAlphabet(dialect)).map(c -> c.getId().equals(character.getId()) ? character : c).toArray(DocumentModel[]::new);
        DocumentModelList wordsAndPhrases = loadWordsAndPhrases(dialect);
        computeNativeOrderTranslation(chars, wordsAndPhrases);
    }

    private void computeForDialect(DocumentModel dialect) {
        DocumentModel[] chars = loadAlphabet(dialect);
        DocumentModelList wordsAndPhrases = loadWordsAndPhrases(dialect);
        computeNativeOrderTranslation(chars, wordsAndPhrases);
    }

    private String translateNativeTitle(DocumentModel[] chars, DocumentModel element) {
        if (element.isImmutable()) {
            // We cannot update this element, no point in going any further
            return null;
        }

        String title = (String) element.getPropertyValue("dc:title");
        String nativeTitle = "";

        List<String> fvChars = Arrays.stream(chars).map(documentModel -> (String) documentModel.getPropertyValue("dc:title")).collect(Collectors.toList());

        List<String> upperChars = Arrays.stream(chars).map(character -> (String) character.getPropertyValue("fvcharacter:upper_case_character")).collect(Collectors.toList());

        while (title.length() > 0) {
            boolean found = false;
            int i;

            for (i = chars.length - 1; i >= 0; --i) {
                DocumentModel charDoc = chars[i];
                String charValue = (String) charDoc.getPropertyValue("dc:title");
                String ucCharValue = (String) charDoc.getPropertyValue("fvcharacter:upper_case_character");

                if (isCorrectCharacter(title, fvChars, upperChars, charValue, ucCharValue)) {
                    nativeTitle += new Character((char) (34 + (Long) charDoc.getPropertyValue("fvcharacter:alphabet_order"))).toString();
                    title = title.substring(charValue.length());
                    found = true;
                    break;
                }
            }
            if (!found) {
                if (" ".equals(title.substring(0, 1))) {
                    nativeTitle += "!";
                } else {
                    nativeTitle += "~" + title.substring(0, 1);
                }
                title = title.substring(1);
            }
        }

        return nativeTitle;
    }

    private void computeNativeOrderTranslation(DocumentModel[] chars, DocumentModelList elements) {
        for (DocumentModel doc : elements) {
            String nativeTitle = translateNativeTitle(chars, doc);
            String originalCustomSort = (String) doc.getPropertyValue("fv:custom_order");

            // In the case that the sorting methods are the same,
            // we don't want to trigger subsequent events that are listening for a save.
            // Just keep the sorting order on the document as it was. No need to save.
            if (originalCustomSort == null || !nativeTitle.equals(originalCustomSort)) {
                if (!doc.isImmutable()) {
                    doc.setPropertyValue("fv:custom_order", nativeTitle);
                }
                session.saveDocument(doc);
            }
        }
    }

    private DocumentModel[] loadAlphabet(DocumentModel dialect) {
        DocumentModelList chars = session.getChildren(new PathRef(dialect.getPathAsString() + "/Alphabet"));
        return chars
                .stream()
                .filter(character -> !character.isTrashed() && character.getPropertyValue("fvcharacter:alphabet_order") != null)
                .sorted(Comparator.comparing(d -> (Long) d.getPropertyValue("fvcharacter:alphabet_order")))
                .toArray(DocumentModel[]::new);
    }

    private DocumentModelList loadWordsAndPhrases(DocumentModel dialect) {
        return session.getChildren(new PathRef(dialect.getPathAsString() + "/Dictionary"));
    }

    private boolean isCorrectCharacter(String title, List<String> fvChars, List<String> upperChars, String charValue,
                                       String ucCharValue) {

        if ((title.startsWith(charValue)) || (ucCharValue != null && title.startsWith(ucCharValue))) {
            boolean incorrect = false;

            if (charValue != null) {
                // Grab all the characters that begin with the current character (for example, if "current character" is
                // iterating on "a", it will return "aa" if it is also in the alphabet)
                List<String> charsStartingWithCurrentCharLower =
                        fvChars.stream().filter(character -> character != null && character.startsWith(charValue)).collect(Collectors.toList());
                // Go through the characters that begin with the "current character", and ensure that the title does not
                // start with any character in that list (save for the "current character" that we're iterating on).
                incorrect =
                        charsStartingWithCurrentCharLower.stream().anyMatch(character -> !character.equals(charValue) && title.startsWith(character));
            }
            // If there is no match and the character has an uppercase equivalent, we want to repeat the process
            // above with uppercase character. We also check the lowercase in an example of yZ is the "uppercase" of yz.
            if (ucCharValue != null && !incorrect) {
                List<String> charsStartingWithCurrentCharUpper =
                        upperChars.stream().filter(character -> {
                            if (character == null) {
                                return false;
                            } else if (charValue != null) {
                                return character.startsWith(ucCharValue) || character.startsWith(charValue);
                            } else if (charValue == null) {
                                return character.startsWith(ucCharValue);
                            }
                            return false;
                        }).collect(Collectors.toList());
                incorrect =
                        charsStartingWithCurrentCharUpper.stream().anyMatch(uCharacter -> !uCharacter.equals(ucCharValue) && title.startsWith(uCharacter));
            }

            // If it is the right character this value, "incorrect" will be false.
            return !incorrect;
        }
        return false;
    }
}
