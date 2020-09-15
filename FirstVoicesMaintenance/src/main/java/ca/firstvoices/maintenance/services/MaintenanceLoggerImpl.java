package ca.firstvoices.maintenance.services;

import ca.firstvoices.core.io.utils.PropertyUtils;
import ca.firstvoices.core.io.utils.SessionUtils;
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
                DocumentModel jobContainerWithSession = session.getDocument(jobContainer.getRef());

                Set<String> requiredJobs = getRequiredJobs(jobContainerWithSession);
                requiredJobs.add(job);

                jobContainerWithSession.setProperty(CommonConstants.MAINTENANCE_SCHEMA,
                    CommonConstants.REQUIRED_JOBS_FIELD, requiredJobs);

                SessionUtils.saveDocumentWithoutEvents(session, jobContainerWithSession,
                    true, null);

                sendEvent("Job Queued",
                    job + " queued for `" + jobContainerWithSession.getTitle() + "`",
                    Constants.EXECUTE_REQUIRED_JOBS_QUEUED, session, jobContainerWithSession);
              });
    }
  }

  @Override
  public void removeFromRequiredJobs(DocumentModel jobContainer, String job, boolean success) {
    if (jobContainer != null) {
      CoreInstance
          .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
              session -> {
                DocumentModel jobContainerWithSession = session.getDocument(jobContainer.getRef());

                Set<String> requiredJobs = getRequiredJobs(jobContainerWithSession);

                if (requiredJobs != null && !requiredJobs.isEmpty() && requiredJobs.contains(job)) {
                  requiredJobs.remove(job);
                  jobContainerWithSession.setProperty(CommonConstants.MAINTENANCE_SCHEMA,
                      CommonConstants.REQUIRED_JOBS_FIELD, requiredJobs);

                  SessionUtils.saveDocumentWithoutEvents(session, jobContainerWithSession,
                      true, null);

                  String reason = Constants.EXECUTE_REQUIRED_JOBS_COMPLETE;

                  if (!success) {
                    reason = Constants.EXECUTE_REQUIRED_JOBS_FAILED;
                  }

                  sendEvent("Job Complete",
                      job + " completed for `" + jobContainerWithSession.getTitle() + "`", reason,
                      session, jobContainerWithSession);
                }
              });
    }
  }

  @Override
  public void addToJobHistory() {
    throw new UnsupportedOperationException();
  }

  @Override
  public void logError() {
    throw new UnsupportedOperationException();
  }

  @Override
  public void logWarning() {
    throw new UnsupportedOperationException();
  }

  @Override
  public void logInsight() {
    throw new UnsupportedOperationException();
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
