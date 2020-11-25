package ca.firstvoices.operations.visibility.services;

import org.nuxeo.ecm.core.api.DocumentModel;

/**
 * @author david
 */
public interface UpdateVisibilityService {
  DocumentModel updateVisibility(DocumentModel doc, String visibility);

  boolean isValidVisibility(String visibility);
}
