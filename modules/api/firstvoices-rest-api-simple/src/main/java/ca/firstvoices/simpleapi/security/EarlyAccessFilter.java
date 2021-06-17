package ca.firstvoices.simpleapi.security;

import ca.firstvoices.simpleapi.exceptions.UnauthorizedAccessException;
import ca.firstvoices.simpleapi.nuxeo.SimpleAPINuxeoConfiguration;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Logger;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.ext.Provider;
import org.nuxeo.runtime.api.Framework;

@Provider
public class EarlyAccessFilter implements ContainerRequestFilter {

  private static final Logger log = Logger.getLogger(EarlyAccessFilter.class.getCanonicalName());

  private final Set<String> allowedSites = new HashSet<>();

  @Context
  private ResourceInfo resourceInfo;

  public EarlyAccessFilter() {
    SimpleAPINuxeoConfiguration config = Framework.getService(SimpleAPINuxeoConfiguration.class);
    allowedSites.addAll(config.getAllowedSites());
  }

  @Override
  public void filter(ContainerRequestContext requestContext) {
    UriInfo uriInfo = requestContext.getUriInfo();
    String path = uriInfo.getPath();

    if (!allowedSites.isEmpty() && path.contains("/sites/")) {
      boolean siteIsAllowed = false;

      for (String allowedSite : allowedSites) {
        if (path.contains(allowedSite)) {
          siteIsAllowed = true;
          break;
        }
      }

      if (!siteIsAllowed) {
        throw new UnauthorizedAccessException();
      }
    }
  }
}
