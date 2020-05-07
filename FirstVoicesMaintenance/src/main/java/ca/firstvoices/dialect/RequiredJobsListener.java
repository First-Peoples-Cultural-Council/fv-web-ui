package ca.firstvoices.dialect;

import ca.firstvoices.Constants;
import ca.firstvoices.dialect.categories.services.MigrateCategoriesService;
import ca.firstvoices.services.MaintenanceLogger;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.runtime.api.Framework;

public class RequiredJobsListener implements EventListener {

  @Override
  public void handleEvent(Event event) {

    if (event.getName().equals(Constants.EXECUTE_REQUIRED_JOBS_EVENT_ID)) {

      AutomationService automation = Framework.getService(AutomationService.class);

      MaintenanceLogger maintenanceLogger = Framework.getService(MaintenanceLogger.class);
      MigrateCategoriesService migrateCategoriesService = Framework.getService(
          MigrateCategoriesService.class);

      EventContext ctx = event.getContext();
      CoreSession session = ctx.getCoreSession();

      // Get all dialects that need jobs to execute
      // Note 1: Make ES query
      // Note 2: Make sure is NOT NULL covers empty arrays
      DocumentModelList dialects = session.query("SELECT * FROM FVDialect WHERE fv-maintenance:required_jobs/* IS NOT NULL ORDER BY dc:modified");

      // For testing, try just 1 dialect a time
      DocumentModel firstDialect = dialects.iterator().next();

      if (firstDialect != null) {
        Set<String> requiredJobs = maintenanceLogger.getRequiredJobs(firstDialect);
        if (requiredJobs != null && requiredJobs.size() > 0) {

          try {
            String firstRequiredJob = requiredJobs.iterator().next();

            // Input setting
            OperationContext operation = new OperationContext(session);
            operation.setInput(firstDialect);

            Map<String,Object> params = new HashMap<String,Object>();
            params.put("phase", 2);

            automation.run(operation, firstRequiredJob, params);
          } catch (OperationException e) {
            e.printStackTrace();
          }
        }
      }
    }
  }
}
