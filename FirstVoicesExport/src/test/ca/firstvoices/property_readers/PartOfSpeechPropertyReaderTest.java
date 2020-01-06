package ca.firstvoices.property_readers;

import com.google.inject.Inject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.event.EventService;
import org.nuxeo.ecm.core.event.impl.EventListenerDescriptor;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.test.runner.*;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

@RunWith(FeaturesRunner.class)
@Features({RuntimeFeature.class, CoreFeature.class, AutomationFeature.class } )
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy( {"FirstVoicesData",
        "org.nuxeo.ecm.platform",
        "org.nuxeo.ecm.platform.commandline.executor",
        "org.nuxeo.ecm.platform.picture.core",
        "org.nuxeo.ecm.platform.rendition.core",
        "org.nuxeo.ecm.platform.video.core",
        "org.nuxeo.ecm.platform.audio.core",
        "org.nuxeo.ecm.automation.scripting",
        "org.nuxeo.ecm.platform.web.common",
        "org.nuxeo.ecm.core.event",
        "FirstVoicesExport:OSGI-INF/extensions/ca.firstvoices.blobmgr.xml",
        "FirstVoicesExport:OSGI-INF/extensions/ca.firstvoices.listeners.xml",
        "FirstVoicesExport:OSGI-INF/extensions/ca.firstvoices.operations.xml",
        "FirstVoicesExport:OSGI-INF/extensions/ca.firstvoices.schedulers.xml",
        "FirstVoicesExport:OSGI-INF/extensions/ca.firstvoices.type.xml",
        "FirstVoicesExport:OSGI-INF/extensions/ca.firstvoices.workers.xml",
        "FirstVoicesExport:schemas/fvexport.xsd"})
@Deploy( {
        "org.nuxeo.elasticsearch.core:pageprovider-test-contrib.xml",
        "org.nuxeo.elasticsearch.core:schemas-test-contrib.xml",
        "org.nuxeo.elasticsearch.core:elasticsearch-test-contrib.xml",
        "FirstVoicesExport:OSGI-INF/extensions/fake-load-actions.xml",
        "FirstVoicesExport:OSGI-INF/extensions/fake-load-es-provider.xml",
        "FirstVoicesExport:OSGI-INF/extensions/fake-directory-sql-contrib.xml"} )

public class PartOfSpeechPropertyReaderTest
{

}