package ca.firstvoices.simpleapi;

import ca.firstvoices.simpleapi.exceptions.mappers.ErrorResponseEntity;
import ca.firstvoices.simpleapi.nuxeo.SimpleAPINuxeoConfiguration;
import java.io.IOException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import org.nuxeo.runtime.api.Framework;

@Provider
@AdministrativelyDisabled
public class AdministrativelyDisabledFilter implements ContainerRequestFilter {

  private final Set<String> disabledEndpoints = new HashSet<>();

  @Context
  private ResourceInfo resourceInfo;

  public AdministrativelyDisabledFilter() {
    SimpleAPINuxeoConfiguration config = Framework.getService(SimpleAPINuxeoConfiguration.class);
    disabledEndpoints.addAll(config.getDisabledEndpoints());
  }

  @Override
  public void filter(ContainerRequestContext context) throws IOException {
    Optional<AdministrativelyDisabled> annotation = Optional.ofNullable(
        resourceInfo.getResourceMethod().getAnnotation(AdministrativelyDisabled.class)
    );
    annotation.ifPresent(a -> {
      if (disabledEndpoints.contains(a.value())) {
        context.abortWith(
            Response.status(Response.Status.SERVICE_UNAVAILABLE).entity(
                new ErrorResponseEntity("service administratively disabled")
            ).build()
        );
      }
    });
  }
}
