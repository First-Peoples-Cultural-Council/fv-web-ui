package ca.firstvoices.marshallers;

import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.adapter.DocumentAdapterFactory;

public class SimpleTaskAdapterFactory implements DocumentAdapterFactory {

  public Object getAdapter(DocumentModel doc, Class<?> itf) {
    return new SimpleTaskAdapterImpl(doc);
  }
}
