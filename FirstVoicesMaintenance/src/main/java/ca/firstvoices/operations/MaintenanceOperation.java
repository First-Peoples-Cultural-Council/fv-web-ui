package ca.firstvoices.operations;

import org.nuxeo.ecm.core.api.CoreSession;

public abstract class MaintenanceOperation {

  protected CoreSession session;

  public MaintenanceOperation() {
    // Maintenance tasks should just be available to system admins
    // This is done via a filter in fv-maintenance contrib, but here for extra caution
    if (!session.getPrincipal().isAdministrator()) {
      throw new SecurityException("Privelege to execute maintenance operations is not granted to " + session.getPrincipal().getName());
    }
  }
}
