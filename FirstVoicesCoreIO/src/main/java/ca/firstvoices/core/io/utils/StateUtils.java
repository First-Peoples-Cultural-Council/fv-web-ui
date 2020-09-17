package ca.firstvoices.core.io.utils;

import static ca.firstvoices.data.lifecycle.Constants.PUBLISHED_STATE;

import org.nuxeo.ecm.core.api.DocumentModel;

public final class StateUtils {

  private StateUtils() {
    throw new IllegalStateException("Utility class");
  }

  public static boolean isPublished(DocumentModel doc) {
    return PUBLISHED_STATE.equals(doc.getCurrentLifeCycleState());
  }
}
