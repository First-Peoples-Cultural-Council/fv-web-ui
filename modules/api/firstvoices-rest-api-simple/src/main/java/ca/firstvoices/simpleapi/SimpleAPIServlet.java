package ca.firstvoices.simpleapi;

import ca.firstvoices.simpleapi.security.JWTFilter;
import org.apache.catalina.filters.CorsFilter;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletContainer;

public class SimpleAPIServlet extends ServletContainer {

  public SimpleAPIServlet() {
    super(
        ResourceConfig.forApplication(new JerseyApplication())
            .register(new JWTFilter())
            .register(CorsFilter.class)
            .register(new AdministrativelyDisabledFilter())
    );
  }
}
