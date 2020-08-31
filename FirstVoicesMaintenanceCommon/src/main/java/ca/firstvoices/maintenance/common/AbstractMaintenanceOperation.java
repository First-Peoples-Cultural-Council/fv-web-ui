package ca.firstvoices.maintenance.common;

import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_DIALECT;

import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

/**
 * An abstract maintenace task that requires an `init` and `work` phase Provides some common methods
 * for maintenance tasks
 */
public abstract class AbstractMaintenanceOperation {

  /**
   * Maintenance tasks should just be available to system admins. This is done via a filter in
   * fv-maintenance contrib, but here for extra caution This should become a service as part of
   * First Voices Security
   */
  protected void limitToSuperAdmin(CoreSession session) throws OperationException {
    if (!session.getPrincipal().isAdministrator()) {
      throw new OperationException(
          "Privilege to execute maintenance operations is not granted to " + session.getPrincipal()
              .getName());
    }
  }

  /**
   * Will limit the operation to a dialect type
   *
   * @param dialect
   */
  protected void limitToDialect(DocumentModel dialect) throws OperationException {
    if (!dialect.getType().equals(FV_DIALECT)) {
      throw new OperationException("Document type must be FVDialect");
    }
  }

  /**
   * Main method to execute phases based on input `executeInitPhase` and `executeWorkPhase` must be
   * defined in child class Override to add more phases or modify logic
   *
   * @param doc   the input document
   * @param phase the phase to execute
   * @throws OperationException
   */
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
   * Init phase to queue a required job. Most of the time will simple add the job to the list of the
   * document. Called manually (directly via the operation) or can be called via listeners.
   *
   * @param doc
   */
  protected abstract void executeInitPhase(DocumentModel doc);

  /**
   * Work phase is called by the required jobs in overnight process. It can be called directly if
   * work needs to be done on outside of nightly windows
   *
   * @param doc
   */
  protected abstract void executeWorkPhase(DocumentModel doc);
}
