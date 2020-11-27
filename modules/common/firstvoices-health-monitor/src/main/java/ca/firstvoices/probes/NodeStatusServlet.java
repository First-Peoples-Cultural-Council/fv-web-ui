package ca.firstvoices.probes;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.juli.logging.Log;
import org.apache.juli.logging.LogFactory;
import org.nuxeo.runtime.api.Framework;

public class NodeStatusServlet extends HttpServlet {

  private ObjectMapper objectMapper = new ObjectMapper();
  private static Log log = LogFactory.getLog(NodeStatusServlet.class);

  public static class NodeStatus {
    public String instanceName;
    public String clusterID;
  }


  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {

    NodeStatus status = new NodeStatus();

    try {
      resp.setStatus(resp.SC_OK);
      resp.setContentType("application/json");

      status.instanceName = Framework.getProperty("org.nuxeo.ecm.instance.name", "unknown");
      status.clusterID = Framework.getProperty("repository.clustering.id", "unset");

      objectMapper.writeValue(resp.getOutputStream(), status);

    } catch (Exception e) {
      log.error("Caught an exception while generating status page", e);
      resp.setStatus(resp.SC_INTERNAL_SERVER_ERROR);
    }

  }

}
