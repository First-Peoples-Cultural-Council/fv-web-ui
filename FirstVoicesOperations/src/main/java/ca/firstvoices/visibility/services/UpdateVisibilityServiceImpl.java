package ca.firstvoices.visibility.services;

import static ca.firstvoices.lifecycle.Constants.DISABLED_STATE;
import static ca.firstvoices.lifecycle.Constants.DISABLE_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.ENABLED_STATE;
import static ca.firstvoices.lifecycle.Constants.ENABLE_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.visibility.Constants.MEMBERS;
import static ca.firstvoices.visibility.Constants.PUBLIC;
import static ca.firstvoices.visibility.Constants.TEAM;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import java.util.HashMap;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
public class UpdateVisibilityServiceImpl implements UpdateVisibilityService {

  private HashMap<String, String> mappedStates;
  private FirstVoicesPublisherService publisherService;

  @Override
  public DocumentModel updateVisibility(DocumentModel doc, String visibility) {
    if (!doc.getLifeCyclePolicy().equals("fv-lifecycle")) {
      throw new NuxeoException("Document Life Cycle Policy Must Be 'fv-lifecycle'");
    }

    if (doc.isProxy() || doc.isVersion()) {
      throw new NuxeoException("Document Must not be versioned or a proxy'");
    }

    mappedStates = new HashMap<>();
    mappedStates.put(MEMBERS, ENABLED_STATE);
    mappedStates.put(TEAM, DISABLED_STATE);
    mappedStates.put(PUBLIC, PUBLISHED_STATE);

    if (doc.getCurrentLifeCycleState().equals(mappedStates.get(visibility))) {
      return doc;
    }

    switch (visibility) {
      case MEMBERS:
        if (!doc.getCurrentLifeCycleState().equals(ENABLED_STATE)) {
          doc.followTransition(ENABLE_TRANSITION);
        }
        break;
      case TEAM:
        if (!doc.getCurrentLifeCycleState().equals(DISABLED_STATE)) {
          doc.followTransition(DISABLE_TRANSITION);
        }
        break;
      case PUBLIC:
        publisherService = Framework.getService(FirstVoicesPublisherService.class);
        doc = publisherService.publish(doc);
        break;
      default:
        break;
    }
    return doc;
  }
}
