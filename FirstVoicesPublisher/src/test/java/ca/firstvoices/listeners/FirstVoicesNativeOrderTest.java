
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

package ca.firstvoices.listeners;

import static ca.firstvoices.lifecycle.Constants.PUBLISH_TRANSITION;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_ALPHABET;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_CHARACTER;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_DICTIONARY;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_WORD;
import static ca.firstvoices.schemas.DomainTypesConstants.FV_DIALECT;
import static ca.firstvoices.schemas.DomainTypesConstants.FV_LANGUAGE;
import static ca.firstvoices.schemas.DomainTypesConstants.FV_LANGUAGE_FAMILY;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import ca.firstvoices.nativeorder.services.NativeOrderComputeService;
import java.util.ArrayList;
import java.util.List;
import javax.inject.Inject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.core.api.trash.TrashService;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

/**
 * @author loopingz
 */
@RunWith(FeaturesRunner.class)
@Features({PlatformFeature.class})
@Deploy({"FirstVoicesData", "org.nuxeo.ecm.platform", "org.nuxeo.ecm.platform.commandline.executor",
    "org.nuxeo.ecm.platform.picture.core", "org.nuxeo.ecm.platform.rendition.core",
    "org.nuxeo.ecm.platform.video.core", "org.nuxeo.ecm.platform.audio.core",
    "org.nuxeo.ecm.automation.scripting",
    "FirstVoicesNuxeoPublisher.tests:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.nativeorder.services.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.computealphabetschedule.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.nativeorder.listeners.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.workers.workmanagers.xml",})
public class FirstVoicesNativeOrderTest {

  @Inject
  private CoreSession session;

  @Inject
  private NativeOrderComputeService nativeOrderComputeService;

  @Inject
  private TrashService trashService;

  private DocumentModel domain;
  private DocumentModel dialect;

  @Before
  public void setUp() {
    domain = createDocument(session.createDocumentModel("/", "FV", "Domain"));
    createDocument(session.createDocumentModel("/", "Family", FV_LANGUAGE_FAMILY));
    createDocument(session.createDocumentModel("/Family", "Language", FV_LANGUAGE));
    dialect = createDocument(
        session.createDocumentModel("/Family/Language", "Dialect", FV_DIALECT));
    createDocument(
        session.createDocumentModel("/Family/Language/Dialect", "Alphabet", FV_ALPHABET));
    createDocument(
        session.createDocumentModel("/Family/Language/Dialect", "Dictionary", FV_DICTIONARY));

  }

  @After
  public void tearDown() {
    if (domain != null) {
      session.removeDocument(domain.getRef());
      session.save();
    }
  }

  @Test
  public void testDialectOrderingNisgaa() {
    String[] orderedWords = {"aada gadaalee", "adoḵs", "agwii-gin̓am", "laahitkw", "lag̱am-bax̱",
        "la'oo'a'a",};

    String[] orderedAlphabet = {"aa", "a", "b", "d", "e", "ee", "g", "g̱", "gw", "h", "hl", "i",
        "ii", "j", "k", "k'", "ḵ", "ḵ'", "kw", "kw'", "l", "Ì", "m", "m̓", "n", "n̓", "o", "oo",
        "p", "p'", "s", "t", "t'", "tl'", "ts", "ts'", "u", "uu", "w", "w̓", "x", "x̱", "xw", "y",
        "y̓", "'"};

    createOrderedAlphabet(orderedAlphabet, "/Family/Language/Dialect/Alphabet");
    createWordsorPhrases(orderedWords, FV_WORD);

    nativeOrderComputeService.computeDialectNativeOrderTranslation(dialect);
    Integer i = orderedWords.length - 1;

    DocumentModelList docs = session.query(
        "SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId() + "' " + "ORDER BY "
            + "fv:custom_order DESC");

    for (DocumentModel doc : docs) {
      String reference = (String) doc.getPropertyValue("fv:reference");
      assertEquals(orderedWords[i], doc.getPropertyValue("dc:title"));
      assertEquals(i, Integer.valueOf(reference));
      i--;
    }
  }

  @Test
  public void testDialectOrderingNuuChahNulth() {
    String[] orderedWords = {"animal", "ʔaʔapp̕iqa", "ʔaḥʔaaʔaaƛ", "ʕaʕac̕ikn̕uk", "aai",
        "ʔaaʔaƛkʷin", "ʕaanus", "ʔeʔiič’im", "cakaašt", "caqiic ʔiš suč’ačiłał", "cawaak", "caapin",
        "ciciḥʔaƛmapt", "cuwit", "cux" + "ʷaašt", "c̓iixaat̓akƛinƛ", "čuup", "č’iʔii",
        "hachaapsim", "hayu ʔiš muučiiłał", "hayuxsyuučiƛ", "k" + "̕uʔihta", "ƛułčakup", "ƛ̕uu-čiƛ",
        "ma", "mułaa", "m̓am̓iiqsu", "naʔaataḥ", "naw̕ahi", "nunuukma", "piišpiš", "qacc̕a",
        "qiicqiica", "qiišʔaqƛi", "sasin", "saasin", "suč’a", "šuuwis", "t̓iqʷas", "uksuukł",
        "ʔukłaa", "ʕuupqšiƛ", "weʔičʔin", "wiwiiquk", "xʷakak", "yaciicʔił", "yeeł", "y̕eʔisi"};

    String[] orderedAlphabet = {"a", "ʔa", "ʕa", "aa", "ʔaa", "ʕaa", "e", "ʔe", "ʕe", "ee", "ʔee",
        "ʕee", "c", "c" + "̕", "č", "č’", "h", "ḥ", "i", "ʔi", "ʕi", "ii", "ʔii", "ʕii", "k", "k̕",
        "kʷ", "k̕ʷ", "ł", "ƛ", "ƛ̕", "m", "m̕", "n", "n̕", "p", "p̕", "q", "qʷ", "s", "š", "t",
        "t̕", "u", "ʔu", "ʕu", "uu", "ʔuu", "ʕuu", "w", "w̕", "x", "x̣", "xʷ", "x̣ʷ", "y", "y̕",
        "ʕ", "ʔ"};

    createOrderedAlphabet(orderedAlphabet, "/Family/Language/Dialect/Alphabet");
    createWordsorPhrases(orderedWords, FV_WORD);

    nativeOrderComputeService.computeDialectNativeOrderTranslation(dialect);
    Integer i = orderedWords.length - 1;

    DocumentModelList docs = session.query(
        "SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId() + "' " + "ORDER BY "
            + "fv:custom_order DESC");

    for (DocumentModel doc : docs) {
      String reference = (String) doc.getPropertyValue("fv:reference");
      assertEquals(orderedWords[i], doc.getPropertyValue("dc:title"));
      assertEquals(i, Integer.valueOf(reference));
      i--;
    }
  }

  @Test
  public void testDialectOrderingSpacesAndNonAlphabetGraphemesAtEndByLatinOrder() {
    String[] orderedWords = {"À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í",
        "Î", "Ï", "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "×", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ", "ß",
        "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð", "ñ",
        "ò", "ó", "ô", "õ", "ö", "÷", "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ", "a", "able", "about",
        "account", "across", "act", "addition", "adjustment", "advertisement", "after", "again",
        "against", "agreement", "air", "all", "almost", "among", "amount", "baby", "back", "bad",
        "bag", "balance", "ball", "band", "cake", "camera", "canvas", "card", "care", "carriage",
        "damage", "danger", "dark", "daughter", "day", "dead", "dear", "death", "disgust",
        "distance", "distribution", "ear", "early", "earth", "east", "edge", "education", "effect",
        "egg", "elastic", "electric", "end", "face", "fact", "fall", "false", "family", "far",
        "farm", "fat", "father", "fear", "feather", "glass", "glove", "go", "goat", "gold", "good",
        "government", "grain", "grass", "great", "green", "grey", "grip", "group", "growth",
        "guide", "gun", "hair", "hammer", "hand", "hanging", "happy", "harbor", "ink", "insect",
        "instrument", "insurance", "interest", "invention", "iron", "island", "jelly", "jewel",
        "join", "journey", "judge", "jump", "keep", "kettle", "key", "kick", "kind", "kiss", "knee",
        "knife", "knot", "knowledge, land", "language", "last", "late", "map", "money", "note",
        "now", "number", "nut", "observation", "of", "off", "offer", "office", "oil", "old", "on",
        "only", "open", "paste", "payment", "peace", "pen", "pencil", "person", "physical",
        "picture", "quality", "question", "quick", "quiet", "quite, rail", "rain", "range", "rat",
        "rate", "ray", "run, sad", "safe", "sail", "salt", "same", "sand", "say", "scale", "school",
        "science", "scissors", "strange", "street", "strong", "structure", "substance", "such",
        "theory", "there", "thick", "thin", "tight", "till", "time", "tin", "tired", "to", "toe",
        "together", "unit", "up", "use, value", "verse", "very", "vessel", "view", "violent",
        "voice, waiting", "walk", "wall", "war", "warm", "wash", "worm", "wound", "writing",
        "wrong", "year", "yellow", "yes", "yesterday", "you", "young"};

    String[] orderedAlphabet = {"À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì",
        "Í", "Î", "Ï", "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "×", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ",
        "ß", "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð",
        "ñ", "ò", "ó", "ô", "õ", "ö", "÷", "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ"};

    createOrderedAlphabet(orderedAlphabet, "/Family/Language/Dialect/Alphabet");
    createWordsorPhrases(orderedWords, FV_WORD);

    nativeOrderComputeService.computeDialectNativeOrderTranslation(dialect);
    Integer i = orderedWords.length - 1;

    DocumentModelList docs = session.query(
        "SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId() + "' " + "ORDER BY "
            + "fv:custom_order DESC");

    for (DocumentModel doc : docs) {
      String reference = (String) doc.getPropertyValue("fv:reference");
      assertEquals(orderedWords[i], doc.getPropertyValue("dc:title"));
      assertEquals(i, Integer.valueOf(reference));
      i--;
    }
  }

  @Test
  public void testDialectOrderingPhrases() {
    String[] orderedPhrases = {"À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í",
        "Î", "Ï", "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "×", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ", "ß",
        "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð", "ñ",
        "ò", "ó", "ô", "õ", "ö", "÷", "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ",
        "A bad excuse is better than none", "A bit", "A bit " + "more", "A bit of a...",
        "A couple of sth", "Ability Something", "Able bodied", "Better safe than " + "sorry",
        "Curiosity killed the cat", "Do not make a mountain out of a mole " + "hill",
        "Easy come, " + "easy go", "Fine feathers make fine birds",
        "Give credit where credit is due", "Home is where the " + "heart is",
        "If you play with fire, you will get burned", "Judge not, that ye be not judged",
        "Kill " + "two birds with one stone.", "Learn a language, and you will avoid a war",
        "Memory is the treasure of" + " the mind", "No man is an island",
        "Oil and water do not mix", "Penny, Penny. Makes many.",
        "Respect" + " is not given, it is earned.",
        "Sticks and stones may break my bones, but words will never hurt me.",
        "There is no smoke without fire.", "Use it or lose it", "Virtue is its own reward",
        "When it rains " + "it pours.", "You cannot teach an old dog new tricks",
        "Zeal without knowledge is fire without light."};

    String[] orderedAlphabet = {"À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì",
        "Í", "Î", "Ï", "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "×", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ",
        "ß", "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð",
        "ñ", "ò", "ó", "ô", "õ", "ö", "÷", "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ"};

    createOrderedAlphabet(orderedAlphabet, "/Family/Language/Dialect/Alphabet");
    createWordsorPhrases(orderedPhrases, FV_PHRASE);

    nativeOrderComputeService.computeDialectNativeOrderTranslation(dialect);
    Integer i = orderedPhrases.length - 1;

    DocumentModelList docs = session.query(
        "SELECT * FROM FVPhrase WHERE ecm:ancestorId='" + dialect.getId() + "'"
            + " ORDER BY fv:custom_order DESC");

    for (DocumentModel doc : docs) {
      String reference = (String) doc.getPropertyValue("fv:reference");
      assertEquals(orderedPhrases[i], doc.getPropertyValue("dc:title"));
      assertEquals(i, Integer.valueOf(reference));
      i--;
    }
  }

  @Test
  public void testTrashedCharacterNotIncludedInOrdering() {
    String[] orderedWords = {"aada gadaalee", "adoḵs", "agwii-gin̓am", "laahitkw", "lag̱am-bax̱",
        "la'oo'a'a", "zaa"};

    String[] orderedAlphabet = {"z", "aa", "a", "b", "d", "e", "ee", "g", "g̱", "gw", "h", "hl",
        "i", "ii", "j", "k", "k'", "ḵ", "ḵ'", "kw", "kw'", "l", "Ì", "m", "m̓", "n", "n̓", "o",
        "oo", "p", "p'", "s", "t", "t'", "tl'", "ts", "ts'", "u", "uu", "w", "w̓", "x", "x̱", "xw",
        "y", "y̓", "'"};

    createOrderedAlphabet(orderedAlphabet, "/Family/Language/Dialect/Alphabet");
    createWordsorPhrases(orderedWords, FV_WORD);

    DocumentModelList characters = session
        .getChildren(new PathRef(dialect.getPathAsString() + "/Alphabet"));

    DocumentModel z = characters.get(0);

    trashService.trashDocument(z);
    session.saveDocument(z);
    session.save();

    nativeOrderComputeService.computeDialectNativeOrderTranslation(dialect);
    Integer i = orderedWords.length - 1;

    DocumentModelList docs = session.query(
        "SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId() + "' " + "ORDER BY "
            + "fv:custom_order DESC");

    for (DocumentModel doc : docs) {
      String reference = (String) doc.getPropertyValue("fv:reference");
      assertEquals(orderedWords[i], doc.getPropertyValue("dc:title"));
      assertEquals(i, Integer.valueOf(reference));
      i--;
    }
  }

  @Test
  public void testNoOrderDefaultsToLatin() {
    String[] orderedWords = {"a", "b", "c", "d"};

    String[] unorderedAlphabet = {"d", "a", "c", "b"};

    createUnorderedAlphabet(unorderedAlphabet, "/Family/Language/Dialect/Alphabet");
    createWordsorPhrases(orderedWords, FV_WORD);

    nativeOrderComputeService.computeDialectNativeOrderTranslation(dialect);
    Integer i = orderedWords.length - 1;

    DocumentModelList docs = session.query(
        "SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId() + "' " + "ORDER BY "
            + "fv:custom_order DESC");

    for (DocumentModel doc : docs) {
      String reference = (String) doc.getPropertyValue("fv:reference");
      assertEquals(orderedWords[i], doc.getPropertyValue("dc:title"));
      assertEquals(i, Integer.valueOf(reference));
      i--;
    }
  }

  @Test
  public void testSomeOrderedSomeNot() {
    String[] orderedWords = {"d", "c", "a", "b"};

    String[] unorderedAlphabet = {"a", "b"};
    String[] orderedAlphabet = {"d", "c"};

    createUnorderedAlphabet(unorderedAlphabet, "/Family/Language/Dialect/Alphabet");
    createOrderedAlphabet(orderedAlphabet, "/Family/Language/Dialect/Alphabet");

    createWordsorPhrases(orderedWords, FV_WORD);

    nativeOrderComputeService.computeDialectNativeOrderTranslation(dialect);
    Integer i = orderedWords.length - 1;

    DocumentModelList docs = session.query(
        "SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId() + "' " + "ORDER BY "
            + "fv:custom_order DESC");

    for (DocumentModel doc : docs) {
      String reference = (String) doc.getPropertyValue("fv:reference");
      assertEquals(orderedWords[i], doc.getPropertyValue("dc:title"));
      assertEquals(i, Integer.valueOf(reference));
      i--;
    }
  }

  @Test
  public void updateCustomOrderCharacters() {
    String[] orderedAlphabet = {"z", "aa", "a", "b", "d", "e", "ee", "g", "g̱", "gw", "h", "hl",
        "i", "ii", "j", "k", "k'", "ḵ", "ḵ'", "kw", "kw'", "l", "Ì", "m", "m̓", "n", "n̓", "o",
        "oo", "p", "p'", "s", "t", "t'", "tl'", "ts", "ts'", "u", "uu", "w", "w̓", "x", "x̱", "xw",
        "y", "y̓", "'"};
    createOrderedAlphabet(orderedAlphabet, "/Family/Language/Dialect/Alphabet");
    nativeOrderComputeService.updateCustomOrderCharacters(session,
        session.getChildren(new PathRef("/Family/Language/Dialect/Alphabet")));
    DocumentModelList characters = session
        .getChildren(new PathRef("/Family/Language/Dialect/Alphabet"));

    characters.forEach(c -> {
      Long alphabetOrder = (Long) c.getPropertyValue("fvcharacter:alphabet_order");
      String customOrder = (String) c.getPropertyValue("fv:custom_order");
      assertEquals(("" + (char) (34 + alphabetOrder)), customOrder);
    });
  }

  @Test
  public void updateCustomOrderCharactersWithoutOrderSet() {
    String[] unorderedAlphabet = {"z", "aa", "a", "b", "d", "e", "ee", "g", "g̱", "gw", "h", "hl",
        "i", "ii", "j", "k", "k'", "ḵ", "ḵ'", "kw", "kw'", "l", "Ì", "m", "m̓", "n", "n̓", "o",
        "oo", "p", "p'", "s", "t", "t'", "tl'", "ts", "ts'", "u", "uu", "w", "w̓", "x", "x̱", "xw",
        "y", "y̓", "'"};
    createUnorderedAlphabet(unorderedAlphabet, "/Family/Language/Dialect/Alphabet");
    nativeOrderComputeService.updateCustomOrderCharacters(session,
        session.getChildren(new PathRef("/Family/Language/Dialect/Alphabet")));
    DocumentModelList characters = session
        .getChildren(new PathRef("/Family/Language/Dialect/Alphabet"));

    characters.forEach(c -> {
      Long alphabetOrder = (Long) c.getPropertyValue("fvcharacter:alphabet_order");
      String customOrder = (String) c.getPropertyValue("fv:custom_order");
      assertNull(alphabetOrder);
      assertEquals(("~" + c.getPropertyValue("dc:title")), customOrder);
    });
  }

  @Test
  public void updateCustomOrderCharactersWithAndWithoutOrderSet() {
    String[] unorderedAlphabet = {"z", "aa", "a", "b", "d", "e", "ee", "g"};

    createUnorderedAlphabet(unorderedAlphabet, "/Family/Language/Dialect/Alphabet");

    String[] orderedAlphabet = {"À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È"};

    createOrderedAlphabet(orderedAlphabet, "/Family/Language/Dialect/Alphabet");

    nativeOrderComputeService.updateCustomOrderCharacters(session,
        session.getChildren(new PathRef("/Family/Language/Dialect/Alphabet")));
    DocumentModelList characters = session
        .getChildren(new PathRef("/Family/Language/Dialect/Alphabet"));

    characters.forEach(c -> {
      Long alphabetOrder = (Long) c.getPropertyValue("fvcharacter:alphabet_order");
      String customOrder = (String) c.getPropertyValue("fv:custom_order");
      if (alphabetOrder == null) {
        assertEquals(("~" + c.getPropertyValue("dc:title")), customOrder);
      } else {
        assertEquals(("" + (char) (34 + alphabetOrder)), customOrder);
      }
    });
  }

  @Test
  public void ComputingCustomOrderComputesonProxyDocs() {
    String[] orderedWords = {"aada gadaalee", "adoḵs", "agwii-gin̓am", "laahitkw", "lag̱am-bax̱",
        "la'oo'a'a",};

    String[] orderedAlphabet = {"aa", "a", "b", "d", "e", "ee", "g", "g̱", "gw", "h", "hl", "i",
        "ii", "j", "k", "k'", "ḵ", "ḵ'", "kw", "kw'", "l", "Ì", "m", "m̓", "n", "n̓", "o", "oo",
        "p", "p'", "s", "t", "t'", "tl'", "ts", "ts'", "u", "uu", "w", "w̓", "x", "x̱", "xw", "y",
        "y̓", "'"};

    createOrderedAlphabet(orderedAlphabet, "/Family/Language/Dialect/Alphabet");
    List<DocumentModel> newWords = createWordsorPhrases(orderedWords, FV_WORD);

    newWords.forEach(word -> {
      word.followTransition(PUBLISH_TRANSITION);
    });

    nativeOrderComputeService.computeDialectNativeOrderTranslation(dialect);
    Integer i = orderedWords.length - 1;

    DocumentModelList unpublishedDocs = session.query(
        "SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId() + "' AND "
            + "ecm:isProxy = 0 " + "ORDER BY fv:custom_order DESC");

    for (DocumentModel doc : unpublishedDocs) {
      String reference = (String) doc.getPropertyValue("fv:reference");
      assertEquals(orderedWords[i], doc.getPropertyValue("dc:title"));
      assertEquals(i, Integer.valueOf(reference));
      i--;
    }

    DocumentModelList publishedDocs = session.query(
        "SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialect.getId() + "' AND "
            + "ecm:isProxy = 1 " + "ORDER BY fv:custom_order DESC");

    for (DocumentModel doc : publishedDocs) {
      String reference = (String) doc.getPropertyValue("fv:reference");
      assertEquals(orderedWords[i], doc.getPropertyValue("dc:title"));
      assertEquals(i, Integer.valueOf(reference));
      i--;
    }

  }


  private DocumentModel createDocument(DocumentModel model) {
    model.setPropertyValue("dc:title", model.getName());
    return session.createDocument(model);
  }

  private void createOrderedAlphabet(String[] alphabet, String path) {
    Integer i = 0;
    for (String letter : alphabet) {
      DocumentModel letterDoc = session.createDocumentModel(path, letter, FV_CHARACTER);
      letterDoc.setPropertyValue("fvcharacter:alphabet_order", i);
      createDocument(letterDoc);
      i++;
    }
  }

  private void createUnorderedAlphabet(String[] alphabet, String path) {
    for (String letter : alphabet) {
      DocumentModel letterDoc = session.createDocumentModel(path, letter, FV_CHARACTER);
      createDocument(letterDoc);
    }
  }

  private DocumentModel createWordorPhrase(String value, String typeName, String pv, String v) {
    DocumentModel document = session
        .createDocumentModel("/Family/Language/Dialect/Dictionary", value, typeName);
    if (pv != null) {
      document.setPropertyValue(pv, v);
    }

    document = createDocument(document);

    return document;
  }

  private List<DocumentModel> createWordsorPhrases(String[] orderedValues, String typeName) {
    List<DocumentModel> newWordsOrPhrases = new ArrayList<>();
    Integer i = 0;
    for (String value : orderedValues) {
      DocumentModel doc = createWordorPhrase(value, typeName, "fv:reference", String.valueOf(i));
      newWordsOrPhrases.add(doc);
      i++;
    }

    session.save();
    return newWordsOrPhrases;
  }
}