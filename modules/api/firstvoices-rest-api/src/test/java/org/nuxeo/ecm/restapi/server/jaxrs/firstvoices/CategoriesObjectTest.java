package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import static org.junit.Assert.assertEquals;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.runner.FirstVoicesCoreTestsFeature;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.inject.Inject;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.client.jaxrs.impl.HttpAutomationClient;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.event.EventService;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.ecm.restapi.test.RestServerFeature;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.ServletContainerFeature;

@RunWith(FeaturesRunner.class)
@Features({RestServerFeature.class, PlatformFeature.class, FirstVoicesCoreTestsFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy({"FirstVoicesREST", "FirstVoicesRESTPageProviders"})
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-language.yaml"})
public class CategoriesObjectTest extends AbstractTestDataCreatorTest {

  @Inject private ServletContainerFeature servletContainerFeature;

  @Inject protected CoreSession session;

  ObjectMapper mapper = new ObjectMapper();

  String categoryID;
  String dialectId;

  @Before
  public void setup() {
    categoryID = dataCreator.getReference(session, "testCategory_proxy").getId();
    dialectId = dataCreator.getReference(session, "testArchive").getId();

  }

  @Test
  public void testCategoryDetails() throws IOException {
    final String url = String.format("http://localhost:%s/api/v1/category/%s?inUseOnly=false",
        servletContainerFeature.getPort(),
        dialectId);

    validateRESTResponse(url, (node, response) -> {

      assertEquals("Unexpected status code", 200, response.getStatusLine().getStatusCode());
      assertEquals("Expect 2 results", 2, node.get("categories").size());
    });
  }


  private void validateRESTResponse(String url, RESTRequestValidator validator) throws IOException {
    HttpClient client = new HttpAutomationClient(url).http();
    HttpGet request = new HttpGet(url);
    String auth = Base64
        .getEncoder()
        .encodeToString("Administrator:Administrator".getBytes(Charset.defaultCharset()));
    request.setHeader("Authorization", "Basic " + auth);
    HttpResponse response = client.execute(request);
    String body =
        IOUtils.toString(response.getEntity().getContent(), StandardCharsets.UTF_8.name());
    JsonNode node = mapper.readTree(body);
    validator.validateResponse(node, response);
  }

  interface RESTRequestValidator {

    void validateResponse(JsonNode node, HttpResponse response);
  }

}
