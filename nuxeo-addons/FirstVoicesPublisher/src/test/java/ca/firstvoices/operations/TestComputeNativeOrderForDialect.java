package ca.firstvoices.operations;

import static org.junit.Assert.assertEquals;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.test.runner.*;

import ca.firstvoices.nativeorder.operations.ComputeNativeOrderForDialect;

@RunWith(FeaturesRunner.class)
@Features({RuntimeFeature.class, CoreFeature.class, AutomationFeature.class })
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy( {"studio.extensions.First-Voices",
        "org.nuxeo.ecm.automation.jsf",
        "org.nuxeo.ecm.platform",
        "org.nuxeo.ecm.platform.commandline.executor",
        "org.nuxeo.ecm.platform.picture.core",
        "org.nuxeo.ecm.platform.rendition.core",
        "org.nuxeo.ecm.platform.video.core",
        "org.nuxeo.ecm.platform.audio.core",
        "org.nuxeo.ecm.automation.scripting",
        "FirstVoicesNuxeoPublisher"})
@LocalDeploy({
        "org.nuxeo.ecm.platform.forum.core:OSGI-INF/forum-schemas-contrib.xml",
        "org.nuxeo.elasticsearch.core:pageprovider-test-contrib.xml",
        "org.nuxeo.elasticsearch.core:schemas-test-contrib.xml",
        "org.nuxeo.elasticsearch.core:elasticsearch-test-contrib.xml",
        "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml",
        "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",
})
public class TestComputeNativeOrderForDialect {

    @Inject
    protected CoreSession session;

    @Inject
    protected AutomationService automationService;

    DocumentModel dialectDoc = null;

    @Before
    public void setUp() throws Exception {
        DocumentModel domain = session.createDocument(session.createDocumentModel("/", "FV", "Domain"));
        DocumentModel familyDoc = session.createDocument(session.createDocumentModel("/", "Family", "FVLanguageFamily"));
        DocumentModel languageDoc = session.createDocument(session.createDocumentModel("/Family", "Language", "FVLanguage"));

        dialectDoc = session.createDocument(session.createDocumentModel("/Family/Language", "Dialect", "FVDialect"));
    }

    @Test
    public void shouldCallTheOperation() throws OperationException {
        OperationContext ctx = new OperationContext(session);
        ctx.setInput(dialectDoc);

        DocumentModel doc = (DocumentModel) automationService.run(ctx, ComputeNativeOrderForDialect.ID);
        assertEquals("/Family/Language/Dialect", doc.getPathAsString());
    }

    @Test
    public void shouldCallWithParameters() throws OperationException {
        final String path = "/default-domain";
        OperationContext ctx = new OperationContext(session);
        ctx.setInput(dialectDoc);

        Map<String, Object> params = new HashMap<>();
        params.put("path", path);
        DocumentModel doc = (DocumentModel) automationService.run(ctx, ComputeNativeOrderForDialect.ID, params);
        assertEquals("/Family/Language/Dialect", doc.getPathAsString());
    }
}
