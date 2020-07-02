package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import static org.junit.Assert.assertEquals;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.concurrent.TimeUnit;
import javax.inject.Inject;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.client.jaxrs.impl.HttpAutomationClient;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.ecm.restapi.test.BaseTest;
import org.nuxeo.ecm.restapi.test.RestServerFeature;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.PartialDeploy;
import org.nuxeo.runtime.test.runner.ServletContainerFeature;
import org.nuxeo.runtime.test.runner.TargetExtensions;
import org.nuxeo.runtime.transaction.TransactionHelper;

@RunWith(FeaturesRunner.class)
@Features({RestServerFeature.class, PlatformFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)

@Deploy("org.nuxeo.binary.metadata")
@Deploy("org.nuxeo.ecm.platform.url.core")
@Deploy("org.nuxeo.ecm.platform.types.api")
@Deploy("org.nuxeo.ecm.platform.types.core")
@Deploy("org.nuxeo.ecm.platform.webapp.types")
@Deploy("org.nuxeo.ecm.platform.publisher.core")
@Deploy("FirstVoicesData:OSGI-INF/ca.firstvoices.listeners.xml")
@Deploy("FirstVoicesData:OSGI-INF/ca.firstvoices.operations.xml")
@Deploy({"FirstVoicesREST", "FirstVoicesRESTPageProviders", "FirstVoicesNuxeoPublisher"})
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})
public class CategoriesObjectTest extends BaseTest {

  @Inject
  FirstVoicesPublisherService publisherService;

  @Inject
  private ServletContainerFeature servletContainerFeature;

  @Inject
  protected CoreSession session;

  private String categoryID;

  public void createDialectTree(CoreSession session) throws InterruptedException {
    session.removeChildren(session.getRootDocument().getRef());
    session.save();

    session.createDocument(session.createDocumentModel("/", "FV", "Domain"));
    session.createDocument(session.createDocumentModel("/FV", "Workspaces", "WorkspaceRoot"));
    session.createDocument(session.createDocumentModel("/FV/Workspaces", "Data", "Workspace"));

    DocumentModel workspaceLanguageFamily = session.createDocument(
        session.createDocumentModel("/FV/Workspaces/Data", "Family", "FVLanguageFamily")
    );

    session.saveDocument(workspaceLanguageFamily);

    session.createDocument(
        session.createDocumentModel("/FV/Workspaces/Data/Family", "Language", "FVLanguage")
    );

    DocumentModel workspaceDialect = session.createDocument(
        session.createDocumentModel("/FV/Workspaces/Data/Family/Language", "Dialect", "FVDialect")
    );
    workspaceDialect = session.saveDocument(workspaceDialect);

    DocumentModel testCategory = session.createDocument(
        session.createDocumentModel(
            "/FV/Workspaces/Data/Family/Language/Dialect/Categories",
            "Test Category",
            "FVCategory")
    );
    session.saveDocument(testCategory);
    DocumentModel testSubCategory = session.createDocument(
        session.createDocumentModel(
            "/FV/Workspaces/Data/Family/Language/Dialect/Categories/Test Category",
            "Subcategory",
            "FVCategory"));
    session.saveDocument(testSubCategory);

    DocumentModel wsd = publisherService.publish(workspaceDialect);
    session.saveDocument(wsd);

    DocumentModel cat = publisherService.publish(testCategory);
    publisherService.publish(testSubCategory);
    categoryID = cat.getId();

    session.save();

    TransactionHelper.commitOrRollbackTransaction();
    Framework.getService(WorkManager.class).awaitCompletion(10L, TimeUnit.SECONDS);
  }

  @Before
  public void setUp() throws InterruptedException {
    createDialectTree(session);
  }

  @Test
  public void testCategoryDetails() throws IOException {
    final String url = String.format("http://localhost:%s/api/v1/category/%s",
        servletContainerFeature.getPort(),
        categoryID);

    validateRESTResponse(url, (node, response) -> {
      assertEquals("Unexpected status code", 200, response.getStatusLine().getStatusCode());
      assertEquals("Expect one result", 1, node.get("entries").size());
    });
  }

  @Test
  public void testPublicCategories() throws IOException {
    final String url = String.format(
        "http://localhost:%s/api/v1/category",
        servletContainerFeature.getPort()
    );

    validateRESTResponse(url, (node, response) -> {
      assertEquals("Unexpected status code", 200, response.getStatusLine().getStatusCode());
      assertEquals("Expect two results", 2, node.get("entries").size());
    });
  }


  @Test
  public void testNonPublicCategories() throws IOException {
    final String url = String.format(
        "http://localhost:%s/api/v1/category?publicOnly=false",
        servletContainerFeature.getPort()
    );

    validateRESTResponse(url, (node, response) -> {
      assertEquals("Unexpected status code", 200, response.getStatusLine().getStatusCode());
      assertEquals("Expect four results", 4, node.get("entries").size());
    });

  }

  private void validateRESTResponse(String url, RESTRequestValidator validator) throws IOException {
    HttpClient client = new HttpAutomationClient(url).http();
    HttpGet request = new HttpGet(url);
    String auth = Base64.getEncoder()
        .encodeToString("Administrator:Administrator".getBytes(Charset.defaultCharset()));
    request.setHeader("Authorization", "Basic " + auth);
    HttpResponse response = client.execute(request);
    String body = IOUtils.toString(
        response.getEntity().getContent(),
        StandardCharsets.UTF_8.name()
    );
    JsonNode node = mapper.readTree(body);
    validator.validateResponse(node, response);
  }

  interface RESTRequestValidator {
    void validateResponse(JsonNode node, HttpResponse response);
  }

}
