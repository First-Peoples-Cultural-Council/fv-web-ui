package ca.firstvoices.maintenance;

import static ca.firstvoices.schemas.DomainTypesConstants.FV_DIALECT;

import ca.firstvoices.maintenance.services.MaintenanceLogger;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.webengine.model.exceptions.WebSecurityException;
import org.nuxeo.runtime.api.Framework;

/**
 *
 */
public abstract class AbstractMaintenanceOperation {

  private final MaintenanceLogger ml = Framework.getService(MaintenanceLogger.class);

  /**
   * Maintenance tasks should just be available to system admins. This is done via a filter in
   * fv-maintenance contrib, but here for extra caution This should become a service as part of
   * First Voices Security
   */
  protected void limitToSuperAdmin(CoreSession session) throws WebSecurityException {
    if (!session.getPrincipal().isAdministrator()) {
      throw new WebSecurityException(
          "Privilege to execute maintenance operations is not granted to " + session.getPrincipal()
              .getName());
    }
  }

  /**
   * Will limit the operation to a dialect type
   * @param dialect
   */
  protected void limitToDialect(DocumentModel dialect) throws OperationException {
    if (!dialect.getType().equals(FV_DIALECT)) {
      throw new OperationException("Document type must be FVDialect");
    }
  }

  protected MaintenanceLogger getMaintenanceLogger() {
    return ml;
  }

  protected void executePhases(DocumentModel doc, String phase) throws OperationException {
    switch (String.valueOf(phase)) {
      case "init":
        executeInitPhase(doc);
        break;

      case "work":
        executeWorkPhase(doc);
        break;

      default:
        throw new OperationException("A phase was not specified for this operation");
    }
  }

  /**
   * Init phase to queue a required job.
   * Called manually or via listeners.
   * @param doc
   */
  protected abstract void executeInitPhase(DocumentModel doc);

  /**
   * Work phase called by required jobs in overnight process.
   * @param doc
   */
  protected abstract void executeWorkPhase(DocumentModel doc);
}
