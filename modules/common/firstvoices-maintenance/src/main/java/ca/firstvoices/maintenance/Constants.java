package ca.firstvoices.maintenance;

public class Constants {

  private Constants() {
    throw new IllegalStateException("Utility class");
  }

  // Required job (site specific)
  public static final String REQUIRED_JOBS_FRIENDLY_NAME = "Maintenance: Required Jobs";
  public static final String EXECUTE_REQUIRED_JOBS_EVENT_ID = "executeRequiredJobs";
  public static final String EXECUTE_REQUIRED_JOBS_QUEUED =
      EXECUTE_REQUIRED_JOBS_EVENT_ID + "_queued";
  public static final String EXECUTE_REQUIRED_JOBS_COMPLETE =
      EXECUTE_REQUIRED_JOBS_EVENT_ID + "_completed";
  public static final String EXECUTE_REQUIRED_JOBS_FAILED =
      EXECUTE_REQUIRED_JOBS_EVENT_ID + "_failed";

  // Global jobs
  public static final String EXECUTE_GLOBAL_JOBS_EVENT_ID = "executeGlobalJobs";
}