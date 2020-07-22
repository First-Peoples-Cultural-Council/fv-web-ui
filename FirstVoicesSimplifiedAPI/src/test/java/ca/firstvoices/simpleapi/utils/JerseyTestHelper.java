package ca.firstvoices.simpleapi.utils;

import ca.firstvoices.simpleapi.JerseyApplication;
import com.sun.jersey.api.core.ApplicationAdapter;
import com.sun.jersey.api.core.ResourceConfig;
import java.io.IOException;
import java.net.ServerSocket;
import org.glassfish.grizzly.http.server.HttpServer;

public class JerseyTestHelper {
  private static JerseyTestHelper instance = null;

  public static JerseyTestHelper instance() {
    if (instance == null) {
      instance = new JerseyTestHelper();
    }
    return instance;
  }

  private JerseyTestHelper() {
  }

  private HttpServer server;
  private int port;
  private ResourceConfigCustomizer customizer = rc -> {
  };

  public void start(ResourceConfigCustomizer customizer) throws Exception {
    this.customizer = customizer;
    this.start();
  }

  public void start() throws Exception {
    ResourceConfig rc = new ApplicationAdapter(new JerseyApplication());
    rc.getFeatures().put("com.sun.jersey.api.json.POJOMappingFeature", true);
    customizer.customizeResourceConfig(rc);

    port = findFreePort();

    String url = "http://localhost:" + port + "/";

//    server = GrizzlyServerFactory.createHttpServer(url, rc);
    server.start();
  }


  public void shutdown() {
    server.stop();
    port = -1;
  }

  public int getPort() {
    return port;
  }

  public String getUrl(String path) {
    return String.format("http://localhost:%s%s", port, path);
  }

  private static int findFreePort() {
    try (ServerSocket socket = new ServerSocket(0)) {
      socket.setReuseAddress(true);
      return socket.getLocalPort();
    } catch (IOException e) {
      throw new RuntimeException("Cannot find free port");
    }
  }

  public interface ResourceConfigCustomizer {
    void customizeResourceConfig(ResourceConfig rc);
  }
}
