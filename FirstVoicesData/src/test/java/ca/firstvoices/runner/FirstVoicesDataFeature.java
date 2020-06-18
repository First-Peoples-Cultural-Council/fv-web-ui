package ca.firstvoices.runner;

import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.PartialDeploy;
import org.nuxeo.runtime.test.runner.RunnerFeature;
import org.nuxeo.runtime.test.runner.TargetExtensions;

@Features({AutomationFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)

@Deploy("FirstVoicesData:OSGI-INF/services/ca.firstvoices.services.sanitize.xml")
@Deploy("FirstVoicesData:OSGI-INF/services/ca.firstvoices.services.assignancestorsservice.xml")
@Deploy("FirstVoicesData:OSGI-INF/services/ca.firstvoices.services.cleanupcharacterservice.xml")
@Deploy("FirstVoicesData:OSGI-INF/services/ca.firstvoices.services.addconfusablesservice.xml")
@Deploy("FirstVoicesData:OSGI-INF/ca.firstvoices.operations.xml")
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})
public class FirstVoicesDataFeature implements RunnerFeature {

}
