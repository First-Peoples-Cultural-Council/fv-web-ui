package ca.firstvoices.operations.dialect.categories.services;

import java.util.Map;
import org.nuxeo.ecm.core.api.DocumentModel;

/**
 * @author david
 */
public interface CategoryService {

  DocumentModel updateCategory(DocumentModel doc, Map<String, String> properties);
}
