package ca.firstvoices.core.io.marshallers.tasks;

import ca.firstvoices.core.io.marshallers.tasks.models.SimpleTaskAdapter;
import java.util.GregorianCalendar;
import java.util.List;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.model.impl.ListProperty;

/**
 * Implementation of simple task type
 */
public class SimpleTaskAdapterImpl implements SimpleTaskAdapter {

  private String id = null;
  private String targetDocId = null;
  private GregorianCalendar dateCreated;
  private String requestedVisibility;
  private String requestedBy;
  private List<String> taskComments;

  /**
   * Convert a document model to a simple task model
   * @param doc
   */
  public SimpleTaskAdapterImpl(DocumentModel doc) {

    this.setId(doc.getId());

    // This is the document the task is executed on
    // We get the first value of a list as an ID, and enrich it in the SimpleTaskWriter
    ListProperty targetDocIdsList = (ListProperty) doc.getProperty("nt:targetDocumentsIds");

    if (!targetDocIdsList.isEmpty()) {
      this.setTargetDocId(String.valueOf(targetDocIdsList.get(0).getValueForWrite()));
    }

    this.setDateCreated((GregorianCalendar) doc.getPropertyValue("dc:created"));

    // Requested visibility (if it was set)
    // For backwards compatibility this will store the name of the directive
    // And transform it in the enricher (e.g. "Approval to Enable required" -> "members")
    this.setRequestedVisibility(String.valueOf(doc.getPropertyValue("nt:directive")));

    // Username of person who initiated this task; we can enrich this later
    this.setRequestedBy(String.valueOf(doc.getPropertyValue("nt:initiator")));

    // Any comments that may exist on the task, provided by the initiator
    this.setTaskComments((List<String>) doc.getPropertyValue("nt:taskComments"));
  }

  @Override
  public String getId() {
    return id;
  }

  @Override
  public void setId(String id) {
    this.id = id;
  }

  @Override
  public String getTargetDocId() {
    return targetDocId;
  }

  @Override
  public void setTargetDocId(String targetDocId) {
    this.targetDocId = targetDocId;
  }

  @Override
  public GregorianCalendar getDateCreated() {
    return dateCreated;
  }

  @Override
  public void setDateCreated(GregorianCalendar dateCreated) {
    this.dateCreated = dateCreated;
  }

  @Override
  public String getRequestedVisibility() {
    return requestedVisibility;
  }

  @Override
  public void setRequestedVisibility(String requestedVisibility) {
    this.requestedVisibility = requestedVisibility;
  }

  @Override
  public String getRequestedBy() {
    return requestedBy;
  }

  @Override
  public void setRequestedBy(String requestedBy) {
    this.requestedBy = requestedBy;
  }

  @Override
  public List<String> getTaskComments() {
    return taskComments;
  }

  @Override
  public void setTaskComments(List<String> taskComments) {
    this.taskComments = taskComments;
  }
}
