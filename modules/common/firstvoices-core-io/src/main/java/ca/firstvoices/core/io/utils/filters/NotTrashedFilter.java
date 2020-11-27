package ca.firstvoices.core.io.utils.filters;

import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.Filter;

public class NotTrashedFilter implements Filter {

  @Override
  public boolean accept(DocumentModel docModel) {
    return !docModel.isTrashed();
  }
}
