package ca.firstvoices.services;

import java.util.Set;
import org.nuxeo.ecm.core.api.DocumentModel;

public interface MaintenanceLogger {
  public Set<String> getRequiredJobs(DocumentModel jobContainer);

  public void addToRequiredJobs(DocumentModel jobContainer, String job);

  public void removeFromRequiredJobs(DocumentModel jobContainer, String job);

  public void addToJobHistory();

  public void logError();

  public void logWarning();

  public void logInsight();
}
