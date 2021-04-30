package ca.firstvoices.widgets;

import ca.firstvoices.maintenance.common.CommonConstants;
import java.util.List;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.test.CapturingEventListener;

public class WidgetsTestUtils {
  private WidgetsTestUtils() {
    throw new IllegalStateException("Utility class");
  }

  public static Event getAddToRequiredJobsEvent(CapturingEventListener capturingEvents) {
    List<Event> firedEvents = capturingEvents.getCapturedEvents();
    Event addToRequiredJobsEvent = firedEvents.stream().findFirst().filter(
        e -> CommonConstants.ADD_TO_REQUIRED_JOBS_EVENT_ID.equals(e.getName())
    ).orElse(null);

    return addToRequiredJobsEvent;
  }
}
