package ca.firstvoices.simpleapi;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import ca.firstvoices.simpleapi.utils.JerseyTestHelper;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import ca.firstvoices.testUtil.helpers.RESTTestHelper;
import java.util.logging.Logger;
import javax.inject.Inject;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
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
@SuppressWarnings("java:S2699") // Sonarqube does not inspect nested calls intelligently
public class SimplifiedAPITest extends AbstractTestDataCreatorTest {

  private static final Logger log = Logger.getLogger(SimplifiedAPITest.class.getCanonicalName());

  private static final JerseyTestHelper jersey = JerseyTestHelper.instance();

  @BeforeClass
  public static void setup() throws Exception {
    jersey.start(rc -> {
    });
  }

  @AfterClass
  public static void shutdown() {
    jersey.shutdown();
  }

  @Test
  public void testGetUser() {
    final String url = jersey.getUrl("/v1/users/current");
    RESTTestHelper.builder(url).withAdministratorBasicAuth().execute();
  }

  @Test
  public void testGetSites() {
    final String url = jersey.getUrl("/v1/sites");

    RESTTestHelper.builder(url).withAdministratorBasicAuth().execute(
        (node, response) -> {
          assertEquals("Unexpected status code", 200, response.getStatusLine().getStatusCode());
          assertTrue("Records are returned", node.get("detail").size() > 0);

          node.get("detail").elements().forEachRemaining(e -> {
            System.out.println("Contains nodes: " + e.toString());
          });
        }
    );
  }

  @Inject
  CoreSession session;

  @Test
  public void testGetSiteOK() {
    final String url = jersey.getUrl(
        "/v1/sites/" + this.dataCreator.getReference("testArchive_proxy")
    );

    RESTTestHelper.builder(url).withAdministratorBasicAuth().execute(
        (node, response) -> {
          assertEquals("Unexpected status code", 200, response.getStatusLine().getStatusCode());
          assertNotNull("Records are returned", node.get("detail"));

          node.get("detail").elements().forEachRemaining(e -> {
            System.out.println("Contains nodes: " + e.toString());
          });
        }
    );
  }

  @Test
  public void testMissingSite404() {
    final String url = jersey.getUrl("/v1/sites/asdf12345");
    RESTTestHelper.builder(url).withAdministratorBasicAuth().withExpectedStatusCode(404).execute();
  }

  @Test
  public void testGetSiteWords() {
    final String url = jersey.getUrl(
        "/v1/sites/" + this.dataCreator.getReference("testArchive_proxy") + "/words"
    );

    RESTTestHelper.builder(url).withAdministratorBasicAuth().execute(
        (node, response) -> {
          assertEquals("Unexpected status code", 200, response.getStatusLine().getStatusCode());
          assertNotNull("Records are returned", node.get("detail"));

          node.get("detail").elements().forEachRemaining(e -> {
            System.out.println("Contains nodes: " + e.toString());
          });
        }
    );
  }

  @Test
  public void testGetSitePhrases() {
    final String url = jersey.getUrl(
        "/v1/sites/" + this.dataCreator.getReference("testArchive_proxy") + "/phrases"
    );

    RESTTestHelper.builder(url).withAdministratorBasicAuth().execute(
        (node, response) -> {
          assertEquals("Unexpected status code", 200, response.getStatusLine().getStatusCode());
          assertNotNull("Records are returned", node.get("detail"));

          node.get("detail").elements().forEachRemaining(e -> {
            System.out.println("Contains nodes: " + e.toString());
          });
        }
    );
  }

  @Test
  public void testGetSiteSongs() {
    final String url = jersey.getUrl(
        "/v1/sites/" + this.dataCreator.getReference("testArchive_proxy") + "/songs"
    );

    RESTTestHelper.builder(url).withAdministratorBasicAuth().execute(
        (node, response) -> {
          assertEquals("Unexpected status code", 200, response.getStatusLine().getStatusCode());
          assertNotNull("Records are returned", node.get("detail"));

          node.get("detail").elements().forEachRemaining(e -> {
            System.out.println("Contains nodes: " + e.toString());
          });
        }
    );
  }

  @Test
  public void testGetSharedCategories() {
    final String url = jersey.getUrl("/v1/shared/categories");

    RESTTestHelper.builder(url).withAdministratorBasicAuth().execute(
        (node, response) -> {
          assertEquals("Unexpected status code", 200, response.getStatusLine().getStatusCode());
          assertNotNull("Records are returned", node.get("detail"));

          node.get("detail").elements().forEachRemaining(e -> {
            System.out.println("Contains nodes: " + e.toString());
          });
        }
    );
  }

  @Test
  public void testGetSharedLinks() {
    final String url = jersey.getUrl("/v1/shared/links");

    RESTTestHelper.builder(url).withAdministratorBasicAuth().execute(
        (node, response) -> {
          assertEquals("Unexpected status code", 200, response.getStatusLine().getStatusCode());
          assertNotNull("Records are returned", node.get("detail"));

          node.get("detail").elements().forEachRemaining(e -> {
            System.out.println("Contains nodes: " + e.toString());
          });
        }
    );
  }

  @Test
  public void testGetSharedMedia() {
    final String url = jersey.getUrl("/v1/shared/media");

    RESTTestHelper.builder(url).withAdministratorBasicAuth().execute(
        (node, response) -> {
          assertEquals("Unexpected status code", 200, response.getStatusLine().getStatusCode());
          assertNotNull("Records are returned", node.get("detail"));

          node.get("detail").elements().forEachRemaining(e -> {
            System.out.println("Contains nodes: " + e.toString());
          });
        }
    );
  }

}
