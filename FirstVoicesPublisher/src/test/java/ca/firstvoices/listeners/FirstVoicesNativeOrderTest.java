/**
 *
 */

package ca.firstvoices.listeners;

import static org.junit.Assert.assertEquals;

import javax.inject.Inject;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.event.EventService;
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
@Features({ RuntimeFeature.class, CoreFeature.class, PlatformFeature.class, AutomationFeature.class })
@Deploy({
            "FirstVoicesData",
            "org.nuxeo.ecm.platform",
            "org.nuxeo.ecm.platform.commandline.executor",
            "org.nuxeo.ecm.platform.picture.core",
            "org.nuxeo.ecm.platform.rendition.core",
            "org.nuxeo.ecm.platform.video.core",
            "org.nuxeo.ecm.platform.audio.core",
            "org.nuxeo.ecm.automation.scripting",
            "FirstVoicesNuxeoPublisher.tests:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml",
            "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
            "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",
            "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.nativeorder.services.xml"
})
public class FirstVoicesNativeOrderTest {
    @Inject
    protected CoreSession session;

    @Inject
    protected NativeOrderComputeService nativeOrderComputeService;

    private DocumentModel dialectDoc1;
    private DocumentModel dialectDoc2;

    private DocumentModel word;

    // Nisg'a
    private String[] orderedWords1 = {"adoḵs", "agwii-gin̓am", "aada gadaalee", "lag̱am-bax̱", "la'oo'a'a",
            "laahitkw"};

    private String[] alphabet1 = {"a", "aa", "b", "d", "e", "ee", "g", "g̱", "gw", "h", "hl", "i", "ii", "j", "k", "k'",
            "ḵ", "ḵ'", "kw", "kw'", "l", "Ì", "m", "m̓", "n", "n̓", "o", "oo", "p", "p'", "s", "t", "t'", "tl'", "ts",
            "ts'", "u", "uu", "w", "w̓", "x", "x̱", "xw", "y", "y̓", "'"};

    // Nuu-chah-nulth
    private String[] orderedWords2 = {"animal", "ʔaʔapp̕iqa", "ʔaḥʔaaʔaaƛ", "ʕaʕac̕ikn̕uk", "aai", "ʔaaʔaƛkʷin",
            "ʕaanus", "ʔeʔiič’im", "cakaašt", "caqiic ʔiš suč’ačiłał", "cawaak", "caapin", "ciciḥʔaƛmapt", "cuwit",
            "cuxʷaašt", "c̓iixaat̓akƛinƛ", "čuup", "č’iʔii", "hachaapsim", "hayuxsyuučiƛ", "hayu ʔiš muučiiłał", "k̕uʔihta",
            "ƛułčakup", "ƛ̕uu-čiƛ", "ma", "mułaa", "m̓am̓iiqsu", "naʔaataḥ", "naw̕ahi", "nunuukma", "piišpiš", "qacc̕a",
            "qiicqiica", "qiišʔaqƛi", "sasin", "saasin", "suč’a", "šuuwis", "t̓iqʷas", "uksuukł", "ʔukłaa", "ʕuupqšiƛ",
            "weʔičʔin", "wiwiiquk", "xʷakak", "yaciicʔił", "yeeł", "y̕eʔisi"};
    String[] alphabet2 =
            {"a", "ʔa", "ʕa", "aa", "ʔaa", "ʕaa", "e", "ʔe", "ʕe", "ee", "ʔee", "ʕee", "c", "c̕", "č", "č’", "h", "ḥ", "i", "ʔi", "ʕi", "ii", "ʔii", "ʕii", "k", "k̕", "kʷ", "k̕ʷ", "ł", "ƛ", "ƛ̕", "m", "m̕", "n", "n̕", "p", "p̕", "q", "qʷ", "s", "š", "t", "t̕", "u", "ʔu", "ʕu", "uu", "ʔuu", "ʕuu", "w", "w̕", "x", "x̣", "xʷ", "x̣ʷ", "y", "y̕", "ʕ", "ʔ"};

    @Before
    public void setUp() throws Exception {
        DocumentModel domain = createDocument(session.createDocumentModel("/", "FV", "Domain"));
        createDocument(session.createDocumentModel("/", "Family", "FVLanguageFamily"));
        createDocument(session.createDocumentModel("/Family", "Language", "FVLanguage"));
        dialectDoc1 = createDocument(session.createDocumentModel("/Family/Language", "Dialect1", "FVDialect"));
        dialectDoc2 = createDocument(session.createDocumentModel("/Family/Language", "Dialect2", "FVDialect"));
        createAlphabet(alphabet1, "/Family/Language/Dialect1/Alphabet");
        createAlphabet(alphabet2, "/Family/Language/Dialect2/Alphabet");
        createWords(orderedWords1, "/Family/Language/Dialect1/Dictionary");
        createWords(orderedWords2, "/Family/Language/Dialect2/Dictionary");
    }

    private DocumentModel createDocument(DocumentModel model) {
        model.setPropertyValue("dc:title", model.getName());
        return session.createDocument(model);
    }

    private void createAlphabet(String[] alphabet, String path) {
        Integer i = 0;
        for (String letter : alphabet) {
            DocumentModel letterDoc = session.createDocumentModel(path, letter,
                    "FVCharacter");
            letterDoc.setPropertyValue("fvcharacter:alphabet_order", i);
            createDocument(letterDoc);
            i++;
        }
    }

    private DocumentModel createWord(String dictionaryPath, String wordValue, String pv, String v) {
        word = session.createDocumentModel(dictionaryPath, wordValue, "FVWord");
        if (pv != null) {
            word.setPropertyValue(pv, v);
        }

        word = createDocument(word);

        return word;
    }

    private void createWords(String[] orderedWords, String dictionaryPath) {
        Integer i = 0;
        for (String wordValue : orderedWords) {
            createWord(dictionaryPath, wordValue, "fv:reference", String.valueOf(i));
            i++;
        }

        session.save();
    }

    private DocumentModel getProxy(DocumentModel model) {
        return session.getProxies(model.getRef(), null).get(0);
    }

    @Test
    public void testDialectOrdering() throws Exception {
        nativeOrderComputeService.computeDialectNativeOrderTranslation(dialectDoc1);
        Integer i = orderedWords1.length - 1;

        DocumentModelList docs = session.query(
                "SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialectDoc1.getId() + "' ORDER BY fv:custom_order DESC");

        for (DocumentModel doc : docs) {
            String reference = (String) doc.getPropertyValue("fv:reference");
            assertEquals(i, Integer.valueOf(reference));
            i--;
        }

        nativeOrderComputeService.computeDialectNativeOrderTranslation(dialectDoc2);
        Integer j = orderedWords2.length - 1;

        docs = session.query(
                "SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialectDoc2.getId() + "' ORDER BY fv:custom_order DESC");

        for (DocumentModel doc : docs) {
            String reference = (String) doc.getPropertyValue("fv:reference");
            assertEquals(j, Integer.valueOf(reference));
            j--;
        }
    }

//    TODO: CREATE A UNIT TEST WITH RANDOM LATIN CHARACTER ORDERING

}