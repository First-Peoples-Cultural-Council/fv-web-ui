package ca.firstvoices.services;


import ca.firstvoices.testUtil.AbstractTest;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.elasticsearch.test.RepositoryElasticSearchFeature;
import org.nuxeo.runtime.test.runner.*;

import javax.inject.Inject;
import java.util.*;

import static org.junit.Assert.assertNotNull;

@RunWith(FeaturesRunner.class)
@Features({AutomationFeature.class, PlatformFeature.class, RuntimeFeature.class, CoreFeature.class, RepositoryElasticSearchFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)

@Deploy("org.nuxeo.binary.metadata")
@Deploy("org.nuxeo.ecm.platform.url.core")
@Deploy("org.nuxeo.ecm.platform.types.api")
@Deploy("org.nuxeo.ecm.platform.types.core")
@Deploy("org.nuxeo.ecm.platform.filemanager.api")
@Deploy("org.nuxeo.ecm.platform.filemanager.core")
@Deploy("org.nuxeo.ecm.platform.rendition.core")
@Deploy("org.nuxeo.ecm.platform.tag")
@Deploy("org.nuxeo.ecm.platform.commandline.executor")
@Deploy("org.nuxeo.ecm.platform.convert")
@Deploy("org.nuxeo.ecm.platform.preview")

// Audio doctype
@Deploy("org.nuxeo.ecm.platform.audio.core")

// Video doctype
@Deploy("org.nuxeo.ecm.platform.video.convert")
@Deploy("org.nuxeo.ecm.platform.video.core")

// Picture doctype
@Deploy("org.nuxeo.ecm.platform.picture.core")
@Deploy("org.nuxeo.ecm.platform.picture.api")
@Deploy("org.nuxeo.ecm.platform.picture.convert")

// ElasticSearch / Search
@Deploy("org.nuxeo.elasticsearch.core:elasticsearch-test-contrib.xml")
@Deploy("org.nuxeo.ecm.platform.search.core")
@Deploy("org.nuxeo.ecm.platform.webapp.types")

@Deploy("FirstVoicesData:OSGI-INF/services/ca.firstvoices.services.assignancestorsservice.xml")
@Deploy("FirstVoicesData:OSGI-INF/services/ca.firstvoices.services.cleanupcharacterservice.xml")
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})
public class CleanupCharactersServiceImplTest extends AbstractTest {

    @Inject
    private CoreSession session;

    @Inject
    private CleanupCharactersService service;

    private DocumentModel dialect;

    private Map<String, String[]> alphabetAndConfusableCharacters;

    @Before
    public void setUp() throws Exception {
        assertNotNull("Should have a valid session", session);
        createSetup(session);
        dialect = getCurrentDialect();
        alphabetAndConfusableCharacters = new HashMap<>();
        alphabetAndConfusableCharacters.put("a", new String[] {"∀", "ᗄ", "ꓯ"});
        alphabetAndConfusableCharacters.put("b", new String[] {"Ҍ", "ᑳ", "ɓ"});
        alphabetAndConfusableCharacters.put("c", new String[] {"ｃ", "ⅽ", "ℭ"});
        createAlphabetWithConfusableCharacters(alphabetAndConfusableCharacters);
    }

    @After public void tearDown() {
        alphabetAndConfusableCharacters.clear();
    }

    @Test
    public void wordsHaveCorrectCharacter() {
        String[] words = {"∀ᗄꓯ","Ҍᑳɓ","ｃⅽℭ"};
        String[] correctWords = {"aaa", "bbb", "ccc"};
        List<DocumentModel> documentModels = createWords(words);
        for (int i = 0; i < documentModels.size(); i++) {
            DocumentModel documentModel = documentModels.get(i);
            DocumentModel updatedDocument = service.cleanConfusables(documentModel);
            String title = (String) updatedDocument.getPropertyValue("dc:title");
            Assert.assertEquals(correctWords[i], title);
        }
    }

    private void createAlphabetWithConfusableCharacters(Map<String, String[]> alphabet) {
        Iterator it = alphabet.entrySet().iterator();
        int i = 0;
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry)it.next();
            DocumentModel letterDoc = session.createDocumentModel(dialect.getPathAsString() + "/Alphabet", (String) pair.getKey(), "FVCharacter");
            letterDoc.setPropertyValue("fvcharacter:alphabet_order", i);
            letterDoc.setPropertyValue("fvcharacter:confusable_characters", (String[]) pair.getValue());
            createDocument(session, letterDoc);
            i++;
        }
    }

    private  List<DocumentModel> createWords(String[] words) {
        List<DocumentModel> documentModels = new ArrayList<>();
        for (int i = 0; i < words.length; i++) {
            DocumentModel document = session.createDocumentModel(dialect.getPathAsString() + "/Dictionary", words[i], "FVWord");
            document.setPropertyValue("fv:reference", words[i]);
            document = createDocument(session, document);
            documentModels.add(document);
        }
        return documentModels;
    }

}
