package ca.firstvoices.maintenance.common;

public class CommonConstants {

  private CommonConstants() {
    throw new IllegalStateException("Utility class");
  }

  public static final String MAINTENANCE_SCHEMA = "fv-maintenance";

  public static final String REQUIRED_JOBS_FIELD = "required_jobs";

  public static final String REQUIRED_JOBS_FULL_FIELD =
      MAINTENANCE_SCHEMA + ":" + REQUIRED_JOBS_FIELD;

  public static final String ADD_TO_REQUIRED_JOBS_EVENT_ID = "addToRequiredJobs";

  public static final String REMOVE_FROM_REQUIRED_JOBS_EVENT_ID = "removeFromRequiredJobs";
}
