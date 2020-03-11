package ca.firstvoices.services;

import ca.firstvoices.testUtil.MockStructureTestUtil;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.elasticsearch.test.RepositoryElasticSearchFeature;
import org.nuxeo.runtime.test.runner.*;

import javax.inject.Inject;
import javax.print.Doc;

import static org.junit.Assert.*;

import ca.firstvoices.utils.CustomSecurityConstants;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.test.runner.*;

import javax.inject.Inject;
import javax.security.auth.login.LoginException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import static org.junit.Assert.*;

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

@Deploy( {"FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.services.xml",
        "FirstVoicesData",
        "org.nuxeo.ecm.platform",
        "org.nuxeo.ecm.platform.commandline.executor",
        "org.nuxeo.ecm.platform.picture.core",
        "org.nuxeo.ecm.platform.rendition.core",
        "org.nuxeo.ecm.platform.video.core",
        "org.nuxeo.ecm.platform.audio.core",
        "org.nuxeo.ecm.automation.scripting",
        "org.nuxeo.ecm.platform.web.common",
        "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
        "org.nuxeo.elasticsearch.core:pageprovider-test-contrib.xml",
        "org.nuxeo.elasticsearch.core:schemas-test-contrib.xml",
        "org.nuxeo.elasticsearch.core:elasticsearch-test-contrib.xml",
        "FirstVoicesNuxeoPublisher.tests:OSGI-INF/extensions/fake-load-actions.xml",
        "FirstVoicesNuxeoPublisher.tests:OSGI-INF/extensions/fake-load-es-provider.xml",
        "FirstVoicesNuxeoPublisher.tests:OSGI-INF/extensions/fake-directory-sql-contrib.xml",
        "FirstVoicesNuxeoPublisher.tests:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml",
        "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
        "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.schemas.ProxySchema.xml",
        "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.services.xml",
        "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.listeners.ProxyPublisherListener.xml",
        "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.nativeorder.services.xml",
        "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",
        "org.nuxeo.ecm.platform.types.core", "org.nuxeo.ecm.platform.publisher.core",
        "org.nuxeo.ecm.platform.picture.core", "org.nuxeo.ecm.platform.video.core", "org.nuxeo.ecm.platform.audio.core",
        "org.nuxeo.ecm.automation.scripting","FirstVoicesData",
} )
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})

public class UnpublishedChangesServiceImplTest {

    private MockStructureTestUtil testUtil;

    @Inject
    private CoreSession session;

    @Inject
    private UnpublishedChangesService unpublishedChangesServiceInstance;

    @Inject
    protected PublisherService publisherService;

    private DocumentModel domain;

    private DocumentModel sectionRoot;

    private DocumentModel languageDoc;

    private DocumentModel dialectDoc;

    private DocumentModel familyDoc;

    @Inject
    protected FirstVoicesPublisherService dialectPublisherService;

    private DocumentModel category;

    private DocumentModel subcategory;

    private DocumentModel contributor2;

    private DocumentModel contributor;

    private DocumentModel picture;

    private DocumentModel audio;

    private DocumentModel video;

    private DocumentModel word;

    private DocumentModel portal;

    private DocumentModel link;

    private DocumentModel link2;

//    DocumentModel domain;
//    DocumentModel sectionsRoot;
//    DocumentModel dialectTest;
//    DocumentModel dialectTestDictionary;
//    DocumentModel testWord;
//    DocumentModel sectionsWord;

    public static final String SCHEMA_PUBLISHING = "publishing";

    public static final String SECTIONS_PROPERTY_NAME = "publish:sections";

    @Before
    public void setUp() throws Exception {
//        testUtil = new MockStructureTestUtil();

        unpublishedChangesServiceInstance = new UnpublishedChangesServiceImpl();

        assertNotNull("Should have a valid session", session);
//        assertNotNull("Should have a valid test utilities obj", testUtil);
        assertNotNull("Should have a valid UnpublishedChangesServiceImpl", unpublishedChangesServiceInstance);

        session.removeChildren(session.getRootDocument().getRef());
        session.save();

        domain = session.createDocument(session.createDocumentModel("/", "FV", "Domain"));
        sectionRoot = publisherService.getRootSectionFinder(session).getDefaultSectionRoots(true, true).get(0);
        createDialectTree();

        // Publishing dialect
        session.followTransition(dialectDoc, "Publish");
        DocumentModel section = sectionRoot;

////        testUtil.createSetup(session);
//        session.removeChildren(session.getRootDocument().getRef());
//
//        domain = session.createDocument(session.createDocumentModel("/", "FV", "Domain"));
//        sectionsRoot = publisherService.getRootSectionFinder(session).getDefaultSectionRoots(true, true).get(0);
//
//        session.createDocument(session.createDocumentModel("/FV/", "Workspaces", "WorkspaceRoot"));
//        session.createDocument(session.createDocumentModel("/FV/", "sections", "SectionRoot"));
//
//        DocumentModel target = session.getDocument(new PathRef("/FV/sections/Data"));
//        String targetSectionId = target.getId();
//        DocumentModel sourceDoc = session.getDocument(new PathRef("/FV/Workspaces/Data"));
//        addSection(targetSectionId, sourceDoc);
//
//        session.createDocument(session.createDocumentModel("/FV/Workspaces", "Data", "Workspace"));
//        session.createDocument(session.createDocumentModel("/FV/sections", "Data", "Workspace"));
//
//
//        DocumentModel familyDoc = session.createDocument(session.createDocumentModel("/FV/Workspaces/Data", "Family", "FVLanguageFamily"));
//        session.createDocument(session.createDocumentModel("/FV/sections/Data", "Family", "FVLanguageFamily"));
//
//
//        session.createDocument(session.createDocumentModel("/FV/Workspaces/Data/Family", "Language", "FVLanguage"));
//        session.createDocument(session.createDocumentModel("/FV/sections/Data/Family", "Language", "FVLanguage"));
//
//        session.save();
//
//
//
//        dialectTest = session.createDocument(session.createDocumentModel("/FV/Workspaces/Data/Family/Language", "TestLang", "FVDialect"));
//        dialectTest.followTransition("Enable");
//        dialectTest = session.saveDocument(dialectTest);
//        dialectPublisherService.publishDialect(dialectTest);
//
////        dialectTestDictionary = session.createDocument(session.createDocumentModel("/FV/Workspaces/Data/Family/Language/TestLang", "Dictionary", "FVDictionary"));
////        dialectTestDictionary = session.saveDocument(dialectTestDictionary);
//
//        assertNotNull(dialectTest);
//
////        testWord = session.createDocument(session.createDocumentModel("/FV/Workspaces/Data/Family/Language/TestLang/Dictionary", "TestWord", "FVWord"));
////        testWord = session.saveDocument(testWord);
////        assertNotNull(testWord);
//        testWord = createWord();
//
////        session.followTransition(testWord, "Publish");
//        dialectTest.followTransition("Publish");
//        session.saveDocument(dialectTest);
//
//        testWord.followTransition("Publish");
//        session.saveDocument(testWord);
//
////        DocumentModel section = sectionsRoot;
////        section = session.getChild(section.getRef(), testWord.getName());
////        assertNotNull(section);
//
//        // Get sections document (automatically created)
//        DocumentModelList docTwo = session.query("SELECT * FROM Document WHERE ecm:path = '/FV/sections/Data/Family/Language/TestLang/Dictionary/TestWord'");
//        sectionsWord = docTwo.get(0);

    }

    @After
    public void cleanup() {
        session.removeChildren(session.getRootDocument().getRef());
        session.save();
    }

    @Test
    public void testDialectFactory() throws Exception {
        DocumentModel dialect = dialectDoc;
        // Check the factory is doing its job - check template
        DocumentModel child = session.getChild(dialect.getRef(), "Contributors");
        assertNotNull(child);
        assertEquals("FVContributors", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Dictionary");
        assertNotNull(child);
        assertEquals("FVDictionary", child.getDocumentType().getName());
//        child = session.getChild(dialect.getRef(), "Forum");
//        assertNotNull(child);
//        assertEquals("Forum", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Portal");
        assertNotNull(child);
        assertEquals("FVPortal", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Alphabet");
        assertNotNull(child);
        assertEquals("FVAlphabet", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Resources");
        assertNotNull(child);
        assertEquals("FVResources", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Categories");
        assertNotNull(child);
        assertEquals("FVCategories", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Links");
        assertNotNull(child);
        assertEquals("FVLinks", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Stories & Songs");
        assertNotNull(child);
        assertEquals("FVBooks", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Phrase Books");
        assertNotNull(child);
        assertEquals("FVCategories", child.getDocumentType().getName());
    }

    @Test
    public void assignAncestors() {

        assertFalse(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, dialectDoc));
        int majorVerSections = Integer.parseInt(dialectDoc.getPropertyValue("uid:major_version").toString());
        int minorVerSections = Integer.parseInt(dialectDoc.getPropertyValue("uid:minor_version").toString());
        System.out.println("HERE1_______________________________________" + majorVerSections + "." + minorVerSections);
        dialectDoc.setPropertyValue("dc:title", "WordOneTest");
        dialectDoc = session.saveDocument(dialectDoc);

        majorVerSections = Integer.parseInt(dialectDoc.getPropertyValue("uid:major_version").toString());
        minorVerSections = Integer.parseInt(dialectDoc.getPropertyValue("uid:minor_version").toString());

        System.out.println("HERE2_______________________________________" + majorVerSections + "." + minorVerSections);

        assertTrue(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, dialectDoc));

        // Get the DocumentModels for each of the parent documents
//        DocumentModel languageFamily = session.getDocument(new PathRef("/FV/Workspaces"));
//        assertNotNull("Language family cannot be null", languageFamily);
//        DocumentModel language = session.getDocument(new PathRef("/FV/Workspaces/Language"));
//        assertNotNull("Language cannot be null", language);
//        DocumentModel dialect = testUtil.getCurrentDialect();
//        assertNotNull("Dialect cannot be null", dialect);
//        DocumentModel dictionary = session.getDocument(new PathRef("/FV/Workspaces/Language/Dialect/Dictionary"));
//        assertNotNull("Dictionary cannot be null", dictionary);
//        DocumentModel word = session.getDocument(new PathRef("/FV/Workspaces/Language/Dialect/Dictionary/ONE"));
//        assertNotNull("Word cannot be null", word);

//        DocumentModel publishedWord = publisherService.publish(word);

//        assertFalse(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, testWord));
//
//        testWord.setPropertyValue("dc:title", "WordOneTest");
//        session.save();
//        assertTrue(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, testWord));
//
//        session.followTransition(testWord, "Publish");
////        word.followTransition(session, "Publish");
//        assertFalse(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, testWord));

    }

    protected void createDialectTree() throws Exception {
        familyDoc = session.createDocument(session.createDocumentModel("/", "Family", "FVLanguageFamily"));
        familyDoc = session.createDocument(session.createDocumentModel("/", "Family", "FVLanguageFamily"));
        languageDoc = session.createDocument(session.createDocumentModel("/Family", "Language", "FVLanguage"));
        dialectDoc = session.createDocument(session.createDocumentModel("/Family/Language", "Dialect", "FVDialect"));
        dialectDoc.followTransition("Enable");
    }

    /*
        Helper method to set a publication target for a document.
     */
//    private void addSection(String targetSectionId, DocumentModel sourceDocument) {
//
//        if (targetSectionId != null && sourceDocument.hasSchema(SCHEMA_PUBLISHING)) {
//            String[] sectionIdsArray = (String[]) sourceDocument.getPropertyValue(SECTIONS_PROPERTY_NAME);
//
//            List<String> sectionIdsList = new ArrayList<String>();
//
//            if (sectionIdsArray != null && sectionIdsArray.length > 0) {
//                sectionIdsList = Arrays.asList(sectionIdsArray);
//                // make it resizable
//                sectionIdsList = new ArrayList<String>(sectionIdsList);
//            }
//
//            sectionIdsList.add(targetSectionId);
//            String[] sectionIdsListIn = new String[sectionIdsList.size()];
//            sectionIdsList.toArray(sectionIdsListIn);
//
//            sourceDocument.setPropertyValue(SECTIONS_PROPERTY_NAME, sectionIdsListIn);
//            session.saveDocument(sourceDocument);
//            session.save();
//        }
//    }

    private DocumentModel createWord() {
        DocumentModel category = session.createDocument(
                session.createDocumentModel("/FV/Workspaces/Data/Family/Language/Dialect/Categories", "Category", "FVCategory"));
        DocumentModel subcategory = session.createDocument(session.createDocumentModel("/FV/Workspaces/Data/Family/Language/Dialect/Categories/Category",
                "SubCategory", "FVCategory"));
        DocumentModel contributor = session.createDocument(
                session.createDocumentModel("/FV/Workspaces/Data/Family/Language/Dialect/Contributors", "myContributor", "FVContributor"));
        DocumentModel contributor2 = session.createDocument(session.createDocumentModel("/FV/Workspaces/Data/Family/Language/Dialect/Contributors",
                "myContributor2", "FVContributor"));
        DocumentModel picture = session.createDocument(
                session.createDocumentModel("/FV/Workspaces/Data/Family/Language/Dialect/Resources", "myPicture", "FVPicture"));
        DocumentModel audio = session.createDocument(
                session.createDocumentModel("/FV/Workspaces/Data/Family/Language/Dialect/Resources", "myAudio", "FVAudio"));
        DocumentModel video = session.createDocument(
                session.createDocumentModel("/FV/Workspaces/Data/Family/Language/Dialect/Resources", "myVideo", "FVVideo"));
        DocumentModel word = session.createDocumentModel("/FV/Workspaces/Data/Family/Language/Dialect/Dictionary", "myWord1", "FVWord");
        String[] values = new String[1];
        values[0] = audio.getId();
        word.setPropertyValue("fvcore:related_audio", values);
        values = new String[1];
        values[0] = picture.getId();
        word.setPropertyValue("fvcore:related_pictures", values);
        values = new String[1];
        values[0] = video.getId();
        word.setPropertyValue("fvcore:related_videos", values);
        values = new String[1];
        values[0] = subcategory.getId();
        word.setPropertyValue("fv-word:categories", values);
        values = new String[2];
        values[0] = contributor.getId();
        values[1] = contributor2.getId();
        word.setPropertyValue("fvcore:source", values);
        word = session.createDocument(word);

        return word;
    }

}
