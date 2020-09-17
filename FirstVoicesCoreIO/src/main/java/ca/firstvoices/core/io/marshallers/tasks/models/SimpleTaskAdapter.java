package ca.firstvoices.core.io.marshallers.tasks.models;

import java.util.GregorianCalendar;
import java.util.List;

/**
 * Interface for a simple task type
 */
public interface SimpleTaskAdapter {

  String getId();

  void setId(String id);

  String getTargetDocId();

  void setTargetDocId(String targetDocId);

  GregorianCalendar getDateCreated();

  void setDateCreated(GregorianCalendar dateCreated);

  String getRequestedVisibility();

  void setRequestedVisibility(String requestedVisibility);

  String getRequestedBy();

  void setRequestedBy(String requestedBy);

  List<String> getTaskComments();

  void setTaskComments(List<String> taskComments);
}
