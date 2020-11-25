package ca.firstvoices.core.io.marshallers.tasks;

import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.adapter.DocumentAdapterFactory;

/**
 * Provides DocumentModels with the ability to convert to a SimpleTask type
 * See extension org.nuxeo.ecm.core.api.DocumentAdapterService--adapters for details
 */
public class SimpleTaskAdapterFactory implements DocumentAdapterFactory {

  public Object getAdapter(DocumentModel doc, Class<?> itf) {
    return new SimpleTaskAdapterImpl(doc);
  }
}
