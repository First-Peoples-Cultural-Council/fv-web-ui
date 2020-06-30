package runner;

import org.nuxeo.directory.test.DirectoryFeature;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.elasticsearch.test.RepositoryElasticSearchFeature;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.PartialDeploy;
import org.nuxeo.runtime.test.runner.RunnerFeature;
import org.nuxeo.runtime.test.runner.TargetExtensions;

@Features({AutomationFeature.class, RepositoryElasticSearchFeature.class, DirectoryFeature.class})
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
@Deploy("org.nuxeo.theme.styling")
@Deploy("org.nuxeo.web.resources.core")

// Video doctype
@Deploy("org.nuxeo.ecm.platform.video.convert")

// Picture doctype
@Deploy("org.nuxeo.ecm.platform.picture.core")
@Deploy("org.nuxeo.ecm.platform.picture.api")
@Deploy("org.nuxeo.ecm.platform.picture.convert")

// ElasticSearch / Search
@Deploy("org.nuxeo.elasticsearch.core:elasticsearch-test-contrib.xml")
@Deploy("org.nuxeo.ecm.platform.search.core")
@Deploy("org.nuxeo.ecm.platform.webapp.types")

@Deploy("FirstVoicesOperations:OSGI-INF/dialect/categories/categories-operations.xml")
@Deploy("FirstVoicesOperations:OSGI-INF/dialect/categories/categories-services.xml")
@Deploy("FirstVoicesOperations:OSGI-INF/dialect/assets/assets-services.xml")
@Deploy("FirstVoicesOperations:OSGI-INF/dialect/assets/assets-operations.xml")
@Deploy("FirstVoicesOperations:OSGI-INF/dialect/visibility/visibility-operations.xml")
@Deploy("FirstVoicesOperations:OSGI-INF/dialect/visibility/visibility-services.xml")

@Deploy("FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml")

@Deploy("FirstVoicesOperations:OSGI-INF/dialect/tasks/tasks-operations.xml")
@Deploy("FirstVoicesOperations:OSGI-INF/dialect/tasks/tasks-services.xml")

@Deploy("org.nuxeo.ecm.platform.routing.core")

@Deploy("org.nuxeo.ecm.platform")
@Deploy("org.nuxeo.ecm.platform.content.template")
@Deploy("org.nuxeo.ecm.automation.core")
@Deploy("org.nuxeo.ecm.platform.task.api")
@Deploy("org.nuxeo.ecm.platform.task.core")
@Deploy("org.nuxeo.ecm.automation.server")
@Deploy("org.nuxeo.ecm.platform.usermanager")
@Deploy("org.nuxeo.ecm.platform.query.api")
@Deploy("org.nuxeo.ecm.platform.test:test-usermanagerimpl/directory-config.xml")

@Deploy("org.nuxeo.ecm.platform.comment.api")
@Deploy("org.nuxeo.ecm.platform.query.api")
@Deploy("org.nuxeo.ecm.platform.comment")

@Deploy({"org.nuxeo.ecm.platform.types.core", "org.nuxeo.ecm.platform.publisher.core",
    "org.nuxeo.ecm.platform.picture.core", "org.nuxeo.ecm.platform.video.core",
    "org.nuxeo.ecm.platform.audio.core", "org.nuxeo.ecm.automation.scripting", "FirstVoicesData",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.schemas.ProxySchema.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.services.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.listeners"
        + ".ProxyPublisherListener.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.nativeorder.services.xml"})

@Deploy("FirstVoicesData")
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})
public class FirstVoicesOperationsFeature implements RunnerFeature {

}
