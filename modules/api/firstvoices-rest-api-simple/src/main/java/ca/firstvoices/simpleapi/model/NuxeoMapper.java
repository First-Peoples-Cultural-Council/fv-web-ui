package ca.firstvoices.simpleapi.model;

import org.nuxeo.ecm.core.api.DocumentModel;

public interface NuxeoMapper<T> {
  T mapFrom(DocumentModel dm);
}
