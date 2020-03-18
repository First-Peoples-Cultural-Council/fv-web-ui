
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

package ca.firstvoices.listeners;

import static org.junit.Assert.assertEquals;

import javax.inject.Inject;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.RuntimeFeature;

import ca.firstvoices.nativeorder.services.NativeOrderComputeService;

/**
 * @author loopingz
 */
@RunWith(FeaturesRunner.class)
@Features({RuntimeFeature.class, CoreFeature.class, PlatformFeature.class})
@Deploy({"FirstVoicesData", "org.nuxeo.ecm.platform",
        "org.nuxeo.ecm.platform.commandline.executor",
        "org.nuxeo.ecm.platform.picture.core",
        "org.nuxeo.ecm.platform.rendition.core",
        "org.nuxeo.ecm.platform.video.core",
        "org.nuxeo.ecm.platform.audio.core",
        "org.nuxeo.ecm.automation.scripting",
        "FirstVoicesNuxeoPublisher.tests:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml",
        "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
        "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",
        "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.nativeorder.services.xml"})
public class FirstVoicesNativeOrderTest {
    @Inject
    protected CoreSession session;

    @Inject
    protected NativeOrderComputeService nativeOrderComputeService;

    private DocumentModel domain;
    private DocumentModel dialect;

    @Before
    public void setUp() throws Exception {
        domain = createDocument(session.createDocumentModel("/", "FV", "Domain"));
        createDocument(session.createDocumentModel("/", "Family", "FVLanguageFamily"));
        createDocument(session.createDocumentModel("/Family", "Language", "FVLanguage"));
        dialect = createDocument(session.createDocumentModel("/Family/Language", "Dialect", "FVDialect"));
    }

    @After
    public void tearDown() throws Exception {
        if (domain != null) {
            session.removeDocument(domain.getRef());
            session.save();
        }
    }

    @Test
    public void testDialectOrderingNisgaa() throws Exception {
        String[] orderedWords = {"aada gadaalee", "adoḵs", "agwii-gin̓am", "laahitkw", "lag̱am-bax̱", "la'oo'a'a",};

        String[] orderedAlphabet = {"aa", "a", "b", "d", "e", "ee", "g", "g̱", "gw", "h", "hl", "i", "ii", "j", "k",
                "k'", "ḵ", "ḵ'", "kw", "kw'", "l", "Ì", "m", "m̓", "n", "n̓", "o", "oo", "p", "p'", "s", "t", "t'",
                "tl'", "ts", "ts'", "u", "uu", "w", "w̓", "x", "x̱", "xw", "y", "y̓", "'"};

        createAlphabet(orderedAlphabet, "/Family/Language/Dialect/Alphabet");
        createWordsorPhrases(orderedWords, "FVWord");

        nativeOrderComputeService.computeDialectNativeOrderTranslation(dialect);
        Integer i = orderedWords.length - 1;

        DocumentModelList docs = session.query("SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId() + "' " +
                "ORDER BY " + "fv:custom_order DESC");

        for (DocumentModel doc : docs) {
            String reference = (String) doc.getPropertyValue("fv:reference");
            assertEquals(orderedWords[i], doc.getPropertyValue("dc:title"));
            assertEquals(i, Integer.valueOf(reference));
            i--;
        }
    }

    @Test
    public void testDialectOrderingNuuChahNulth() throws Exception {
        String[] orderedWords = {"animal", "ʔaʔapp̕iqa", "ʔaḥʔaaʔaaƛ", "ʕaʕac̕ikn̕uk", "aai", "ʔaaʔaƛkʷin", "ʕaanus"
                , "ʔeʔiič’im", "cakaašt", "caqiic ʔiš suč’ačiłał", "cawaak", "caapin", "ciciḥʔaƛmapt", "cuwit", "cux" +
                "ʷaašt", "c̓iixaat̓akƛinƛ", "čuup", "č’iʔii", "hachaapsim", "hayu ʔiš muučiiłał", "hayuxsyuučiƛ", "k" +
                "̕uʔihta", "ƛułčakup", "ƛ̕uu-čiƛ", "ma", "mułaa", "m̓am̓iiqsu", "naʔaataḥ", "naw̕ahi", "nunuukma",
                "piišpiš", "qacc̕a", "qiicqiica", "qiišʔaqƛi", "sasin", "saasin", "suč’a", "šuuwis", "t̓iqʷas",
                "uksuukł", "ʔukłaa", "ʕuupqšiƛ", "weʔičʔin", "wiwiiquk", "xʷakak", "yaciicʔił", "yeeł", "y̕eʔisi"};

        String[] orderedAlphabet = {"a", "ʔa", "ʕa", "aa", "ʔaa", "ʕaa", "e", "ʔe", "ʕe", "ee", "ʔee", "ʕee", "c", "c"
                + "̕", "č", "č’", "h", "ḥ", "i", "ʔi", "ʕi", "ii", "ʔii", "ʕii", "k", "k̕", "kʷ", "k̕ʷ", "ł", "ƛ",
                "ƛ̕", "m", "m̕", "n", "n̕", "p", "p̕", "q", "qʷ", "s", "š", "t", "t̕", "u", "ʔu", "ʕu", "uu", "ʔuu",
                "ʕuu", "w", "w̕", "x", "x̣", "xʷ", "x̣ʷ", "y", "y̕", "ʕ", "ʔ"};

        createAlphabet(orderedAlphabet, "/Family/Language/Dialect/Alphabet");
        createWordsorPhrases(orderedWords, "FVWord");

        nativeOrderComputeService.computeDialectNativeOrderTranslation(dialect);
        Integer i = orderedWords.length - 1;

        DocumentModelList docs = session.query("SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId() + "' " +
                "ORDER BY " + "fv:custom_order DESC");

        for (DocumentModel doc : docs) {
            String reference = (String) doc.getPropertyValue("fv:reference");
            assertEquals(orderedWords[i], doc.getPropertyValue("dc:title"));
            assertEquals(i, Integer.valueOf(reference));
            i--;
        }
    }

    @Test
    public void testDialectOrderingSpacesAndNonAlphabetGraphemesAtEndByLatinOrder() throws Exception {
        String[] orderedWords = {" ", "À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï",
                "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "×", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ", "ß", "à", "á", "â", "ã",
                "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð", "ñ", "ò", "ó", "ô", "õ", "ö", "÷",
                "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ", "a", "able", "about", "account", "across", "act", "addition",
                "adjustment", "advertisement", "after", "again", "against", "agreement", "air", "all", "almost",
                "among", "amount", "baby", "back", "bad", "bag", "balance", "ball", "band", "cake", "camera", "canvas"
                , "card", "care", "carriage", "damage", "danger", "dark", "daughter", "day", "dead", "dear", "death",
                "disgust", "distance", "distribution", "ear", "early", "earth", "east", "edge", "education", "effect"
                , "egg", "elastic", "electric", "end", "face", "fact", "fall", "false", "family", "far", "farm", "fat"
                , "father", "fear", "feather", "glass", "glove", "go", "goat", "gold", "good", "government", "grain",
                "grass", "great", "green", "grey", "grip", "group", "growth", "guide", "gun", "hair", "hammer", "hand"
                , "hanging", "happy", "harbor", "ink", "insect", "instrument", "insurance", "interest", "invention",
                "iron", "island", "jelly", "jewel", "join", "journey", "judge", "jump", "keep", "kettle", "key",
                "kick", "kind", "kiss", "knee", "knife", "knot", "knowledge, land", "language", "last", "late", "map"
                , "money", "note", "now", "number", "nut", "observation", "of", "off", "offer", "office", "oil", "old"
                , "on", "only", "open", "paste", "payment", "peace", "pen", "pencil", "person", "physical", "picture"
                , "quality", "question", "quick", "quiet", "quite, rail", "rain", "range", "rat", "rate", "ray",
                "run, sad", "safe", "sail", "salt", "same", "sand", "say", "scale", "school", "science", "scissors",
                "strange", "street", "strong", "structure", "substance", "such", "theory", "there", "thick", "thin",
                "tight", "till", "time", "tin", "tired", "to", "toe", "together", "unit", "up", "use, value", "verse"
                , "very", "vessel", "view", "violent", "voice, waiting", "walk", "wall", "war", "warm", "wash", "worm"
                , "wound", "writing", "wrong", "year", "yellow", "yes", "yesterday", "you", "young"};

        String[] orderedAlphabet = {"À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï",
                "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "×", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ", "ß", "à", "á", "â", "ã",
                "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð", "ñ", "ò", "ó", "ô", "õ", "ö", "÷",
                "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ"};

        createAlphabet(orderedAlphabet, "/Family/Language/Dialect/Alphabet");
        createWordsorPhrases(orderedWords, "FVWord");

        nativeOrderComputeService.computeDialectNativeOrderTranslation(dialect);
        Integer i = orderedWords.length - 1;

        DocumentModelList docs = session.query("SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId() + "' " +
                "ORDER BY " + "fv:custom_order DESC");

        for (DocumentModel doc : docs) {
            String reference = (String) doc.getPropertyValue("fv:reference");
            assertEquals(orderedWords[i], doc.getPropertyValue("dc:title"));
            assertEquals(i, Integer.valueOf(reference));
            i--;
        }
    }

    @Test
    public void testDialectOrderingPhrases() throws Exception {
        String[] orderedPhrases = {" ", "À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í", "Î",
                "Ï", "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "×", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ", "ß", "à", "á", "â",
                "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð", "ñ", "ò", "ó", "ô", "õ", "ö",
                "÷", "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ", "A bad excuse is better than none", "A bit", "A bit " +
                "more", "A bit of a...", "A couple of sth", "Ability Something", "Able bodied", "Better safe than " +
                "sorry", "Curiosity killed the cat", "Do not make a mountain out of a mole " + "hill", "Easy come, " +
                "easy go", "Fine feathers make fine birds", "Give credit where credit is due", "Home is where the " +
                "heart is", "If you play with fire, you will get burned", "Judge not, that ye be not judged", "Kill " +
                "two birds with one stone.", "Learn a language, and you will avoid a war", "Memory is the treasure of" +
                " the mind", "No man is an island", "Oil and water do not mix", "Penny, Penny. Makes many.", "Respect" +
                " is not given, it is earned.", "Sticks and stones may break my bones, but words will never hurt me."
                , "There is no smoke without fire.", "Use it or lose it", "Virtue is its own reward", "When it rains " +
                "it pours.", "You cannot teach an old dog new tricks", "Zeal without knowledge is fire without light."};

        String[] orderedAlphabet = {"À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï",
                "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "×", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ", "ß", "à", "á", "â", "ã",
                "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð", "ñ", "ò", "ó", "ô", "õ", "ö", "÷",
                "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ"};

        createAlphabet(orderedAlphabet, "/Family/Language/Dialect/Alphabet");
        createWordsorPhrases(orderedPhrases, "FVPhrase");

        nativeOrderComputeService.computeDialectNativeOrderTranslation(dialect);
        Integer i = orderedPhrases.length - 1;

        DocumentModelList docs = session.query("SELECT * FROM FVPhrase WHERE ecm:ancestorId='" + dialect.getId() + "'" +
                " ORDER BY fv:custom_order DESC");

        for (DocumentModel doc : docs) {
            String reference = (String) doc.getPropertyValue("fv:reference");
            assertEquals(orderedPhrases[i], doc.getPropertyValue("dc:title"));
            assertEquals(i, Integer.valueOf(reference));
            i--;
        }
    }

    private DocumentModel createDocument(DocumentModel model) {
        model.setPropertyValue("dc:title", model.getName());
        return session.createDocument(model);
    }

    private void createAlphabet(String[] alphabet, String path) {
        Integer i = 0;
        for (String letter : alphabet) {
            DocumentModel letterDoc = session.createDocumentModel(path, letter, "FVCharacter");
            letterDoc.setPropertyValue("fvcharacter:alphabet_order", i);
            createDocument(letterDoc);
            i++;
        }
    }

    private DocumentModel createWordorPhrase(String value, String typeName, String pv, String v) {
        DocumentModel document = session.createDocumentModel("/Family/Language/Dialect/Dictionary", value, typeName);
        if (pv != null) {
            document.setPropertyValue(pv, v);
        }

        document = createDocument(document);

        return document;
    }

    private void createWordsorPhrases(String[] orderedValues, String typeName) {
        Integer i = 0;
        for (String value : orderedValues) {
            createWordorPhrase(value, typeName, "fv:reference", String.valueOf(i));
            i++;
        }

        session.save();
    }
}