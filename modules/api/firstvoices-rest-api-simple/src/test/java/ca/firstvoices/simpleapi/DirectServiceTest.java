package ca.firstvoices.simpleapi;

import static org.junit.Assert.assertTrue;
import ca.firstvoices.simpleapi.model.QueryBean;
import ca.firstvoices.simpleapi.representations.SiteOverview;
import ca.firstvoices.simpleapi.representations.containers.Metadata;
import ca.firstvoices.simpleapi.services.FirstVoicesService;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import java.util.List;
import java.util.logging.Logger;
import javax.inject.Inject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({PlatformFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.CLASS)
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-language.yaml"})
@Deploy("FirstVoicesSimplifiedAPI")
public class  DirectServiceTest extends AbstractTestDataCreatorTest {

  private static final Logger log = Logger.getLogger(DirectServiceTest.class.getCanonicalName());

  @Inject
  protected FirstVoicesService fvs;

  @Test
  public void testServiceDirectly() {
    QueryBean qb = new QueryBean();
    qb.index = 0;
    qb.pageSize = 30;
    Metadata<List<SiteOverview>> sites = fvs.getSites(qb);
    assertTrue("nonzero returned site count", sites.getCount() > 1);
  }

}
