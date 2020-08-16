package ca.firstvoices.marshallers;

import java.util.GregorianCalendar;
import org.nuxeo.ecm.core.api.DocumentModel;

public class SimpleTaskAdapterImpl implements SimpleTaskAdapter {

  public String title;
  public String requestedBy;
  public GregorianCalendar dateCreated;

  public GregorianCalendar getDateCreated() {
    return dateCreated;
  }

  public void setDateCreated(GregorianCalendar dateCreated) {
    this.dateCreated = dateCreated;
  }

  public SimpleTaskAdapterImpl(DocumentModel doc) {
    this.setTitle(doc.getTitle());
    this.setDateCreated((GregorianCalendar) doc.getPropertyValue("dc:created"));
  }

  @Override
  public String getTitle() {
    return title;
  }

  @Override
  public void setTitle(String title) {
    this.title = title;
  }

  @Override
  public String getRequestedBy() {
    return requestedBy;
  }

  @Override
  public void setRequestedBy(String requestedBy) {
    this.requestedBy = requestedBy;
  }
}
