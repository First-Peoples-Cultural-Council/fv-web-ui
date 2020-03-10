package ca.firstvoices.services;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.testUtil.MockStructureTestUtil;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.elasticsearch.test.RepositoryElasticSearchFeature;
import org.nuxeo.runtime.test.runner.*;

import javax.inject.Inject;

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
        "FirstVoicesNuxeoPublisher.tests:OSGI-INF/extensions/fake-directory-sql-contrib.xml"} )
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})

public class UnpublishedChangesServiceImplTest {

    private MockStructureTestUtil testUtil;

    @Inject
    private CoreSession session;

    @Inject
    private UnpublishedChangesService unpublishedChangesServiceInstance;

    @Inject
    private FirstVoicesPublisherService publisherService;

    @Before
    public void setUp() throws Exception {
        testUtil = new MockStructureTestUtil();

        unpublishedChangesServiceInstance = new UnpublishedChangesServiceImpl();

        assertNotNull("Should have a valid session", session);
        assertNotNull("Should have a valid test utilities obj", testUtil);
        assertNotNull("Should have a valid UnpublishedChangesServiceImpl", unpublishedChangesServiceInstance);

        testUtil.createSetup(session);

    }

    @Test
    public void assignAncestors() {

        // Get the DocumentModels for each of the parent documents
        DocumentModel languageFamily = session.getDocument(new PathRef("/FV/Workspaces"));
        assertNotNull("Language family cannot be null", languageFamily);
        DocumentModel language = session.getDocument(new PathRef("/FV/Workspaces/Language"));
        assertNotNull("Language cannot be null", language);
        DocumentModel dialect = testUtil.getCurrentDialect();
        assertNotNull("Dialect cannot be null", dialect);
        DocumentModel dictionary = session.getDocument(new PathRef("/FV/Workspaces/Language/Dialect/Dictionary"));
        assertNotNull("Dictionary cannot be null", dictionary);
        DocumentModel word = session.getDocument(new PathRef("/FV/Workspaces/Language/Dialect/Dictionary/ONE"));
        assertNotNull("Word cannot be null", word);

        DocumentModel publishedWord = publisherService.publish(word);

        assertFalse(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, publishedWord));

        word.setPropertyValue("dc:title", "WordOneTest");
        session.save();
        assertTrue(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, publishedWord));

        session.followTransition(word, "Publish");
//        word.followTransition(session, "Publish");
        assertFalse(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, publishedWord));

    }

}
