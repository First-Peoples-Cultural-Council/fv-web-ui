/**
 * 
 */

package ca.firstvoices.listeners;

import static org.junit.Assert.*;

import java.security.InvalidParameterException;
import java.util.HashMap;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.client.model.Document;
import org.nuxeo.ecm.automation.client.model.PropertyMap;
import org.nuxeo.ecm.automation.core.util.Properties;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.event.EventService;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.LocalDeploy;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.RuntimeFeature;

import ca.firstvoices.nativeorder.services.NativeOrderComputeService;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.publisher.services.FirstVoicesPublisherServiceImpl;

import javax.inject.Inject;

/**
 * @author loopingz
 */
@RunWith(FeaturesRunner.class)
@Features({RuntimeFeature.class, CoreFeature.class, AutomationFeature.class })
@Deploy( {"studio.extensions.First-Voices",
        "org.nuxeo.ecm.platform",
        "org.nuxeo.ecm.platform.commandline.executor",
        "org.nuxeo.ecm.platform.picture.core",
        "org.nuxeo.ecm.platform.rendition.core",
        "org.nuxeo.ecm.platform.video.core",
        "org.nuxeo.ecm.platform.audio.core",
        "org.nuxeo.ecm.automation.scripting",
        "org.nuxeo.ecm.platform.web.common"})
@LocalDeploy({
    "org.nuxeo.ecm.platform.forum.core:OSGI-INF/forum-schemas-contrib.xml",
    "org.nuxeo.elasticsearch.core:pageprovider-test-contrib.xml",
    "org.nuxeo.elasticsearch.core:schemas-test-contrib.xml",
    "org.nuxeo.elasticsearch.core:elasticsearch-test-contrib.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.nativeorder.services.xml"
})
public class FirstVoicesNativeOrderTest {
    @Inject
    protected CoreSession session;

    @Inject
    protected NativeOrderComputeService nativeOrderComputeService;

    @Inject
    protected EventService nxEvent;

    private DocumentModel dialectDoc;

    private DocumentModel word;
    
    //private String[] orderedWords = {"animal", "ʔaʔapp̕iqa", "ʔaḥʔaaʔaaƛ", "ʕaʕac̕ikn̕uk", "aai", "ʔaaʔaƛkʷin", "ʕaanus", "ʔeʔiič’im", "cakaašt", "caqiic ʔiš suč’ačiłał", "cawaak", "caapin", "ciciḥʔaƛmapt", "cuwit", "cuxʷaašt", "c̓iixaat̓akƛinƛ", "čuup", "č’iʔii", "hachaapsim", "hayuxsyuučiƛ", "hayu ʔiš muučiiłał", "k̕uʔihta", "ƛułčakup", "ƛ̕uu-čiƛ", "ma", "mułaa", "m̓am̓iiqsu", "naʔaataḥ", "naw̕ahi", "nunuukma", "piišpiš", "qacc̕a", "qiicqiica", "qiišʔaqƛi", "sasin", "saasin","suč’a","šuuwis", "t̓iqʷas", "uksuukł", "ʔukłaa", "ʕuupqšiƛ", "weʔičʔin", "wiwiiquk", "xʷakak", "yaciicʔił", "yeeł", "y̕eʔisi"};
    // String[] alphabet = {"a","ʔa","ʕa","aa","ʔaa","ʕaa","e","ʔe","ʕe","ee","ʔee","ʕee","c","c̕","č","č’","h","ḥ","i","ʔi","ʕi","ii","ʔii","ʕii","k","k̕","kʷ","k̕ʷ","ł","ƛ","ƛ̕","m","m̕","n","n̕","p","p̕","q","qʷ","s","š","t","t̕","u","ʔu","ʕu","uu","ʔuu","ʕuu","w","w̕","x","x̣","xʷ","x̣ʷ","y","y̕","ʕ","ʔ"};

    // Nisg'a
    private String[] orderedWords = { "adoḵs", "agwii-gin̓am", "aada gadaalee", "la'oo'a'a", "lag̱am-bax̱", "laahitkw" };
    private String[] alphabet = {"a","aa","b","d","e","ee","g","g̱","gw","h","hl","i","ii","j","k","k'","ḵ","ḵ'","kw","kw'","l","Ì","m","m̓","n","n̓","o","oo","p","p'","s","t","t'","tl'","ts","ts'","u","uu","w","w̓","x","x̱","xw","y","y̓","’"};

    private String alphaArr;

    @Before
    public void setUp() throws Exception {
        DocumentModel domain = createDocument(session.createDocumentModel("/", "FV", "Domain"));
        createDialectTree();
        createAlphabet();
        createWords();
    }

    protected void createDialectTree() throws Exception {
        createDocument(session.createDocumentModel("/", "Family", "FVLanguageFamily"));
        createDocument(session.createDocumentModel("/Family", "Language", "FVLanguage"));
        dialectDoc = createDocument(session.createDocumentModel("/Family/Language", "Dialect", "FVDialect"));
    }

    private DocumentModel createDocument(DocumentModel model) {
        model.setPropertyValue("dc:title", model.getName());
        return session.createDocument(model);
    }
    private void createAlphabet() {
        Integer i = 0;
        for (String letter : alphabet) {
            DocumentModel letterDoc = session.createDocumentModel("/Family/Language/Dialect/Alphabet", letter, "FVCharacter");
            letterDoc.setPropertyValue("fvcharacter:alphabet_order", i);
            createDocument(letterDoc);
            i++;
        }
    }
    private DocumentModel createWord(String wordValue, String pv, String v) {
        word = session.createDocumentModel("/Family/Language/Dialect/Dictionary", wordValue, "FVWord");
        if (pv != null) {
            word.setPropertyValue(pv, v);
        }

        word = createDocument(word);

        return word;
    }
    private void createWords() {
        Integer i = 0;
        for (String wordValue : orderedWords) {
            createWord(wordValue, "fv:reference", String.valueOf(i));
            i++;
        }

        session.save();
    }

    private DocumentModel getProxy(DocumentModel model) {
        return session.getProxies(model.getRef(), null).get(0);
    }

    @Test
    public void testDialectOrdering() throws Exception {
       nativeOrderComputeService.computeDialectNativeOrderTranslation(dialectDoc);
       Integer i = orderedWords.length-1;

       DocumentModelList docs = session.query("SELECT * FROM FVWord WHERE ecm:ancestorId='"+dialectDoc.getId()+"' ORDER BY fv:custom_order DESC");

       for (DocumentModel doc : docs) {
           String reference = (String) doc.getPropertyValue("fv:reference");
           assertEquals(i, Integer.valueOf(reference));
           i--;
       }
    }
}