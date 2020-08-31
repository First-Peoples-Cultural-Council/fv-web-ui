package ca.firstvoices.maintenance.common;

import ca.firstvoices.data.utils.PropertyUtils;
import java.io.Serializable;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.SystemPrincipal;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventProducer;
import org.nuxeo.ecm.core.event.impl.InlineEventContext;
import org.nuxeo.runtime.api.Framework;

public class RequiredJobsUtils {

  private RequiredJobsUtils() {
    throw new IllegalStateException("Utility class");
  }

  public static void addToRequiredJobs(DocumentModel jobContainer, String jobId) {
    Event event = createEvent("addToRequiredJobs", jobContainer, jobId);
    Framework.getService(EventProducer.class).fireEvent(event);
  }

  public static void addToRequiredJobs(DocumentModel jobContainer, Set<String> jobIds) {
    Event event = createEvent("addToRequiredJobs", jobContainer, jobIds);
    Framework.getService(EventProducer.class).fireEvent(event);
  }

  public static void removeFromRequiredJobs(DocumentModel jobContainer, String jobId,
      boolean success) {
    Event event = createEvent("removeFromRequiredJobs", jobContainer, jobId);
    event.getContext().setProperty("success", success);

    Framework.getService(EventProducer.class).fireEvent(event);

  }

  static Event createEvent(String eventId, DocumentModel jobContainer, String jobId) {
    Set<String> jobIds = new HashSet<>(Collections.singletonList(jobId));
    return createEvent(eventId, jobContainer, jobIds);
  }

  static Event createEvent(String eventId, DocumentModel jobContainer, Set<String> jobIds) {
    Map<String, Serializable> eventProperties = new HashMap<>();
    eventProperties.put("jobContainer", (Serializable) jobContainer);
    eventProperties.put("jobIds", (Serializable) jobIds);

    EventContext ctx = new InlineEventContext(new SystemPrincipal(null), eventProperties);
    return ctx.newEvent(eventId);
  }

  public static boolean hasRequiredJobs(DocumentModel jobContainer, String jobId) {
    return PropertyUtils
        .getValuesAsList(jobContainer, CommonConstants.REQUIRED_JOBS_FULL_FIELD).contains(jobId);
  }
}
