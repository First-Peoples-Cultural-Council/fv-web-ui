package ca.firstvoices.simpleapi.endpoints;

import ca.firstvoices.simpleapi.security.UserContextStore;
import ca.firstvoices.simpleapi.services.FirstVoicesService;
import org.nuxeo.runtime.api.Framework;

public abstract class AbstractServiceEndpoint {
  private FirstVoicesService firstVoicesService;

  protected FirstVoicesService getFirstVoicesService() {
    if (firstVoicesService == null) {
      firstVoicesService = Framework.getService(FirstVoicesService.class);
      if (firstVoicesService == null) {
        throw new IllegalStateException("Failed to inject FirstVoicesService!");
      }
    }
    return firstVoicesService;
  }

  private UserContextStore userContextStore;

  protected UserContextStore getUserContextStore() {
    if (userContextStore == null) {
      userContextStore = Framework.getService(UserContextStore.class);
      if (userContextStore == null) {
        throw new IllegalStateException("Failed to inject UserContextStore!");
      }
    }
    return userContextStore;
  }
}
