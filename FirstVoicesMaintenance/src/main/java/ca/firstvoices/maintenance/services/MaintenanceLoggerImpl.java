package ca.firstvoices.maintenance.services;

import ca.firstvoices.maintenance.Constants;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventProducer;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

public class MaintenanceLoggerImpl implements MaintenanceLogger {

  @Override
  public Set<String> getRequiredJobs(DocumentModel jobContainer) {

    if (jobContainer == null) {
      return new HashSet<>();
    }

    // Get current required jobs
    String[] requiredJobsRawList = (String[]) jobContainer.getPropertyValue("fv-maintenance:required_jobs");
    if (requiredJobsRawList != null) {
      return new HashSet<>(Arrays.asList(requiredJobsRawList));
    }

    return new HashSet<>();
  }

  @Override
  public void addToRequiredJobs(DocumentModel jobContainer, String job) {
    if (jobContainer != null) {
      // Use a SET to ensure we don't add duplicates
      Set<String> requiredJobs = getRequiredJobs(jobContainer);
      requiredJobs.add(job);
      jobContainer.setProperty("fv-maintenance", "required_jobs", requiredJobs);

      // Update dialect
      CoreSession session = jobContainer.getCoreSession();
      session.saveDocument(jobContainer);

      sendEvent(
          "Job Queued",
          job + " queued for `" + jobContainer.getTitle() + "`",
          Constants.EXECUTE_REQUIRED_JOBS_QUEUED, session, jobContainer);
    }
  }

  @Override
  public void removeFromRequiredJobs(DocumentModel jobContainer, String job, boolean success) {
    if (jobContainer != null) {
      Set<String> requiredJobs = getRequiredJobs(jobContainer);

      if (requiredJobs != null && requiredJobs.size() > 0) {
        requiredJobs.remove(job);
        jobContainer.setProperty("fv-maintenance", "required_jobs", requiredJobs);

        // Update dialect
        CoreSession session = jobContainer.getCoreSession();
        session.saveDocument(jobContainer);

        String reason = Constants.EXECUTE_REQUIRED_JOBS_COMPLETE;

        if (!success) {
          reason = Constants.EXECUTE_REQUIRED_JOBS_FAILED;
        }

        sendEvent(
            "Job Complete",
            job + " completed for `" + jobContainer.getTitle() + "`",
            reason, session, jobContainer);
      }
    }
  }

  @Override
  public void addToJobHistory() {

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

  // This is sent for audit purposes at the moment
  // In the future Listeners could catch these events to send emails, and turn on features
  private void sendEvent(String status, String message, String eventId, CoreSession session, DocumentModel jobContainer) {
    EventProducer eventProducer = Framework.getService(EventProducer.class);
    DocumentEventContext ctx = new DocumentEventContext(session, session.getPrincipal(), jobContainer);
    ctx.setProperty("status", status);
    ctx.setComment(message);
    ctx.setCategory(Constants.REQUIRED_JOBS_FRIENDLY_NAME);
    Event event = ctx.newEvent(eventId);
    eventProducer.fireEvent(event);
  }
}
