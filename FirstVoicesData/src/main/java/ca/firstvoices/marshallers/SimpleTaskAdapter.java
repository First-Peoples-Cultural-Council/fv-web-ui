package ca.firstvoices.marshallers;

import java.util.GregorianCalendar;

public interface SimpleTaskAdapter {

  public String getTitle();

  public void setTitle(String title);

  public String getRequestedBy();

  public GregorianCalendar getDateCreated();

  public void setRequestedBy(String requestedBy);
}
