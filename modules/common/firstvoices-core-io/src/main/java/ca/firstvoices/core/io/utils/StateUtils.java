package ca.firstvoices.core.io.utils;

import static ca.firstvoices.data.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.REPUBLISH_STATE;

import org.nuxeo.ecm.core.api.DocumentModel;

public final class StateUtils {

  private StateUtils() {
    throw new IllegalStateException("Utility class");
  }

  /**
   * Check if a document is in a published state
   * Does not check for presence of proxies
   * @param doc document to check
   * @return whether the document is in a published state
   */
  public static boolean isPublished(DocumentModel doc) {
    return PUBLISHED_STATE.equals(doc.getCurrentLifeCycleState())
        || REPUBLISH_STATE.equals(doc.getCurrentLifeCycleState());
  }

  public static boolean followTransitionIfAllowed(DocumentModel doc, String transition) {
    if (doc.getAllowedStateTransitions().contains(transition)) {
      return doc.followTransition(transition);
    }

    return false;
  }

  public static String visibilityToState(String visibility) {
    switch (visibility) {
      case "team":
        return "Disabled";

      case "members":
        return "Enabled";

      case "public":
        return "Published";

      default:
        return "";
    }
  }

  public static String stateToVisibility(String state) {
    switch (state) {
      case "Disabled":
      case "New":
        return "team";

      case "Enabled":
        return "members";

      case "Published":
        return "public";

      default:
        return "";
    }
  }
}
