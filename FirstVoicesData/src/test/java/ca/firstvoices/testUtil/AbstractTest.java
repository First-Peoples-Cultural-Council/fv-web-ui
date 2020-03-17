package ca.firstvoices.testUtil;

import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.elasticsearch.test.RepositoryElasticSearchFeature;
import org.nuxeo.runtime.test.runner.*;

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
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})
public abstract class AbstractTest {

    private DocumentModel dialectDoc;
    private DocumentModel alphabetDoc;

    public DocumentModel getCurrentDialect() {
        return dialectDoc;
    }

    public DocumentModel getAlphabetDoc() {
        return alphabetDoc;
    }

    public void createSetup(CoreSession session) {
        startFresh(session);

        DocumentModel domain = createDocument(session, session.createDocumentModel("/", "FV", "Domain"));

        createDialectTree(session);

        session.save();
    }

    public DocumentModel createDocument(CoreSession session, DocumentModel model) {
        model.setPropertyValue("dc:title", model.getName());
        DocumentModel newDoc = session.createDocument(model);
        session.save();

        return newDoc;
    }

    public void startFresh(CoreSession session) {
        DocumentRef dRef = session.getRootDocument().getRef();
        DocumentModel defaultDomain = session.getDocument(dRef);

        DocumentModelList children = session.getChildren(defaultDomain.getRef());

        for (DocumentModel child : children) {
            recursiveRemove(session, child);
        }
    }

    private void recursiveRemove(CoreSession session, DocumentModel parent) {
        DocumentModelList children = session.getChildren(parent.getRef());

        for (DocumentModel child : children) {
            recursiveRemove(session, child);
        }

        session.removeDocument(parent.getRef());
        session.save();
    }

    public void createDialectTree(CoreSession session) {
        assertNotNull("Should have a valid FVLanguageFamiliy",
                createDocument(session, session.createDocumentModel("/FV", "Family", "FVLanguageFamily")));
        assertNotNull("Should have a valid FVLanguage",
                createDocument(session, session.createDocumentModel("/FV/Family", "Language", "FVLanguage")));
        dialectDoc = createDocument(session, session.createDocumentModel("/FV/Family/Language", "Dialect", "FVDialect"));
        assertNotNull("Should have a valid FVDialect", dialectDoc);
        alphabetDoc = createDocument(session, session.createDocumentModel(dialectDoc.getPathAsString(), "Alphabet", "FVAlphabet"));
        assertNotNull("Should have a valid FVAlphabet", alphabetDoc);
        assertNotNull("Should have a valid FVDictionary",
                createDocument(session, session.createDocumentModel(dialectDoc.getPathAsString(), "Dictionary", "FVDictionary")));
    }

}
