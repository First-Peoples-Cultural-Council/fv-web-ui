package ca.firstvoices.testUtil.helpers;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.logging.Logger;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpHead;
import org.apache.http.client.methods.HttpOptions;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpUriRequest;
import org.nuxeo.ecm.automation.client.jaxrs.impl.HttpAutomationClient;

/** @author Rob J
 *
 * Fluent API. Intended to make testing of REST services less verbose.
 * See examples in FirstVoicesSimplifiedAPI tests
**/
public class RESTTestHelper {
  private static Logger log = Logger.getLogger(RESTTestHelper.class.getCanonicalName());

  public enum Verb {
    GET,
    POST,
    PUT,
    HEAD,
    OPTIONS,
    DELETE
  }

  public interface RESTResponseValidator {
    void validateResponse(JsonNode node, HttpResponse response);
  }

  public static class Builder {
    private final String url;
    private Verb verb = Verb.GET;
    private int expectedStatusCode = 200;
    private String accept = "application/json";
    private String authHeader = null;

    private RESTResponseValidator validator = (node, response) -> {
      log.info("Default validator implementation is checking for %s response");
      int httpStatusCode = response.getStatusLine().getStatusCode();
      assertEquals("Status should equal expected code", httpStatusCode, expectedStatusCode);
    };

    public Builder withVerb(Verb verb) {
      this.verb = verb;
      return this;
    }

    public Builder withExpectedStatusCode(int expectedStatusCode) {
      this.expectedStatusCode = expectedStatusCode;
      return this;
    }

    public Builder withValidator(RESTResponseValidator validator) {
      this.validator = validator;
      return this;
    }

    public Builder withAdministratorBasicAuth() {
      return withBasicAuth("Administrator", "Administrator");
    }

    public Builder withBasicAuth(String username, String password) {
      this.authHeader = Base64.getEncoder()
          .encodeToString((username + ":" + password).getBytes(Charset.defaultCharset()));
      return this;
    }

    public Builder withBearerAuth(String jwt) {
      this.authHeader = "Bearer " + jwt;
      return this;
    }

    private Builder(String url) {
      this.url = url;
    }

    public void execute(RESTResponseValidator validator) {
      this.withValidator(validator).execute();
    }

    public void execute() {
      ObjectMapper mapper = new ObjectMapper();

      HttpClient client = new HttpAutomationClient(url).http();
      HttpUriRequest request;

      switch (this.verb) {
        case POST:
          request = new HttpPost(url);
          break;
        case OPTIONS:
          request = new HttpOptions(url);
          break;
        case DELETE:
          request = new HttpDelete(url);
          break;
        case PUT:
          request = new HttpPut(url);
          break;
        case HEAD:
          request = new HttpHead(url);
          break;
        case GET:
        default:
          request = new HttpGet(url);
          break;
      }

      request.setHeader("Accept", accept);

      if (authHeader != null && authHeader.length() > 0) {
        request.setHeader("Authorization", authHeader);
      }

      try {
        HttpResponse response = client.execute(request);
        String body = IOUtils.toString(
            response.getEntity().getContent(),
            StandardCharsets.UTF_8.name()
        );
        log.info("response body:\n" + body);
        JsonNode node = mapper.readTree(body);


        validator.validateResponse(node, response);

      } catch (IOException e) {
        throw new RuntimeException(e);
      }

    }

  }

  public static Builder builder(String url) {
    return new Builder(url);
  }


}
