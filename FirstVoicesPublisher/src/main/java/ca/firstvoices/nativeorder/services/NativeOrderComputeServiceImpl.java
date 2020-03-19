/*
 * Copyright 2016 First People's Cultural Council
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package ca.firstvoices.nativeorder.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

import ca.firstvoices.services.AbstractService;
import org.nuxeo.ecm.core.api.PathRef;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author loopingz
 */
public class NativeOrderComputeServiceImpl extends AbstractService implements NativeOrderComputeService {

    private DocumentModel[] loadAlphabet(DocumentModel dialect) {
        DocumentModelList chars = dialect.getCoreSession().getChildren(new PathRef(dialect.getPathAsString() + "/Alphabet"));
        return chars
                .stream()
                .filter(character -> !character.isTrashed() && character.getPropertyValue("fvcharacter:alphabet_order") != null)
                .sorted(Comparator.comparing(d -> (Long) d.getPropertyValue("fvcharacter:alphabet_order")))
                .toArray(DocumentModel[]::new);
    }

    /* (non-Javadoc)
     * @see ca.firstvoices.publisher.services.NativeOrderComputeService#computeAssetNativeOrderTranslation(org.nuxeo
     * .ecm.core.api.DocumentModel)
     */
    @Override
    public void computeAssetNativeOrderTranslation(DocumentModel asset) {
        // appears that there's a lot of processing going on within the following methods
        // last of which, computeNativeOrderTranslation will just return if the asset is immutable
        // so, instead of processing all the dialect data, and the alphabet only to do nothing,
        // lets check that here
        if (!asset.isImmutable()) {
            DocumentModel dialect = getDialect(asset);
            CoreSession session = asset.getCoreSession();
            // First get the native alphabet
            DocumentModel[] chars = loadAlphabet(dialect);
            computeNativeOrderTranslation(chars, asset);
        }
    }

    /* (non-Javadoc)
     * @see ca.firstvoices.publisher.services.NativeOrderComputeService#computeDialectNativeOrderTranslation(org
     * .nuxeo.ecm.core.api.DocumentModel)
     */
    @Override
    public void computeDialectNativeOrderTranslation(DocumentModel dialect) {
        CoreSession session = dialect.getCoreSession();
        // First get the native alphabet
        DocumentModel[] chars = loadAlphabet(dialect);
        computeNativeOrderTranslation(chars,
                session.query("SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId() + "'"));
        computeNativeOrderTranslation(chars,
                session.query("SELECT * FROM FVPhrase WHERE ecm:ancestorId='" + dialect.getId() + "'"));
        session.save();
    }

    protected void computeNativeOrderTranslation(DocumentModel[] chars, DocumentModel element) {
        if (element.isImmutable()) {
            // We cannot update this element, no point in going any further
            return;
        }

        String title = (String) element.getPropertyValue("dc:title");
        String nativeTitle = "";
        List<String> fvChars =
                Arrays.stream(chars).map(character -> (String) character.getPropertyValue("dc:title")).collect(Collectors.toList());
        List<String> upperChars = Arrays.stream(chars).map(character -> (String) character.getPropertyValue(
                "fvcharacter:upper_case_character")).collect(Collectors.toList());

        String originalCustomSort = (String) element.getPropertyValue("fv:custom_order");

        while (title.length() > 0) {
            boolean found = false;
            // Evaluate characters in reverse to find 'double' chars (e.g. 'aa' vs. 'a') before single ones
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


        // In the case that the sorting methods are the same,
        // we don't want to trigger subsequent events that are listening for a save.
        // Just keep the sorting order on the document as it was. No need to save.
        if (originalCustomSort == null || !nativeTitle.equals(originalCustomSort)) {
            if (!element.isImmutable()) {
                element.setPropertyValue("fv:custom_order", nativeTitle);
            }
            element.getCoreSession().saveDocument(element);
        }
    }

    protected void computeNativeOrderTranslation(DocumentModel[] chars, DocumentModelList elements) {
        for (DocumentModel doc : elements) {
            computeNativeOrderTranslation(chars, doc);
        }
    }

    private boolean isCorrectCharacter(String title, List<String> fvChars, List<String> upperChars, String charValue,
                                       String ucCharValue) {

        if ((charValue != null && title.startsWith(charValue)) || (ucCharValue != null && title.startsWith(ucCharValue))) {
            boolean incorrect = false;

            if (charValue != null) {
                // Grab all the characters that begin with the current character (for example, if "current character" is
                // iterating on "a", it will return "aa" if it is also in the alphabet)
                List<String> charsStartingWithCurrentCharLower =
                        fvChars.stream().filter(character -> character != null ? character.startsWith(charValue) : false).collect(Collectors.toList());
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
