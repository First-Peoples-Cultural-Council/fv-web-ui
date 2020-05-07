package ca.firstvoices.services;

import ca.firstvoices.dialect.categories.Constants;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public class MaintenanceLoggerImpl implements MaintenanceLogger {

  @Override
  public Set<String> getRequiredJobs(DocumentModel jobContainer) {
    // Get current required jobs
    String[] requiredJobsRawList = (String[]) jobContainer.getPropertyValue("fv-maintenance:required_jobs");
    return new HashSet<>(Arrays.asList(requiredJobsRawList));
  }

  @Override
  public void addToRequiredJobs(DocumentModel jobContainer, String job) {
    // Use a SET to ensure we don't add duplicates
    Set<String> requiredJobs = getRequiredJobs(jobContainer);
    requiredJobs.add(Constants.MIGRATE_CATEGORIES_JOB_ID);
    jobContainer.setProperty("fv-maintenance", "required_jobs", requiredJobs);

    // Update dialect
    CoreSession session = jobContainer.getCoreSession();
    session.saveDocument(jobContainer);
  }

  @Override
  public void removeFromRequiredJobs() {

  }

  @Override
  public void logError() {

  }

  @Override
  public void logWarning() {

  }

  @Override
  public void logInsight() {

  }
}
