package ca.firstvoices.maintenance.services;

import ca.firstvoices.core.io.listeners.AbstractSyncListener;
import ca.firstvoices.data.utils.PropertyUtils;
import ca.firstvoices.maintenance.Constants;
import ca.firstvoices.maintenance.common.CommonConstants;
import java.util.HashSet;
import java.util.Set;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventProducer;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

public class MaintenanceLoggerImpl implements MaintenanceLogger {

  @Override
  public Set<String> getRequiredJobs(DocumentModel jobContainer) {
    return new HashSet<>(
        PropertyUtils.getValuesAsList(jobContainer, CommonConstants.REQUIRED_JOBS_FULL_FIELD));
  }

  @Override
  public void addToRequiredJobs(DocumentModel jobContainer, String job) {
    if (jobContainer != null) {
      CoreInstance
          .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
              session -> {
                // Use a SET to ensure we don't add duplicates
                Set<String> requiredJobs = getRequiredJobs(jobContainer);
                requiredJobs.add(job);
                jobContainer.setProperty(CommonConstants.MAINTENANCE_SCHEMA,
                    CommonConstants.REQUIRED_JOBS_FIELD, requiredJobs);

                // Avoid firing other events with this update
                AbstractSyncListener.disableDefaultEvents(jobContainer);

                // Update dialect
                session.saveDocument(jobContainer);

                sendEvent("Job Queued", job + " queued for `" + jobContainer.getTitle() + "`",
                    Constants.EXECUTE_REQUIRED_JOBS_QUEUED, session, jobContainer);
              });
    }
  }

  @Override
  public void removeFromRequiredJobs(DocumentModel jobContainer, String job, boolean success) {
    if (jobContainer != null) {
      CoreInstance
          .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
              session -> {
                Set<String> requiredJobs = getRequiredJobs(jobContainer);

                if (requiredJobs != null && !requiredJobs.isEmpty() && requiredJobs.contains(job)) {
                  requiredJobs.remove(job);
                  jobContainer.setProperty(CommonConstants.MAINTENANCE_SCHEMA,
                      CommonConstants.REQUIRED_JOBS_FIELD, requiredJobs);

                  // Avoid firing other events with this update
                  AbstractSyncListener.disableDefaultEvents(jobContainer);

                  // Update dialect
                  session.saveDocument(jobContainer);

                  String reason = Constants.EXECUTE_REQUIRED_JOBS_COMPLETE;

                  if (!success) {
                    reason = Constants.EXECUTE_REQUIRED_JOBS_FAILED;
                  }

                  sendEvent("Job Complete",
                      job + " completed for `" + jobContainer.getTitle() + "`", reason,
                      session, jobContainer);
                }
              });
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
  private void sendEvent(String status, String message, String eventId, CoreSession session,
      DocumentModel jobContainer) {
    DocumentEventContext ctx = new DocumentEventContext(session, session.getPrincipal(),
        jobContainer);
    ctx.setProperty("status", status);
    ctx.setComment(message);
    ctx.setCategory(Constants.REQUIRED_JOBS_FRIENDLY_NAME);
    Event event = ctx.newEvent(eventId);
    EventProducer eventProducer = Framework.getService(EventProducer.class);
    eventProducer.fireEvent(event);
  }
}
