package ca.firstvoices.maintenance.services;

import java.util.Set;
import org.nuxeo.ecm.core.api.DocumentModel;

public interface MaintenanceLogger {

  Set<String> getRequiredJobs(DocumentModel jobContainer);

  /**
   * Will add a job to the required jobs
   * Once complete sends {@link ca.firstvoices.maintenance.Constants#EXECUTE_REQUIRED_JOBS_QUEUED}
   * @param jobContainer
   * @param job
   */
  void addToRequiredJobs(DocumentModel jobContainer, String job);

  /**
   * Will remove a job from the required jobs
   * Once complete sends {@link ca.firstvoices.maintenance.Constants#EXECUTE_REQUIRED_JOBS_COMPLETE}
   * @param jobContainer
   * @param job
   */
  void removeFromRequiredJobs(DocumentModel jobContainer, String job, boolean success);

  void addToJobHistory();

  void logError();

  void logWarning();

  void logInsight();
}
