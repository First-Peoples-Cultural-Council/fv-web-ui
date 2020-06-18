package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;

/**
 * @author david
 */
public interface GetTasksService {

  DocumentModelList getTasksForUser(CoreSession session, NuxeoPrincipal principal);

}
