package ca.firstvoices.maintenance.services;

import java.util.Set;
import org.nuxeo.ecm.core.api.DocumentModel;

public interface MaintenanceLogger {

  Set<String> getRequiredJobs(DocumentModel jobContainer);

  void addToRequiredJobs(DocumentModel jobContainer, String job);

  void removeFromRequiredJobs(DocumentModel jobContainer, String job, boolean success);

  void addToJobHistory();

  void logError();

  void logWarning();

  void logInsight();
}
