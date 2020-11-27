package ca.firstvoices.data.lifecycle;

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
  public static final String REPUBLISH_STATE = "Republish";

  public static final String PUBLISH_TRANSITION = "Publish";
  public static final String ENABLE_TRANSITION = "Enable";
  public static final String UNPUBLISH_TRANSITION = "Unpublish";
  public static final String DISABLE_TRANSITION = "Disable";
  public static final String REPUBLISH_TRANSITION = "Republish";
  public static final String REVERT_TO_NEW = "RevertToNew";

  // Visibility constants
  public static final String TEAM = "team";
  public static final String MEMBERS = "members";
  public static final String PUBLIC = "public";
}
