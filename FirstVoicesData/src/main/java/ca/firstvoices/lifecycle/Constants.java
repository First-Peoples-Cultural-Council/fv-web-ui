package ca.firstvoices.lifecycle;

/**
 * @author david
 */
public class Constants {

  private Constants() {
    throw new IllegalStateException("Utility class");
  }

  public static final String NEW_STATE = "New";
  public static final String ENABLED_STATE = "Enabled";
  public static final String DISABLED_STATE = "Disabled";
  public static final String PUBLISHED_STATE = "Published";

  public static final String PUBLISH_TRANSITION = "Publish";
  public static final String ENABLE_TRANSITION = "Enable";
  public static final String UNPUBLISH_TRANSITION = "Unpublish";
  public static final String DISABLE_TRANSITION = "Disable";
  public static final String REPUBLISH_TRANSITION = "Republish";

}
